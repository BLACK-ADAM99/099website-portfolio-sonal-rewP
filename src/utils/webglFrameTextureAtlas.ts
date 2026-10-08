// ============================================================================
// PREDICTIVE 60-FRAME WEBGL TEXTURE-ATLAS BUFFERING ENGINE
// Pre-caches the next 60 frames in a low-latency paged WebGL Texture-Atlas
// using gl.texSubImage2D + hardware GLSL sub-frame blending for zero frame-drops.
// ============================================================================

export const PREDICTIVE_LOOKAHEAD_FRAMES = 60; // Pre-cache next 60 frames (1.0s @ 60FPS)
export const REVERSE_GUARD_FRAMES = 8; // Guard buffer for instantaneous scroll reversal
export const ATLAS_CAPACITY_FRAMES = 72; // Total resident frames in the WebGL Texture-Atlas (60 ahead + active + guard)

// Each WebGL texture page stores a 3x3 grid (9 tiles) -> 8 pages = 72 frames
const TILES_PER_ROW = 3;
const TILES_PER_COL = 3;
const TILES_PER_PAGE = TILES_PER_ROW * TILES_PER_COL; // 9 tiles per page
const ATLAS_PAGE_COUNT = Math.ceil(ATLAS_CAPACITY_FRAMES / TILES_PER_PAGE); // 8 pages = 72 tiles
const TILE_PIXEL_WIDTH = 640;
const TILE_PIXEL_HEIGHT = 360;
const PAGE_PIXEL_WIDTH = TILE_PIXEL_WIDTH * TILES_PER_ROW; // 1920
const PAGE_PIXEL_HEIGHT = TILE_PIXEL_HEIGHT * TILES_PER_COL; // 1080

export interface AtlasSlotDescriptor {
  slotIndex: number;
  pageIndex: number;
  col: number;
  row: number;
  uvOffset: [number, number];
  uvScale: [number, number];
  frameIndex: number;
  lastAccessedTick: number;
}

export interface PredictiveAtlasTelemetry {
  residentFrames: number;
  predictiveLookaheadCount: number;
  queuedUploads: number;
  atlasPageCount: number;
  webglActive: boolean;
  hitRatePct: number;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
  varying vec2 v_uv;

  uniform sampler2D u_pageTexA;
  uniform sampler2D u_pageTexB;
  uniform vec4 u_uvRectA; // xy = offset, zw = scale
  uniform vec4 u_uvRectB; // xy = offset, zw = scale
  uniform float u_mixFactor;
  uniform float u_opacity;
  uniform float u_zoomScale;

  void main() {
    vec2 centered = (v_uv - 0.5) / max(0.5, u_zoomScale) + 0.5;
    vec2 clampedUv = clamp(centered, 0.001, 0.999);

    vec2 uvA = u_uvRectA.xy + clampedUv * u_uvRectA.zw;
    vec2 uvB = u_uvRectB.xy + clampedUv * u_uvRectB.zw;

    vec4 colA = texture2D(u_pageTexA, uvA);
    vec4 colB = texture2D(u_pageTexB, uvB);

    vec4 blended = mix(colA, colB, clamp(u_mixFactor, 0.0, 1.0));
    gl_FragColor = vec4(blended.rgb, blended.a * u_opacity);
  }
`;

export class WebGLPredictiveTextureAtlas {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private pageTextures: WebGLTexture[] = [];
  private slots: AtlasSlotDescriptor[] = [];
  private frameToSlot = new Map<number, number>();
  private bitmapMirror = new Map<number, ImageBitmap>();

  // Uniform locations
  private uPageTexA: WebGLUniformLocation | null = null;
  private uPageTexB: WebGLUniformLocation | null = null;
  private uUvRectA: WebGLUniformLocation | null = null;
  private uUvRectB: WebGLUniformLocation | null = null;
  private uMixFactor: WebGLUniformLocation | null = null;
  private uOpacity: WebGLUniformLocation | null = null;
  private uZoomScale: WebGLUniformLocation | null = null;

  // Offscreen tile scaler canvas for gl.texSubImage2D normalization
  private tileStagingCanvas: HTMLCanvasElement | null = null;
  private tileStagingCtx: CanvasRenderingContext2D | null = null;

  private tickCounter = 0;
  private cacheHits = 0;
  private cacheLookups = 0;
  private pendingFrameQueue: number[] = [];

  constructor() {
    this.initSlots();
  }

  private initSlots(): void {
    this.slots = [];
    for (let s = 0; s < ATLAS_CAPACITY_FRAMES; s++) {
      const pageIndex = Math.floor(s / TILES_PER_PAGE);
      const localIdx = s % TILES_PER_PAGE;
      const col = localIdx % TILES_PER_ROW;
      const row = Math.floor(localIdx / TILES_PER_ROW);
      this.slots.push({
        slotIndex: s,
        pageIndex,
        col,
        row,
        uvOffset: [col / TILES_PER_ROW, row / TILES_PER_COL],
        uvScale: [1 / TILES_PER_ROW, 1 / TILES_PER_COL],
        frameIndex: -1,
        lastAccessedTick: 0,
      });
    }
  }

  public attachCanvas(canvas: HTMLCanvasElement): boolean {
    if (this.canvas === canvas && this.gl) return true;
    this.canvas = canvas;

    try {
      const gl =
        (canvas.getContext('webgl2', {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance',
          desynchronized: true,
        }) as WebGL2RenderingContext | null) ||
        (canvas.getContext('webgl', {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance',
        }) as WebGLRenderingContext | null);

      if (!gl) return false;
      this.gl = gl;

      const vs = this.compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
      if (!vs || !fs) return false;

      const prog = gl.createProgram();
      if (!prog) return false;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.deleteProgram(prog);
        return false;
      }

      this.program = prog;
      gl.useProgram(prog);

      // Fullscreen quad VBO
      const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      this.uPageTexA = gl.getUniformLocation(prog, 'u_pageTexA');
      this.uPageTexB = gl.getUniformLocation(prog, 'u_pageTexB');
      this.uUvRectA = gl.getUniformLocation(prog, 'u_uvRectA');
      this.uUvRectB = gl.getUniformLocation(prog, 'u_uvRectB');
      this.uMixFactor = gl.getUniformLocation(prog, 'u_mixFactor');
      this.uOpacity = gl.getUniformLocation(prog, 'u_opacity');
      this.uZoomScale = gl.getUniformLocation(prog, 'u_zoomScale');

      // Allocate Page 0 upfront; remaining pages allocate on-demand to guarantee instant <5ms mount
      this.pageTextures = [];
      this.ensurePageTexture(0);

      if (!this.tileStagingCanvas) {
        this.tileStagingCanvas = document.createElement('canvas');
        this.tileStagingCanvas.width = TILE_PIXEL_WIDTH;
        this.tileStagingCanvas.height = TILE_PIXEL_HEIGHT;
        this.tileStagingCtx = this.tileStagingCanvas.getContext('2d', { alpha: false });
        if (this.tileStagingCtx) {
          this.tileStagingCtx.imageSmoothingEnabled = true;
          this.tileStagingCtx.imageSmoothingQuality = 'medium';
        }
      }

      return true;
    } catch {
      this.gl = null;
      return false;
    }
  }

  private ensurePageTexture(pageIndex: number): WebGLTexture | null {
    const gl = this.gl;
    if (!gl || pageIndex < 0 || pageIndex >= ATLAS_PAGE_COUNT) return null;
    if (this.pageTextures[pageIndex]) return this.pageTextures[pageIndex];

    const tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      PAGE_PIXEL_WIDTH,
      PAGE_PIXEL_HEIGHT,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    this.pageTextures[pageIndex] = tex;
    return tex;
  }

  private compileShader(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  public get size(): number {
    return this.frameToSlot.size;
  }

  public get isWebGLReady(): boolean {
    return Boolean(this.gl && this.program && this.pageTextures.length > 0);
  }

  public has(frameIndex: number): boolean {
    return this.frameToSlot.has(frameIndex);
  }

  public getBitmap(frameIndex: number): ImageBitmap | undefined {
    this.cacheLookups++;
    const slotIdx = this.frameToSlot.get(frameIndex);
    if (slotIdx !== undefined) {
      this.cacheHits++;
      this.slots[slotIdx].lastAccessedTick = ++this.tickCounter;
    }
    return this.bitmapMirror.get(frameIndex);
  }

  public getOrNearestBitmap(frameIndex: number): ImageBitmap | undefined {
    const exact = this.getBitmap(frameIndex);
    if (exact) return exact;

    let bestBmp: ImageBitmap | undefined;
    let bestDist = Infinity;
    for (const [idx, bmp] of this.bitmapMirror.entries()) {
      const d = Math.abs(idx - frameIndex);
      if (d < bestDist) {
        bestDist = d;
        bestBmp = bmp;
      }
    }
    return bestBmp;
  }

  /**
   * Computes the ordered 60-frame predictive lookahead window along the user's scroll trajectory
   */
  public computePredictive60Window(
    centerFrameFloat: number,
    direction: number,
    totalFrames: number
  ): number[] {
    if (totalFrames <= 0) return [];
    const center = Math.max(0, Math.min(totalFrames - 1, Math.round(centerFrameFloat)));
    const dir = direction >= 0 ? 1 : -1;

    const prioritized: number[] = [center];

    // 1. Immediate neighborhood (±4 frames) for zero-latency micro-scrubbing
    for (let step = 1; step <= 4; step++) {
      const fwd = center + dir * step;
      const bwd = center - dir * step;
      if (fwd >= 0 && fwd < totalFrames) prioritized.push(fwd);
      if (bwd >= 0 && bwd < totalFrames) prioritized.push(bwd);
    }

    // 2. Predictive 60-Frame Forward Lookahead Buffer ([center + 5*dir ... center + 60*dir])
    for (let ahead = 5; ahead <= PREDICTIVE_LOOKAHEAD_FRAMES; ahead++) {
      const target = center + dir * ahead;
      if (target >= 0 && target < totalFrames) {
        prioritized.push(target);
      }
    }

    // 3. Reverse Guard Window (5 .. 8 frames behind)
    for (let back = 5; back <= REVERSE_GUARD_FRAMES; back++) {
      const guard = center - dir * back;
      if (guard >= 0 && guard < totalFrames) {
        prioritized.push(guard);
      }
    }

    this.pendingFrameQueue = prioritized.filter((f) => !this.frameToSlot.has(f));
    return prioritized;
  }

  /**
   * Uploads a decoded ImageBitmap into a dedicated tile of the WebGL Texture-Atlas via gl.texSubImage2D
   * and evicts only frames outside the 60-frame predictive lookahead window.
   */
  public uploadFrameToAtlas(
    frameIndex: number,
    bitmap: ImageBitmap,
    activeCenterFrame: number,
    scrollDirection: number = 1
  ): AtlasSlotDescriptor {
    this.tickCounter++;

    // If frame is already mapped to a slot, update in place
    const existingSlotIdx = this.frameToSlot.get(frameIndex);
    if (existingSlotIdx !== undefined) {
      const slot = this.slots[existingSlotIdx];
      slot.lastAccessedTick = this.tickCounter;
      const prevBmp = this.bitmapMirror.get(frameIndex);
      if (prevBmp && prevBmp !== bitmap) {
        try {
          prevBmp.close();
        } catch {
          // ignore
        }
      }
      this.bitmapMirror.set(frameIndex, bitmap);
      this.uploadSubTextureToSlot(slot, bitmap);
      return slot;
    }

    // Find an empty slot or evict a frame outside the 60-frame predictive window
    let chosenSlot: AtlasSlotDescriptor | undefined = this.slots.find((s) => s.frameIndex === -1);

    if (!chosenSlot) {
      const dir = scrollDirection >= 0 ? 1 : -1;
      let oldestTick = Infinity;

      for (const candidate of this.slots) {
        const delta = (candidate.frameIndex - activeCenterFrame) * dir;
        const isInsidePredictive60Window =
          delta >= -REVERSE_GUARD_FRAMES && delta <= PREDICTIVE_LOOKAHEAD_FRAMES;

        if (!isInsidePredictive60Window && candidate.lastAccessedTick < oldestTick) {
          oldestTick = candidate.lastAccessedTick;
          chosenSlot = candidate;
        }
      }

      // Fallback to global LRU if all slots are inside the window
      if (!chosenSlot) {
        for (const candidate of this.slots) {
          if (candidate.lastAccessedTick < oldestTick) {
            oldestTick = candidate.lastAccessedTick;
            chosenSlot = candidate;
          }
        }
      }
    }

    const targetSlot = chosenSlot || this.slots[0];

    // Evict previous occupant
    if (targetSlot.frameIndex !== -1) {
      const evictedFrame = targetSlot.frameIndex;
      this.frameToSlot.delete(evictedFrame);
      const evictedBmp = this.bitmapMirror.get(evictedFrame);
      this.bitmapMirror.delete(evictedFrame);
      if (evictedBmp) {
        try {
          evictedBmp.close();
        } catch {
          // ignore
        }
      }
    }

    targetSlot.frameIndex = frameIndex;
    targetSlot.lastAccessedTick = this.tickCounter;
    this.frameToSlot.set(frameIndex, targetSlot.slotIndex);
    this.bitmapMirror.set(frameIndex, bitmap);

    this.uploadSubTextureToSlot(targetSlot, bitmap);
    return targetSlot;
  }

  private uploadSubTextureToSlot(slot: AtlasSlotDescriptor, bitmap: ImageBitmap): void {
    const gl = this.gl;
    const tex = this.ensurePageTexture(slot.pageIndex);
    if (!gl || !tex || !this.tileStagingCanvas || !this.tileStagingCtx) return;

    try {
      this.tileStagingCtx.drawImage(
        bitmap,
        0,
        0,
        TILE_PIXEL_WIDTH,
        TILE_PIXEL_HEIGHT
      );

      const xOffset = slot.col * TILE_PIXEL_WIDTH;
      const yOffset = slot.row * TILE_PIXEL_HEIGHT;

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        xOffset,
        yOffset,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.tileStagingCanvas
      );
    } catch {
      // ignore transient context loss
    }
  }

  /**
   * Renders a sub-frame interpolated blend directly on the WebGL Texture-Atlas canvas
   */
  public renderInterpolatedAtlasPair(
    frameIndexA: number,
    frameIndexB: number,
    mixFactor: number,
    opacity: number = 1.0,
    zoomScale: number = 1.0
  ): boolean {
    const gl = this.gl;
    const prog = this.program;
    if (!gl || !prog || !this.canvas) return false;

    const slotIdxA = this.frameToSlot.get(frameIndexA) ?? this.findNearestSlotIndex(frameIndexA);
    if (slotIdxA === undefined) return false;
    const slotIdxB = this.frameToSlot.get(frameIndexB) ?? slotIdxA;

    const slotA = this.slots[slotIdxA];
    const slotB = this.slots[slotIdxB];
    const texA = this.pageTextures[slotA.pageIndex];
    const texB = this.pageTextures[slotB.pageIndex];
    if (!texA || !texB) return false;

    slotA.lastAccessedTick = ++this.tickCounter;
    slotB.lastAccessedTick = this.tickCounter;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(prog);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(this.uPageTexA, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texB);
    gl.uniform1i(this.uPageTexB, 1);

    gl.uniform4f(
      this.uUvRectA,
      slotA.uvOffset[0],
      slotA.uvOffset[1],
      slotA.uvScale[0],
      slotA.uvScale[1]
    );
    gl.uniform4f(
      this.uUvRectB,
      slotB.uvOffset[0],
      slotB.uvOffset[1],
      slotB.uvScale[0],
      slotB.uvScale[1]
    );
    gl.uniform1f(this.uMixFactor, slotIdxA === slotIdxB ? 0.0 : mixFactor);
    gl.uniform1f(this.uOpacity, opacity);
    gl.uniform1f(this.uZoomScale, zoomScale);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return true;
  }

  private findNearestSlotIndex(targetFrame: number): number | undefined {
    let bestSlot: number | undefined;
    let bestDist = Infinity;
    for (const [fIdx, sIdx] of this.frameToSlot.entries()) {
      const d = Math.abs(fIdx - targetFrame);
      if (d < bestDist) {
        bestDist = d;
        bestSlot = sIdx;
      }
    }
    return bestSlot;
  }

  public getTelemetry(): PredictiveAtlasTelemetry {
    const hitRate =
      this.cacheLookups > 0
        ? Math.min(100, Math.round((this.cacheHits / this.cacheLookups) * 100))
        : 100;
    return {
      residentFrames: this.frameToSlot.size,
      predictiveLookaheadCount: PREDICTIVE_LOOKAHEAD_FRAMES,
      queuedUploads: this.pendingFrameQueue.length,
      atlasPageCount: ATLAS_PAGE_COUNT,
      webglActive: this.isWebGLReady,
      hitRatePct: hitRate,
    };
  }

  public clear(): void {
    for (const bmp of this.bitmapMirror.values()) {
      try {
        bmp.close();
      } catch {
        // ignore
      }
    }
    this.bitmapMirror.clear();
    this.frameToSlot.clear();
    this.pendingFrameQueue = [];
    for (const slot of this.slots) {
      slot.frameIndex = -1;
      slot.lastAccessedTick = 0;
    }
  }
}
