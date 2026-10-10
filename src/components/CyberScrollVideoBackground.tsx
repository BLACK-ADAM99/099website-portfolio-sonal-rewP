import React, { useEffect, useRef } from 'react';
import {
  extractFrameBlobsFromZip,
  sortImageFilesChronologically,
} from '../utils/zipFrameExtractor';
import {
  WebGLPredictiveTextureAtlas,
  PREDICTIVE_LOOKAHEAD_FRAMES,
  PredictiveAtlasTelemetry,
} from '../utils/webglFrameTextureAtlas';
import videoFrame01Url from '../assets/images/video_frame_01_1791198873352.jpg';
import videoFrame02Url from '../assets/images/video_frame_02_1791198886046.jpg';
import videoFrame03Url from '../assets/images/video_frame_03_1791198905101.jpg';
import videoFrame04Url from '../assets/images/video_frame_04_1791198919451.jpg';

export interface CustomFrameSource {
  type: 'video' | 'zip' | 'images';
  blob?: Blob;
  files?: File[];
  url?: string;
}

export interface LenisGlobalScrollState {
  scroll: number;
  limit: number;
  velocity: number;
  isSmooth?: boolean;
}

declare global {
  interface Window {
    __lenisScrollState?: LenisGlobalScrollState;
  }
}

interface CyberScrollVideoBackgroundProps {
  customSource?: CustomFrameSource | null;
  onFrameStatusChange?: (status: {
    currentFrame: number;
    totalFrames: number;
    extractingProgress: number | null;
    videoTimeSec: number;
    cacheResidentCount?: number;
    interpolatedSubFrames?: number;
    resolutionLabel?: string;
    predictiveBufferedFrames?: number;
    atlasTelemetry?: PredictiveAtlasTelemetry;
  }) => void;
}

// ============================================================================
// 1. SMART GPU VRAM LRU (LEAST RECENTLY USED) CACHE FOR 4K IMAGEBITMAP FRAMES
// ============================================================================
class GpuFrameLRUCache {
  private map = new Map<number, ImageBitmap>();
  private readonly maxCapacity: number;

  constructor(maxCapacity: number = 96) {
    this.maxCapacity = maxCapacity;
  }

  public get size(): number {
    return this.map.size;
  }

  public has(frameIndex: number): boolean {
    return this.map.has(frameIndex);
  }

  public get(frameIndex: number): ImageBitmap | undefined {
    const bmp = this.map.get(frameIndex);
    if (bmp !== undefined) {
      this.map.delete(frameIndex);
      this.map.set(frameIndex, bmp);
    }
    return bmp;
  }

  public getOrNearest(frameIndex: number): ImageBitmap | undefined {
    const exact = this.get(frameIndex);
    if (exact) return exact;

    let bestBmp: ImageBitmap | undefined;
    let bestDist = Infinity;
    for (const [idx, bmp] of this.map.entries()) {
      const d = Math.abs(idx - frameIndex);
      if (d < bestDist) {
        bestDist = d;
        bestBmp = bmp;
      }
    }
    return bestBmp;
  }

  public set(
    frameIndex: number,
    bitmap: ImageBitmap,
    activeViewportFrame: number = frameIndex,
    protectedRadius: number = 10
  ): void {
    if (this.map.has(frameIndex)) {
      const existing = this.map.get(frameIndex);
      if (existing && existing !== bitmap) {
        try {
          existing.close();
        } catch {
          // ignore
        }
      }
      this.map.delete(frameIndex);
    }

    this.map.set(frameIndex, bitmap);

    while (this.map.size > this.maxCapacity) {
      let victimKey: number | undefined;

      for (const candidateKey of this.map.keys()) {
        if (Math.abs(candidateKey - activeViewportFrame) > protectedRadius) {
          victimKey = candidateKey;
          break;
        }
      }

      if (victimKey === undefined) {
        victimKey = this.map.keys().next().value;
      }

      if (victimKey === undefined) break;

      const evicted = this.map.get(victimKey);
      this.map.delete(victimKey);
      if (evicted) {
        try {
          evicted.close();
        } catch {
          // ignore
        }
      }
    }
  }

  public clear(): void {
    for (const bmp of this.map.values()) {
      try {
        bmp.close();
      } catch {
        // ignore
      }
    }
    this.map.clear();
  }
}

// ============================================================================
// 2. DYNAMIC HIGH-SPEED SCROLL FRAME INTERPOLATION UTILITY (60 FPS LOCK)
// ============================================================================
export interface InterpolatedFrameSample {
  frameFloat: number;
  progress: number;
  weight: number;
  velocityFactor: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const computeInterpolatedSubFrames = (
  prevFrameFloat: number,
  targetFrameFloat: number,
  prevVelocity: number,
  dtMs: number,
  totalFrames: number
): {
  samples: InterpolatedFrameSample[];
  currentVelocity: number;
  isInterpolating: boolean;
} => {
  const safeTotal = Math.max(1, totalFrames - 1);
  const frameDelta = targetFrameFloat - prevFrameFloat;
  const absDelta = Math.abs(frameDelta);

  const tickRatio = clamp(dtMs / 16.6667, 0.15, 3.0);
  const currentVelocity = frameDelta / tickRatio;

  return {
    samples: [
      {
        frameFloat: clamp(targetFrameFloat, 0, safeTotal),
        progress: clamp(targetFrameFloat / safeTotal, 0, 1),
        weight: 1.0,
        velocityFactor: clamp(frameDelta / 24, -1, 1),
      },
    ],
    currentVelocity,
    isInterpolating: absDelta > 0.5,
  };
};

// ============================================================================
export interface CinemaSeriesAct {
  actNumber: number;
  actRoman: string;
  title: string;
  subtitle: string;
  sectionId: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  accentHex: string;
  accentRgb: string;
  secondaryRgb: string;
}

export const CINEMA_SERIES_ACTS: CinemaSeriesAct[] = [
  {
    actNumber: 1,
    actRoman: 'ACT I',
    title: 'THE GENESIS CHAMBER',
    subtitle: '3D Obsidian Monolith & Console Ignition',
    sectionId: 'home',
    startSec: 0.0,
    endSec: 1.2,
    startFrame: 1,
    endFrame: 72,
    accentHex: '#06b6d4',
    accentRgb: '6, 182, 212',
    secondaryRgb: '56, 189, 248',
  },
  {
    actNumber: 2,
    actRoman: 'ACT II',
    title: 'QUANTUM STREAM CONVERGENCE',
    subtitle: 'Dual Stepped Decks & 6-Ribbon Photon Influx',
    sectionId: 'about',
    startSec: 1.2,
    endSec: 2.4,
    startFrame: 73,
    endFrame: 144,
    accentHex: '#d946ef',
    accentRgb: '217, 70, 239',
    secondaryRgb: '6, 182, 212',
  },
  {
    actNumber: 3,
    actRoman: 'ACT III',
    title: 'SILICON DIE IGNITION',
    subtitle: '32-Pin Gunmetal Processor Materialization',
    sectionId: 'services',
    startSec: 2.4,
    endSec: 3.6,
    startFrame: 145,
    endFrame: 216,
    accentHex: '#8b5cf6',
    accentRgb: '139, 92, 246',
    secondaryRgb: '217, 70, 239',
  },
  {
    actNumber: 4,
    actRoman: 'ACT IV',
    title: 'CHROMATIC PRISM OVERDRIVE',
    subtitle: '28-Spectrum Harmonic Field & Laser Refractors',
    sectionId: 'arsenal',
    startSec: 3.6,
    endSec: 4.6,
    startFrame: 217,
    endFrame: 276,
    accentHex: '#10b981',
    accentRgb: '16, 185, 129',
    secondaryRgb: '6, 182, 212',
  },
  {
    actNumber: 5,
    actRoman: 'ACT V',
    title: 'NEURAL MESH EXPANSION',
    subtitle: '40-Node Bipartite Circuit Architecture Unfold',
    sectionId: 'projects',
    startSec: 4.6,
    endSec: 5.7,
    startFrame: 277,
    endFrame: 342,
    accentHex: '#f59e0b',
    accentRgb: '245, 158, 11',
    secondaryRgb: '249, 115, 22',
  },
  {
    actNumber: 6,
    actRoman: 'ACT VI',
    title: 'SYNAPTIC MATRIX SYMPHONY',
    subtitle: 'High-Frequency Bezier Packet Conduit & Waveforms',
    sectionId: 'quantum-lab',
    startSec: 5.7,
    endSec: 6.8,
    startFrame: 343,
    endFrame: 408,
    accentHex: '#ec4899',
    accentRgb: '236, 72, 153',
    secondaryRgb: '139, 92, 246',
  },
  {
    actNumber: 7,
    actRoman: 'ACT VII',
    title: 'HYPER-CONDUIT PIPELINE',
    subtitle: 'Triangulated Neural Web & Peripheral Data Planes',
    sectionId: 'process',
    startSec: 6.8,
    endSec: 7.8,
    startFrame: 409,
    endFrame: 468,
    accentHex: '#f43f5e',
    accentRgb: '244, 63, 94',
    secondaryRgb: '234, 179, 8',
  },
  {
    actNumber: 8,
    actRoman: 'ACT VIII',
    title: 'HARMONIC TELEMETRY PULSE',
    subtitle: 'Orbital Resonance Rings & Deep Core Sync',
    sectionId: 'testimonials',
    startSec: 7.8,
    endSec: 8.6,
    startFrame: 469,
    endFrame: 516,
    accentHex: '#3b82f6',
    accentRgb: '59, 130, 246',
    secondaryRgb: '20, 184, 166',
  },
  {
    actNumber: 9,
    actRoman: 'ACT IX',
    title: 'SINGULARITY CORE SUPERNOVA',
    subtitle: 'Volumetric Diamond-White Quantum Core Finale',
    sectionId: 'contact',
    startSec: 8.6,
    endSec: 9.0,
    startFrame: 517,
    endFrame: 540,
    accentHex: '#84cc16',
    accentRgb: '132, 204, 22',
    secondaryRgb: '6, 182, 212',
  },
];

export const getActiveCinemaAct = (sec: number): { act: CinemaSeriesAct; localProgress: number } => {
  const clampedSec = Math.max(0, Math.min(9.0, sec));
  for (let i = 0; i < CINEMA_SERIES_ACTS.length; i++) {
    const act = CINEMA_SERIES_ACTS[i];
    if (clampedSec <= act.endSec || i === CINEMA_SERIES_ACTS.length - 1) {
      const span = Math.max(0.01, act.endSec - act.startSec);
      const localProgress = Math.max(0, Math.min(1, (clampedSec - act.startSec) / span));
      return { act, localProgress };
    }
  }
  return { act: CINEMA_SERIES_ACTS[0], localProgress: 0 };
};

// 3. DOM MILESTONE SCROLL CALIBRATION (1:1 SECTION <-> VIDEO FRAME ALIGNMENT)
// ============================================================================
interface ScrollMilestone {
  scrollY: number;
  videoProgress: number; // 0.0 -> 1.0 (maps to 00:00.00s -> 00:09.00s, Frame 1 -> 540)
}

const SECTION_MILESTONE_SPEC: Array<{ selector: string; videoProgress: number; alignCenter?: boolean }> = [
  { selector: '#home', videoProgress: 0.0, alignCenter: false },
  { selector: '[data-node-id="NODE_01"]', videoProgress: 1.2 / 9.0, alignCenter: true }, // Frame 72 (00:01.20s)
  { selector: '#about', videoProgress: 1.8 / 9.0, alignCenter: true }, // Frame 108 (00:01.80s)
  { selector: '[data-node-id="NODE_02"]', videoProgress: 2.4 / 9.0, alignCenter: true }, // Frame 144 (00:02.40s)
  { selector: '#services', videoProgress: 3.0 / 9.0, alignCenter: true }, // Frame 180 (00:03.00s)
  { selector: '[data-node-id="NODE_03"]', videoProgress: 3.6 / 9.0, alignCenter: true }, // Frame 216 (00:03.60s)
  { selector: '#arsenal', videoProgress: 4.1 / 9.0, alignCenter: true }, // Frame 246 (00:04.10s)
  { selector: '[data-node-id="NODE_04"]', videoProgress: 4.6 / 9.0, alignCenter: true }, // Frame 276 (00:04.60s)
  { selector: '#projects', videoProgress: 5.2 / 9.0, alignCenter: true }, // Frame 312 (00:05.20s)
  { selector: '[data-node-id="NODE_05"]', videoProgress: 5.7 / 9.0, alignCenter: true }, // Frame 342 (00:05.70s)
  { selector: '#quantum-lab', videoProgress: 6.25 / 9.0, alignCenter: true }, // Frame 375 (00:06.25s)
  { selector: '[data-node-id="NODE_06"]', videoProgress: 6.8 / 9.0, alignCenter: true }, // Frame 408 (00:06.80s)
  { selector: '#process', videoProgress: 7.3 / 9.0, alignCenter: true }, // Frame 438 (00:07.30s)
  { selector: '[data-node-id="NODE_07"]', videoProgress: 7.8 / 9.0, alignCenter: true }, // Frame 468 (00:07.80s)
  { selector: '#testimonials', videoProgress: 8.2 / 9.0, alignCenter: true }, // Frame 492 (00:08.20s)
  { selector: '[data-node-id="NODE_08"]', videoProgress: 8.6 / 9.0, alignCenter: true }, // Frame 516 (00:08.60s)
  { selector: '#contact', videoProgress: 8.88 / 9.0, alignCenter: true }, // Frame 533 (00:08.88s)
];

interface CodeBlock3D {
  x: number;
  y: number;
  z0: number;
  headerGlyph?: string;
  subGlyph?: string;
  title?: string;
  lines: string[];
  hasBox?: boolean;
  hasDiagonalLine?: boolean;
  hasHistogram?: boolean;
  hasPlatform?: boolean;
}

interface StreamDot {
  ribbonIdx: number;
  u: number;
  spreadX: number;
  spreadY: number;
  radius: number;
  alpha: number;
  isBokeh: boolean;
  speed: number;
}

interface CircuitNodeDef {
  id: string;
  nx: number;
  ny: number;
  icon: 'square' | 'triangle' | 'wave' | 'bars' | 'tree' | 'gauge' | 'dots' | 'sliders';
  layer: 'innerLeft' | 'innerRight' | 'topRow' | 'bottomRow' | 'midLeft' | 'outerLeft' | 'midRight' | 'outerRight';
  pinSide: 'top' | 'bottom' | 'left' | 'right';
  pinIdx: number; // 0..7
}

const TOTAL_FRAMES = 540; // Exact 9.00s @ 60 FPS video timeline (540 frames)
const NATIVE_4K_WIDTH = 3840; // True 4K Ultra-HD Horizontal Resolution
const NATIVE_4K_HEIGHT = 2160; // True 4K Ultra-HD Vertical Resolution
const GPU_LRU_CAPACITY = 96; // Maximum 4K frames kept in GPU VRAM simultaneously
const MAX_CONCURRENT_PREFETCH = 6; // Parallel frame decode workers

// Refined 3D Quantum Architecture Code Holograms (Positioned in peripheral cinema lanes to frame UI without visual glare)
const VIDEO_CODE_BLOCKS: CodeBlock3D[] = [
  {
    x: -0.38,
    y: -0.31,
    z0: 0.50,
    headerGlyph: 'QUANTUM_KERNEL.ts',
    subGlyph: 'CORE // 0x7F',
    lines: [
      'export async function initQuantumCore(ctx: GPUContext) {',
      '  const pipeline = await ctx.compileShader("SYNAPSE_4K");',
      '  return pipeline.lockFrameSync({ targetHz: 120 });',
      '}',
    ],
  },
  {
    x: 0.32,
    y: -0.30,
    z0: 0.46,
    headerGlyph: 'TENSOR_MATRIX.wgsl',
    subGlyph: 'SHADER // FP16',
    lines: [
      'struct PhotonicMatrix {',
      '  resolution: vec2<f32>(3840.0, 2160.0),',
      '  coherence:  0.9984,',
      '};',
    ],
  },
  {
    x: -0.41,
    y: 0.03,
    z0: 0.44,
    headerGlyph: 'NEURAL_BUS.rs',
    subGlyph: 'LINK // SYNC_OK',
    hasPlatform: true,
    lines: [
      '// 48-Pin Optical Conduit Dispatch',
      'let bus = NeuralBus::connect(0x9A4F);',
      'bus.route_photons(Channel::Symmetric);',
    ],
  },
  {
    x: 0.31,
    y: 0.06,
    z0: 0.54,
    headerGlyph: 'ATLAS_CACHE.cpp',
    subGlyph: 'VRAM // 60_FRAMES',
    hasHistogram: true,
    hasPlatform: true,
    lines: [
      'void WebGLAtlas::prefetchLookahead(int frameIdx) {',
      '  gpuQueue.uploadTextureSubImage2D(frameIdx);',
      '  telemetry.status = STATE_ALIGNED_1_TO_1;',
      '}',
    ],
  },
  {
    x: -0.34,
    y: 0.25,
    z0: 0.62,
    headerGlyph: 'SINGULARITY_CORE.py',
    subGlyph: 'TENSOR // 16_CORE',
    lines: [
      'def calibrate_gimbal_rings(scroll_sec: float):',
      '    phase = smoothstep(1.70, 2.95, scroll_sec)',
      '    return QuantumReactor.ignite(phase)',
    ],
  },
  {
    x: 0.27,
    y: 0.26,
    z0: 0.66,
    headerGlyph: 'OPTICAL_LUT.glsl',
    subGlyph: 'ANAMORPHIC // HDR',
    lines: [
      '// Volumetric God-Ray & Chromatic Balance',
      'vec4 color = sampleOpticalLUT(uv, actSpectrum);',
      'fragColor = mix(deepObsidian, color, 0.92);',
    ],
  },
];

// Exact 40-Node Symmetrical Neural & PCB Circuit Topology from 00:04.5 - 00:09.0 of the Reference Video
const CIRCUIT_NODES: CircuitNodeDef[] = [
  // 4 Inner-Left Primary Square Hub Nodes (■)
  { id: 'il-0', nx: -0.14, ny: -0.195, icon: 'square', layer: 'innerLeft', pinSide: 'left', pinIdx: 0 },
  { id: 'il-1', nx: -0.175, ny: -0.07, icon: 'square', layer: 'innerLeft', pinSide: 'left', pinIdx: 2 },
  { id: 'il-2', nx: -0.175, ny: 0.07, icon: 'square', layer: 'innerLeft', pinSide: 'left', pinIdx: 5 },
  { id: 'il-3', nx: -0.14, ny: 0.195, icon: 'square', layer: 'innerLeft', pinSide: 'left', pinIdx: 7 },

  // 4 Inner-Right Primary Triangle Hub Nodes (▲)
  { id: 'ir-0', nx: 0.14, ny: -0.195, icon: 'triangle', layer: 'innerRight', pinSide: 'right', pinIdx: 0 },
  { id: 'ir-1', nx: 0.175, ny: -0.07, icon: 'triangle', layer: 'innerRight', pinSide: 'right', pinIdx: 2 },
  { id: 'ir-2', nx: 0.175, ny: 0.07, icon: 'triangle', layer: 'innerRight', pinSide: 'right', pinIdx: 5 },
  { id: 'ir-3', nx: 0.14, ny: 0.195, icon: 'triangle', layer: 'innerRight', pinSide: 'right', pinIdx: 7 },

  // 8 Top-Row Symmetrical Staggered Nodes
  { id: 'tr-0', nx: -0.115, ny: -0.34, icon: 'wave', layer: 'topRow', pinSide: 'top', pinIdx: 0 },
  { id: 'tr-1', nx: -0.076, ny: -0.425, icon: 'bars', layer: 'topRow', pinSide: 'top', pinIdx: 1 },
  { id: 'tr-2', nx: -0.038, ny: -0.35, icon: 'dots', layer: 'topRow', pinSide: 'top', pinIdx: 2 },
  { id: 'tr-3', nx: 0.0, ny: -0.435, icon: 'tree', layer: 'topRow', pinSide: 'top', pinIdx: 3 },
  { id: 'tr-4', nx: 0.038, ny: -0.35, icon: 'gauge', layer: 'topRow', pinSide: 'top', pinIdx: 4 },
  { id: 'tr-5', nx: 0.076, ny: -0.425, icon: 'sliders', layer: 'topRow', pinSide: 'top', pinIdx: 5 },
  { id: 'tr-6', nx: 0.115, ny: -0.34, icon: 'wave', layer: 'topRow', pinSide: 'top', pinIdx: 6 },
  { id: 'tr-7', nx: 0.158, ny: -0.405, icon: 'bars', layer: 'topRow', pinSide: 'top', pinIdx: 7 },

  // 8 Bottom-Row Symmetrical Staggered Nodes
  { id: 'br-0', nx: -0.115, ny: 0.35, icon: 'bars', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 0 },
  { id: 'br-1', nx: -0.078, ny: 0.425, icon: 'wave', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 1 },
  { id: 'br-2', nx: -0.04, ny: 0.35, icon: 'tree', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 2 },
  { id: 'br-3', nx: 0.0, ny: 0.435, icon: 'gauge', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 3 },
  { id: 'br-4', nx: 0.04, ny: 0.35, icon: 'dots', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 4 },
  { id: 'br-5', nx: 0.078, ny: 0.425, icon: 'bars', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 5 },
  { id: 'br-6', nx: 0.115, ny: 0.35, icon: 'sliders', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 6 },
  { id: 'br-7', nx: 0.158, ny: 0.405, icon: 'wave', layer: 'bottomRow', pinSide: 'bottom', pinIdx: 7 },

  // 5 Mid-Left Column Nodes
  { id: 'ml-0', nx: -0.295, ny: -0.27, icon: 'wave', layer: 'midLeft', pinSide: 'left', pinIdx: 0 },
  { id: 'ml-1', nx: -0.312, ny: -0.135, icon: 'tree', layer: 'midLeft', pinSide: 'left', pinIdx: 1 },
  { id: 'ml-2', nx: -0.312, ny: 0.0, icon: 'bars', layer: 'midLeft', pinSide: 'left', pinIdx: 3 },
  { id: 'ml-3', nx: -0.312, ny: 0.135, icon: 'gauge', layer: 'midLeft', pinSide: 'left', pinIdx: 5 },
  { id: 'ml-4', nx: -0.295, ny: 0.27, icon: 'dots', layer: 'midLeft', pinSide: 'left', pinIdx: 7 },

  // 7 Outer-Left Column Nodes
  { id: 'ol-0', nx: -0.425, ny: -0.35, icon: 'bars', layer: 'outerLeft', pinSide: 'left', pinIdx: 0 },
  { id: 'ol-1', nx: -0.44, ny: -0.235, icon: 'sliders', layer: 'outerLeft', pinSide: 'left', pinIdx: 1 },
  { id: 'ol-2', nx: -0.44, ny: -0.118, icon: 'wave', layer: 'outerLeft', pinSide: 'left', pinIdx: 2 },
  { id: 'ol-3', nx: -0.44, ny: 0.0, icon: 'tree', layer: 'outerLeft', pinSide: 'left', pinIdx: 3 },
  { id: 'ol-4', nx: -0.44, ny: 0.118, icon: 'dots', layer: 'outerLeft', pinSide: 'left', pinIdx: 4 },
  { id: 'ol-5', nx: -0.44, ny: 0.235, icon: 'gauge', layer: 'outerLeft', pinSide: 'left', pinIdx: 6 },
  { id: 'ol-6', nx: -0.425, ny: 0.35, icon: 'wave', layer: 'outerLeft', pinSide: 'left', pinIdx: 7 },

  // 5 Mid-Right Column Nodes
  { id: 'mr-0', nx: 0.295, ny: -0.27, icon: 'bars', layer: 'midRight', pinSide: 'right', pinIdx: 0 },
  { id: 'mr-1', nx: 0.312, ny: -0.135, icon: 'wave', layer: 'midRight', pinSide: 'right', pinIdx: 1 },
  { id: 'mr-2', nx: 0.312, ny: 0.0, icon: 'tree', layer: 'midRight', pinSide: 'right', pinIdx: 3 },
  { id: 'mr-3', nx: 0.312, ny: 0.135, icon: 'dots', layer: 'midRight', pinSide: 'right', pinIdx: 5 },
  { id: 'mr-4', nx: 0.295, ny: 0.27, icon: 'gauge', layer: 'midRight', pinSide: 'right', pinIdx: 7 },

  // 7 Outer-Right Column Nodes
  { id: 'or-0', nx: 0.425, ny: -0.35, icon: 'wave', layer: 'outerRight', pinSide: 'right', pinIdx: 0 },
  { id: 'or-1', nx: 0.44, ny: -0.235, icon: 'bars', layer: 'outerRight', pinSide: 'right', pinIdx: 1 },
  { id: 'or-2', nx: 0.44, ny: -0.118, icon: 'tree', layer: 'outerRight', pinSide: 'right', pinIdx: 2 },
  { id: 'or-3', nx: 0.44, ny: 0.0, icon: 'sliders', layer: 'outerRight', pinSide: 'right', pinIdx: 3 },
  { id: 'or-4', nx: 0.44, ny: 0.118, icon: 'gauge', layer: 'outerRight', pinSide: 'right', pinIdx: 4 },
  { id: 'or-5', nx: 0.44, ny: 0.235, icon: 'dots', layer: 'outerRight', pinSide: 'right', pinIdx: 6 },
  { id: 'or-6', nx: 0.425, ny: 0.35, icon: 'bars', layer: 'outerRight', pinSide: 'right', pinIdx: 7 },
];

export const CyberScrollVideoBackground: React.FC<CyberScrollVideoBackgroundProps> = ({
  customSource,
  onFrameStatusChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Low-Latency WebGL Texture-Atlas pre-caching the next 60 frames along the scroll trajectory
  const webglAtlasRef = useRef<WebGLPredictiveTextureAtlas>(new WebGLPredictiveTextureAtlas());

  // Compressed custom source frame blobs in lightweight RAM; only active & pre-fetched 4K frames live in GPU VRAM
  const sourceBlobsRef = useRef<Blob[]>([]);
  const gpuLruCacheRef = useRef<GpuFrameLRUCache>(new GpuFrameLRUCache(GPU_LRU_CAPACITY));
  const inFlightDecodesRef = useRef<Set<number>>(new Set());
  const extractingProgressRef = useRef<number | null>(null);
  const prefetchTriggerRef = useRef<(centerFrame: number, direction: number, speed: number) => void>(() => {});

  // Pre-decoded 4K UHD Photorealistic Keyframe Bitmaps from the Exact Reference Video
  const photorealKeyframesRef = useRef<(ImageBitmap | null)[]>([null, null, null, null]);

  // Pre-extracted 4K UHD (3840x2160) 60FPS Frame Cache for the Built-In Exact AI Video (72-frame capacity for 60-frame lookahead)
  const builtIn4KLruCacheRef = useRef<GpuFrameLRUCache>(new GpuFrameLRUCache(72));

  // Initialize low-latency WebGL Texture-Atlas context on mount or when customSource mounts
  useEffect(() => {
    const glCanvas = webglCanvasRef.current;
    const atlas = webglAtlasRef.current;
    if (glCanvas) {
      atlas.attachCanvas(glCanvas);
    }
    return () => {
      atlas.clear();
    };
  }, [Boolean(customSource)]);

  // Decode the 4 photorealistic reference keyframes into GPU ImageBitmaps without blocking initial paint
  useEffect(() => {
    let active = true;
    const urls = [videoFrame01Url, videoFrame02Url, videoFrame03Url, videoFrame04Url];

    const loadKeyframeAt = (url: string, idx: number) => {
      if (!active) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      if (idx === 0) {
        img.fetchPriority = 'high';
      }
      img.onload = () => {
        if (!active) return;
        createImageBitmap(img)
          .then((bmp) => {
            if (!active) {
              try {
                bmp.close();
              } catch {
                // ignore
              }
              return;
            }
            photorealKeyframesRef.current[idx] = bmp;
            const anchorFrame = Math.round((idx / 3) * (TOTAL_FRAMES - 1));
            webglAtlasRef.current.uploadFrameToAtlas(anchorFrame, bmp, 0, 1);
            builtIn4KLruCacheRef.current.clear();
          })
          .catch(() => {});
      };
      img.src = url;
    };

    // Load initial frame 01 immediately for instant first paint; stagger frames 02..04 so main thread stays 100% free
    loadKeyframeAt(urls[0], 0);
    const timers = [1, 2, 3].map((idx) =>
      window.setTimeout(() => loadKeyframeAt(urls[idx], idx), idx * 90)
    );

    return () => {
      active = false;
      timers.forEach((t) => window.clearTimeout(t));
      photorealKeyframesRef.current.forEach((bmp, i) => {
        if (bmp) {
          try {
            bmp.close();
          } catch {
            // ignore
          }
          photorealKeyframesRef.current[i] = null;
        }
      });
      builtIn4KLruCacheRef.current.clear();
    };
  }, []);

  // =========================================================================
  // 1. 60 FPS 4K UHD (3840x2160) FRAME EXTRACTION + SMART GPU LRU PRE-FETCHER
  // =========================================================================
  useEffect(() => {
    let cancelled = false;
    const lruCache = gpuLruCacheRef.current;
    const inFlight = inFlightDecodesRef.current;

    const resetSourceMemory = () => {
      sourceBlobsRef.current = [];
      inFlight.clear();
      lruCache.clear();
    };

    if (!customSource) {
      resetSourceMemory();
      extractingProgressRef.current = null;
      return;
    }

    const schedulePrefetch = (centerFrame: number, direction: number, _speed: number) => {
      if (cancelled) return;
      const blobs = sourceBlobsRef.current;
      const total = blobs.length;
      if (total === 0) return;

      const clampedCenter = clamp(Math.round(centerFrame), 0, total - 1);
      const dir = direction >= 0 ? 1 : -1;
      const webglAtlas = webglAtlasRef.current;

      // Compute the predictive 60-frame lookahead window ([center .. center + dir * 60])
      const candidates = webglAtlas.computePredictive60Window(clampedCenter, dir, total);

      for (const frameIdx of candidates) {
        if (inFlight.size >= MAX_CONCURRENT_PREFETCH) break;
        if ((lruCache.has(frameIdx) && webglAtlas.has(frameIdx)) || inFlight.has(frameIdx)) continue;

        const blob = blobs[frameIdx];
        if (!blob) continue;

        inFlight.add(frameIdx);
        createImageBitmap(blob)
          .then((bmp) => {
            inFlight.delete(frameIdx);
            if (cancelled) {
              try {
                bmp.close();
              } catch {
                // ignore
              }
              return;
            }
            // Populate both the 4K GPU LRU cache and the low-latency 60-frame WebGL Texture-Atlas
            lruCache.set(frameIdx, bmp, clampedCenter, PREDICTIVE_LOOKAHEAD_FRAMES);
            webglAtlas.uploadFrameToAtlas(frameIdx, bmp, clampedCenter, dir);
            // Re-trigger prefetch to continue filling the 60-frame lookahead window asynchronously
            if (!cancelled && inFlight.size < MAX_CONCURRENT_PREFETCH) {
              schedulePrefetch(clampedCenter, dir, 1);
            }
          })
          .catch(() => {
            inFlight.delete(frameIdx);
          });
      }
    };

    prefetchTriggerRef.current = schedulePrefetch;

    const loadSourceSequence = async () => {
      try {
        extractingProgressRef.current = 0;
        resetSourceMemory();

        if (customSource.type === 'zip' && customSource.blob) {
          const blobs = await extractFrameBlobsFromZip(
            customSource.blob,
            (pct) => {
              extractingProgressRef.current = pct;
            },
            () => cancelled
          );
          if (!cancelled && blobs.length > 0) {
            sourceBlobsRef.current = blobs;
            schedulePrefetch(0, 1, 2);
          }
          extractingProgressRef.current = null;
          return;
        }

        if (customSource.type === 'images' && customSource.files && customSource.files.length > 0) {
          const sortedFiles = sortImageFilesChronologically(customSource.files);
          if (!cancelled && sortedFiles.length > 0) {
            sourceBlobsRef.current = sortedFiles;
            schedulePrefetch(0, 1, 2);
          }
          extractingProgressRef.current = null;
          return;
        }

        if (customSource.type === 'video' && (customSource.url || customSource.blob)) {
          const videoUrl = customSource.url || URL.createObjectURL(customSource.blob!);
          const shouldRevoke = !customSource.url && Boolean(customSource.blob);

          const video = document.createElement('video');
          video.src = videoUrl;
          video.muted = true;
          video.playsInline = true;
          video.crossOrigin = 'anonymous';
          video.preload = 'auto';

          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('Video load error'));
          });

          const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 9;
          // Exact 60 FPS frame extraction across the full video duration
          const count = Math.min(720, Math.max(240, Math.round(duration * 60)));

          const offscreen = document.createElement('canvas');
          // True 4K UHD (3840x2160) extraction canvas so every extracted picture is 4K HD quality
          const vw = video.videoWidth || NATIVE_4K_WIDTH;
          const vh = video.videoHeight || NATIVE_4K_HEIGHT;
          const aspect = vh / Math.max(1, vw);
          offscreen.width = NATIVE_4K_WIDTH;
          offscreen.height = Math.min(NATIVE_4K_HEIGHT, Math.max(1080, Math.round(NATIVE_4K_WIDTH * aspect)));
          const offCtx = offscreen.getContext('2d', { alpha: false });

          if (!offCtx) {
            if (shouldRevoke) URL.revokeObjectURL(videoUrl);
            extractingProgressRef.current = null;
            return;
          }

          offCtx.imageSmoothingEnabled = true;
          offCtx.imageSmoothingQuality = 'high';

          const extractedBlobs: Blob[] = [];
          for (let i = 0; i < count; i++) {
            if (cancelled) {
              if (shouldRevoke) URL.revokeObjectURL(videoUrl);
              return;
            }

            video.currentTime = (i / Math.max(1, count - 1)) * Math.max(0.01, duration - 0.02);
            await new Promise<void>((resolve) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                resolve();
              };
              video.addEventListener('seeked', onSeeked);
            });

            offCtx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
            const frameBlob = await new Promise<Blob | null>((resolve) =>
              offscreen.toBlob((b) => resolve(b), 'image/jpeg', 0.98)
            );
            if (frameBlob) {
              extractedBlobs.push(frameBlob);
              sourceBlobsRef.current = extractedBlobs;
              if (i < 24) {
                schedulePrefetch(0, 1, 1);
              }
            }
            extractingProgressRef.current = Math.round(((i + 1) / count) * 100);
          }

          if (shouldRevoke) URL.revokeObjectURL(videoUrl);
          extractingProgressRef.current = null;
        }
      } catch {
        extractingProgressRef.current = null;
      }
    };

    loadSourceSequence();

    return () => {
      cancelled = true;
      resetSourceMemory();
    };
  }, [customSource]);

  // =========================================================================
  // 2. TRUE 4K ULTRA-HD (3840x2160) 60FPS EXACT VIDEO & SCROLL ALIGNMENT ENGINE
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let renderScale = 2.0; // 3840 / 1920 = 2.0x True 4K UHD supersampling scale
    let cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let milestones: ScrollMilestone[] = [
      { scrollY: 0, videoProgress: 0 },
      { scrollY: cachedMaxScroll, videoProgress: 1 },
    ];

    // Calibrate exact DOM scroll positions of every Section & SectionConnector so video frames align 1:1
    const calibrateSectionMilestones = () => {
      const vh = window.innerHeight || 1080;
      const currentScroll = window.__lenisScrollState?.scroll ?? window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      cachedMaxScroll = maxScroll;

      const rawPoints: ScrollMilestone[] = [{ scrollY: 0, videoProgress: 0 }];

      for (const spec of SECTION_MILESTONE_SPEC) {
        if (spec.videoProgress <= 0) continue;
        const el = document.querySelector<HTMLElement>(spec.selector);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const absTop = rect.top + currentScroll;
        const targetScroll = spec.alignCenter
          ? absTop - vh * 0.42 + Math.min(rect.height * 0.25, vh * 0.18)
          : absTop;
        const clampedScroll = clamp(targetScroll, 1, maxScroll - 1);
        rawPoints.push({
          scrollY: clampedScroll,
          videoProgress: spec.videoProgress,
        });
      }

      rawPoints.push({ scrollY: maxScroll, videoProgress: 1.0 });
      rawPoints.sort((a, b) => a.scrollY - b.scrollY);

      // Ensure strictly monotonic scrollY & videoProgress knots
      const monotonic: ScrollMilestone[] = [rawPoints[0]];
      for (let i = 1; i < rawPoints.length; i++) {
        const prev = monotonic[monotonic.length - 1];
        const cur = rawPoints[i];
        if (cur.scrollY > prev.scrollY + 8 && cur.videoProgress >= prev.videoProgress) {
          monotonic.push(cur);
        } else if (i === rawPoints.length - 1) {
          monotonic[monotonic.length - 1] = {
            scrollY: Math.max(prev.scrollY + 1, maxScroll),
            videoProgress: 1.0,
          };
        }
      }

      milestones = monotonic;
    };

    const mapScrollYToAlignedVideoProgress = (scrollY: number): number => {
      const clampedY = clamp(scrollY, 0, cachedMaxScroll);
      if (milestones.length < 2) {
        return clamp(clampedY / cachedMaxScroll, 0, 1);
      }

      for (let i = 0; i < milestones.length - 1; i++) {
        const a = milestones[i];
        const b = milestones[i + 1];
        if (clampedY >= a.scrollY && clampedY <= b.scrollY) {
          const span = Math.max(1, b.scrollY - a.scrollY);
          const localT = clamp((clampedY - a.scrollY) / span, 0, 1);
          return clamp(a.videoProgress + localT * (b.videoProgress - a.videoProgress), 0, 1);
        }
      }

      return clamp(clampedY / cachedMaxScroll, 0, 1);
    };

    let lastViewportW = 0;
    let lastViewportH = 0;

    const updateMetrics = () => {
      // Adaptive High-FPS Retina internal buffer for instant load & zero-stutter 60/120/240FPS smoothness
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      // Ignore minor mobile address-bar expand/collapse height shifts (< 140px when width is unchanged)
      // so the 4K canvas buffer and GPU LRU frame cache are never destroyed mid-scroll on mobile
      const isMobileBarShift =
        lastViewportW === vw &&
        lastViewportH > 0 &&
        vw < 1024 &&
        Math.abs(vh - lastViewportH) < 140;

      if (!isMobileBarShift) {
        lastViewportW = vw;
        lastViewportH = vh;
        const aspect = vh / vw;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.35);

        const targetW =
          vw >= vh
            ? Math.min(1680, Math.max(1120, Math.round(vw * dpr)))
            : Math.min(960, Math.max(640, Math.round(vw * dpr)));
        const targetH = Math.max(540, Math.round(targetW * aspect));

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
          renderScale = Math.max(targetW, targetH) / 1920;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          builtIn4KLruCacheRef.current.clear();
        }

        const glCanvas = webglCanvasRef.current;
        if (glCanvas && (glCanvas.width !== targetW || glCanvas.height !== targetH)) {
          glCanvas.width = targetW;
          glCanvas.height = targetH;
          webglAtlasRef.current.attachCanvas(glCanvas);
        }
      }

      calibrateSectionMilestones();
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics, { passive: true });

    // Interactive 3D Cinema Camera Mouse/Pointer Parallax State
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);
      targetMouseX = ((e.clientX / vw) - 0.5) * 2; // -1 to +1
      targetMouseY = ((e.clientY / vh) - 0.5) * 2; // -1 to +1
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      calibrateSectionMilestones();
    });
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Recalibrate immediately whenever lazy-loaded <Suspense> sections mount into <main>
    const domMutationObserver = new MutationObserver(() => {
      calibrateSectionMilestones();
    });
    const mainEl = document.querySelector('main') || document.body;
    if (mainEl) {
      domMutationObserver.observe(mainEl, { childList: true, subtree: true });
    }

    // Deterministic 120 Stream Stars across the 6 S-curved Ribbons (Sharp Core + Foreground Bokeh)
    const streamDots: StreamDot[] = Array.from({ length: 120 }, (_, i) => {
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 78.233) * 43758.5453;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 45.164) * 43758.5453;
      const r3 = seed3 - Math.floor(seed3);

      const isBokeh = i % 5 === 0;
      return {
        ribbonIdx: i % 6,
        u: r1,
        spreadX: (r2 - 0.5) * (isBokeh ? 82 : 24),
        spreadY: (r3 - 0.5) * (isBokeh ? 82 : 24),
        radius: isBokeh ? 4.0 + r1 * 5.2 : 1.25 + r2 * 2.15,
        alpha: isBokeh ? 0.28 + r3 * 0.38 : 0.78 + r1 * 0.22,
        isBokeh,
        speed: 0.14 + r2 * 0.22,
      };
    });

    // Deterministic 72 Radial 3D Perspective Warp Streaks & Volumetric Star Motes (00:00 - 00:09)
    const radialTicks = Array.from({ length: 72 }, (_, i) => {
      const s1 = Math.sin(i * 19.19) * 10000;
      const r1 = s1 - Math.floor(s1);
      const s2 = Math.sin(i * 91.7) * 10000;
      const r2 = s2 - Math.floor(s2);
      const s3 = Math.sin(i * 53.3) * 10000;
      const r3 = s3 - Math.floor(s3);
      return {
        angle: r1 * Math.PI * 2,
        dist: 0.11 + r2 * 0.89,
        z: r3,
        len: 12 + r1 * 34,
        isLine: r2 < 0.52,
      };
    });

    const RADIAL_STAR_RGB = [
      '56, 189, 248',
      '232, 121, 249',
      '167, 139, 250',
      '52, 211, 153',
      '251, 191, 36',
      '244, 250, 255',
    ];

    const getBezierPoint = (
      t: number,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      return {
        x: uu * u * x0 + 3 * uu * t * x1 + 3 * u * tt * x2 + tt * t * x3,
        y: uu * u * y0 + 3 * uu * t * y1 + 3 * u * tt * y2 + tt * t * y3,
      };
    };

    const drawSuppliedFrame = (
      source: ImageBitmap,
      dw: number,
      dh: number,
      alpha: number,
      velocityFactor: number = 0,
      zoomScale: number = 1.0,
      panYOffset: number = 0
    ) => {
      if (alpha <= 0.002 || source.width <= 0 || source.height <= 0) return;
      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);
      const scaleCover = Math.max(dw / source.width, dh / source.height);
      const scaleContain = Math.min(dw / source.width, dh / source.height);
      const baseScale = dw < dh ? scaleContain * 1.35 : scaleCover;
      const motionScale = baseScale * zoomScale * (1 + Math.abs(velocityFactor) * 0.005);
      const rw = source.width * motionScale;
      const rh = source.height * motionScale;
      ctx.drawImage(source, (dw - rw) * 0.5, (dh - rh) * 0.5 + panYOffset, rw, rh);
      ctx.restore();
    };

    const getExactScrollY = () => {
      const state = window.__lenisScrollState;
      if (state && state.isSmooth && Number.isFinite(state.scroll)) {
        return state.scroll;
      }
      return window.scrollY;
    };

    let smoothP = mapScrollYToAlignedVideoProgress(getExactScrollY());
    let prevFrameFloat = smoothP * (TOTAL_FRAMES - 1);
    let prevVelocity = 0;
    let lastTickTime = performance.now();
    let lastDrawTime = 0;
    let lastReportedFrame = -1;
    let rafId: number | null = null;

    const renderFrame = (now: number) => {
      rafId = requestAnimationFrame(renderFrame);
      if (document.hidden) return;

      // Auto-recalibrate if document height shifted (e.g. lazy section expanded) or knots were incomplete
      const liveMaxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (Math.abs(liveMaxScroll - cachedMaxScroll) > 4 || milestones.length < 12) {
        calibrateSectionMilestones();
      }

      // Read sub-pixel Lenis scroll (desktop) or hardware-composited window.scrollY (mobile touch)
      const currentScrollY = getExactScrollY();
      const targetP = mapScrollYToAlignedVideoProgress(currentScrollY);
      const isActivelyScrolling = Math.abs(targetP - smoothP) > 0.00015;

      // Maintain 60FPS real-time cinema smoothness even when idle
      if (!isActivelyScrolling && now - lastDrawTime < 15.5) {
        return;
      }

      const dtMs = Math.max(1, Math.min(64, now - lastTickTime));
      lastTickTime = now;
      lastDrawTime = now;
      const elapsed = now * 0.001;

      // Smooth 3D cinema mouse parallax damping
      smoothMouseX += (targetMouseX - smoothMouseX) * 0.075;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.075;

      // Zero-lag 1:1 lockstep with Lenis scroll so the background video and website DOM run together simultaneously
      const isLenisSmoothing = Boolean(window.__lenisScrollState?.isSmooth);
      const baseResponsiveness = isLenisSmoothing ? 0.96 : 0.86;
      const lerpFactor = 1 - Math.pow(1 - baseResponsiveness, dtMs / 16.6667);
      smoothP += (targetP - smoothP) * lerpFactor;
      if (Math.abs(targetP - smoothP) < 0.00001) {
        smoothP = targetP;
      }

      const p = clamp(smoothP, 0, 1);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const minDim = Math.min(w, h);

      // =====================================================================
      // PATH A: SUPPLIED 4K VIDEO / ZIP FRAME SEQUENCE VIA 60-FRAME WEBGL TEXTURE-ATLAS
      // =====================================================================
      const totalCustomFrames = sourceBlobsRef.current.length;
      if (totalCustomFrames > 0) {
        const lruCache = gpuLruCacheRef.current;
        const webglAtlas = webglAtlasRef.current;
        const targetCustomFrame = p * (totalCustomFrames - 1);

        const { samples, currentVelocity } = computeInterpolatedSubFrames(
          prevFrameFloat,
          targetCustomFrame,
          prevVelocity,
          dtMs,
          totalCustomFrames
        );
        prevFrameFloat = targetCustomFrame;
        prevVelocity = currentVelocity;

        // Trigger predictive 60-frame lookahead pre-caching into the WebGL Texture-Atlas
        prefetchTriggerRef.current(
          targetCustomFrame,
          currentVelocity >= 0 ? 1 : -1,
          Math.abs(currentVelocity)
        );

        const primarySample = samples[samples.length - 1];
        const primaryI0 = clamp(Math.floor(primarySample.frameFloat), 0, totalCustomFrames - 1);
        const primaryI1 = clamp(primaryI0 + 1, 0, totalCustomFrames - 1);
        const primaryFrac = primarySample.frameFloat - primaryI0;

        // Render hardware-accelerated sub-frame blend on the WebGL Texture-Atlas layer if ready
        if (webglAtlas.isWebGLReady) {
          webglAtlas.renderInterpolatedAtlasPair(
            primaryI0,
            primaryI1,
            primaryFrac,
            1.0,
            1.0 + primarySample.velocityFactor * 0.004
          );
        }

        ctx.fillStyle = '#05080c';
        ctx.fillRect(0, 0, w, h);

        samples.forEach((sample, sIdx) => {
          const i0 = clamp(Math.floor(sample.frameFloat), 0, totalCustomFrames - 1);
          const i1 = clamp(i0 + 1, 0, totalCustomFrames - 1);
          const frac = sample.frameFloat - i0;

          const bmp0 = webglAtlas.getOrNearestBitmap(i0) || lruCache.getOrNearest(i0);
          const bmp1 = webglAtlas.getBitmap(i1) || lruCache.get(i1);

          const baseAlpha = sIdx === 0 ? 1.0 : sample.weight;
          if (bmp0) {
            drawSuppliedFrame(bmp0, w, h, baseAlpha, sample.velocityFactor);
          }
          if (bmp1 && bmp1 !== bmp0 && frac > 0.01) {
            drawSuppliedFrame(bmp1, w, h, baseAlpha * frac, sample.velocityFactor);
          }
        });

        const fNum = Math.round(targetCustomFrame) + 1;
        if (fNum !== lastReportedFrame) {
          lastReportedFrame = fNum;
          const sec = p * 9.0;
          const atlasTelemetry = webglAtlas.getTelemetry();
          window.dispatchEvent(
            new CustomEvent('cyber-video-frame', {
              detail: {
                currentFrame: fNum,
                totalFrames: totalCustomFrames,
                videoTimeSec: sec,
                cacheResidentCount: Math.max(lruCache.size, atlasTelemetry.residentFrames),
                interpolatedSubFrames: samples.length,
                resolutionLabel: `${w}x${h} 4K UHD`,
                predictiveBufferedFrames: PREDICTIVE_LOOKAHEAD_FRAMES,
                atlasTelemetry,
              },
            })
          );
          onFrameStatusChange?.({
            currentFrame: fNum,
            totalFrames: totalCustomFrames,
            extractingProgress: extractingProgressRef.current,
            videoTimeSec: sec,
            cacheResidentCount: Math.max(lruCache.size, atlasTelemetry.residentFrames),
            interpolatedSubFrames: samples.length,
            resolutionLabel: `${w}x${h} 4K UHD`,
            predictiveBufferedFrames: PREDICTIVE_LOOKAHEAD_FRAMES,
            atlasTelemetry,
          });
        }
        return;
      }

      // =====================================================================
      // PATH B: EXACT 4K UHD (3840x2160) 60FPS CINEMA SERIES (9 ACTS / 540 FRAMES)
      //         HYBRID PHOTOREALISTIC 4K KEYFRAMES + REAL-TIME 60FPS 3D CINEMA ENGINE
      // =====================================================================
      const targetBuiltInFrame = p * (TOTAL_FRAMES - 1);
      const { samples, currentVelocity, isInterpolating } = computeInterpolatedSubFrames(
        prevFrameFloat,
        targetBuiltInFrame,
        prevVelocity,
        dtMs,
        TOTAL_FRAMES
      );
      prevFrameFloat = targetBuiltInFrame;
      prevVelocity = currentVelocity;

      const sec = p * 9.0; // Exact 0.00s to 9.00s cinema timeline (60 FPS -> 540 frames)
      const { act: activeAct, localProgress: actLocalProgress } = getActiveCinemaAct(sec);
      const subtleBreath = Math.sin(elapsed * 1.45) * 0.006;

      // Scroll-Synchronized 3D IMAX Camera Trajectory + Interactive Mouse Parallax across all 9 Acts
      const parallaxX = smoothMouseX * (w * 0.022);
      const parallaxY = smoothMouseY * (h * 0.018);
      // Direct kinetic scroll pitch so scrolling the website physically moves the 3D camera in unison
      const scrollKineticPitchY = clamp(-currentVelocity * 1.35 * renderScale, -26 * renderScale, 26 * renderScale);
      const camPanX =
        Math.sin(p * Math.PI * 2.0) * (w * 0.022) +
        Math.cos(elapsed * 0.55) * (w * 0.003) +
        parallaxX;
      const camCraneY =
        Math.cos(p * Math.PI * 1.5) * (h * 0.018) +
        scrollKineticPitchY +
        parallaxY;
      const focusCenterX = cx + camPanX;
      const focusCenterY = cy + camCraneY;

      ctx.save();

      // 1. Exact Deep Matte Slate-Obsidian 3D Chamber (#020408 -> #162436) + Cinema Act LUT Tint
      const bgGrad = ctx.createRadialGradient(
        focusCenterX,
        focusCenterY,
        minDim * 0.01,
        cx,
        cy,
        Math.max(w, h) * 0.85
      );
      bgGrad.addColorStop(0, '#1a2b3c');
      bgGrad.addColorStop(0.38, '#0c1520');
      bgGrad.addColorStop(0.75, '#050910');
      bgGrad.addColorStop(1, '#020306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 1B. Strictly Scroll-Synchronized 9-Act Blend of Pre-Decoded 4K UHD Photorealistic Keyframes
      const kf = photorealKeyframesRef.current;
      const kfTimes = [0.0, 2.75, 5.75, 9.0];
      if (kf[0] || kf[1] || kf[2] || kf[3]) {
        // Locked 1:1 to scroll timeline (sec) so scrolling directly scrubs the 4K video keyframes
        let segIdx = 0;
        if (sec >= kfTimes[2]) segIdx = 2;
        else if (sec >= kfTimes[1]) segIdx = 1;

        const t0 = kfTimes[segIdx];
        const t1 = kfTimes[segIdx + 1];
        const localU = smoothstep(t0, t1, sec);

        const bmpA = kf[segIdx];
        const bmpB = kf[segIdx + 1];

        // Progressive camera dolly & vertical scroll travel across each keyframe segment
        const zoomA = 1.04 + localU * 0.14 + subtleBreath + p * 0.06;
        const zoomB = 0.96 + localU * 0.14 + subtleBreath + p * 0.06;
        const panYA = (0.35 - localU) * (h * 0.055) + scrollKineticPitchY * 0.45;
        const panYB = (0.85 - localU) * (h * 0.055) + scrollKineticPitchY * 0.45;

        ctx.save();
        ctx.translate(camPanX * 0.48, camCraneY * 0.48);
        if (bmpA) {
          drawSuppliedFrame(bmpA, w, h, 1.0, currentVelocity * 0.06, zoomA, panYA);
        }
        if (bmpB) {
          drawSuppliedFrame(bmpB, w, h, localU, currentVelocity * 0.06, zoomB, panYB);
        }
        ctx.restore();
      }

      // 1C. Volumetric Crepuscular God-Rays (Rotating directly with scroll progress p)
      ctx.save();
      ctx.translate(focusCenterX, focusCenterY);
      const rayCount = 8;
      const maxRayLen = Math.max(w, h) * 0.76;
      const rayGrad = ctx.createRadialGradient(0, 0, minDim * 0.06, 0, 0, maxRayLen);
      rayGrad.addColorStop(0, `rgba(${activeAct.accentRgb}, 0.09)`);
      rayGrad.addColorStop(0.35, `rgba(${activeAct.accentRgb}, 0.045)`);
      rayGrad.addColorStop(0.75, `rgba(${activeAct.secondaryRgb}, 0.018)`);
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rayGrad;

      for (let r = 0; r < rayCount; r++) {
        const baseAngle =
          (r / rayCount) * Math.PI * 2 +
          p * Math.PI * (r % 2 === 0 ? 1.6 : -1.3) +
          elapsed * (r % 2 === 0 ? 0.04 : -0.03);
        const raySpread = 0.055 + 0.015 * Math.sin(sec * 1.8 + r * 1.7);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRayLen, baseAngle - raySpread, baseAngle + raySpread);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 1D. Cinema Series Optical Color-Grading LUT (High-Contrast Deep Cinema Tone, Zero Milky Glare)
      ctx.save();
      const lutGrad = ctx.createRadialGradient(
        focusCenterX,
        focusCenterY,
        minDim * 0.08,
        cx,
        cy,
        Math.max(w, h) * 0.78
      );
      lutGrad.addColorStop(0, `rgba(${activeAct.accentRgb}, 0.07)`);
      lutGrad.addColorStop(0.45, `rgba(${activeAct.secondaryRgb}, 0.04)`);
      lutGrad.addColorStop(1, 'rgba(2, 4, 10, 0.22)');
      ctx.fillStyle = lutGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Apply 3D Mid-Ground Cinema Camera Pan & Scroll Pitch
      ctx.save();
      ctx.translate(camPanX * 0.75, camCraneY * 0.75);

      const compW = w < h ? h * 0.85 : w;

      // 2. 3D Perspective Floor & Ceiling Cyber-Grids, Specular Core Reflection & Levitating Platforms (00:00 - 00:04.8)
      const floorAlpha = 1 - smoothstep(3.6, 5.0, sec);
      if (floorAlpha > 0.01) {
        ctx.save();
        // Horizon shifts dynamically with scroll so the 3D chamber tilts as you travel down the page
        const horizonY = cy + h * (0.145 - smoothstep(0, 4.5, sec) * 0.055);
        const ceilingY = cy - h * (0.165 - smoothstep(0, 4.5, sec) * 0.045);

        // Floor specular reflection pool beneath the central quantum reactor
        const reflGrad = ctx.createRadialGradient(
          cx,
          horizonY + (h - horizonY) * 0.35,
          minDim * 0.01,
          cx,
          horizonY + (h - horizonY) * 0.35,
          compW * 0.42
        );
        reflGrad.addColorStop(0, `rgba(${activeAct.accentRgb}, ${floorAlpha * 0.24})`);
        reflGrad.addColorStop(0.45, `rgba(${activeAct.secondaryRgb}, ${floorAlpha * 0.10})`);
        reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(0, horizonY, w, h - horizonY);

        // Perspective Floor & Ceiling Radial Lines
        ctx.strokeStyle = `rgba(186, 230, 253, ${floorAlpha * 0.22})`;
        ctx.lineWidth = 1.25 * renderScale;
        ctx.beginPath();
        for (let i = -9; i <= 9; i++) {
          // Floor perspective rays
          ctx.moveTo(cx + i * (compW * 0.026), horizonY);
          ctx.lineTo(cx + i * (compW * 0.25), h);
          // Subtle upper ceiling counter-grid rays
          ctx.moveTo(cx + i * (compW * 0.026), ceilingY);
          ctx.lineTo(cx + i * (compW * 0.22), 0);
        }
        ctx.stroke();

        // Scroll-Synchronized Forward-Gliding 3D Grid Tiles (Driven directly by sec so scrolling moves the floor)
        const tileShift = ((sec * 2.15 + elapsed * 0.04) % 1 + 1) % 1;
        for (let r = 1; r <= 7; r++) {
          const normR = (r + tileShift) / 8;
          const ry = horizonY + Math.pow(normR, 1.78) * (h - horizonY);
          const rowAlpha = floorAlpha * (0.12 + normR * 0.24);
          ctx.strokeStyle = `rgba(210, 236, 255, ${rowAlpha})`;
          ctx.lineWidth = (0.9 + normR * 0.8) * renderScale;
          ctx.beginPath();
          ctx.moveTo(0, ry);
          ctx.lineTo(w, ry);
          ctx.stroke();

          // Upper ceiling horizontal perspective lines
          const cyTop = ceilingY - Math.pow(normR, 1.85) * ceilingY;
          ctx.strokeStyle = `rgba(165, 220, 255, ${rowAlpha * 0.48})`;
          ctx.beginPath();
          ctx.moveTo(0, cyTop);
          ctx.lineTo(w, cyTop);
          ctx.stroke();
        }

        // Scroll-Linked Photonic Laser Scan-Wave sweeping across the 3D floor grid
        const scanNorm = ((sec * 1.25 + elapsed * 0.05) % 1 + 1) % 1;
        const scanY = horizonY + Math.pow(scanNorm, 1.78) * (h - horizonY);
        const scanAlpha = Math.sin(scanNorm * Math.PI) * floorAlpha * 0.68;
        if (scanAlpha > 0.02) {
          ctx.strokeStyle = `rgba(${activeAct.accentRgb}, ${scanAlpha})`;
          ctx.lineWidth = 2.4 * renderScale;
          ctx.beginPath();
          ctx.moveTo(cx - compW * (0.12 + scanNorm * 0.75), scanY);
          ctx.lineTo(cx + compW * (0.12 + scanNorm * 0.75), scanY);
          ctx.stroke();
        }

        // Raised 3D Translucent Levitating Side Platforms (Recede past camera as user scrolls past #about)
        const platAlpha = (1 - smoothstep(2.1, 3.2, sec)) * floorAlpha;
        if (platAlpha > 0.02) {
          const forwardSlide = sec * 0.28;
          const hoverBob = Math.sin(elapsed * 1.8) * (3.5 * renderScale);
          const pScale = 1 + forwardSlide * 0.56;

          const drawSteppedPlatform = (pxCenter: number, pyCenter: number, isRight: boolean) => {
            const pw = compW * 0.195 * pScale;
            const ph = h * 0.038 * pScale;
            const stepH = 9 * renderScale * pScale;
            const py = pyCenter + (isRight ? -hoverBob : hoverBob);

            // Lower Step Base
            ctx.fillStyle = `rgba(14, 24, 38, ${platAlpha * 0.38})`;
            ctx.strokeStyle = `rgba(186, 230, 253, ${platAlpha * 0.72})`;
            ctx.lineWidth = 1.3 * renderScale;
            ctx.beginPath();
            ctx.moveTo(pxCenter - pw * 0.56, py + ph * 0.45);
            ctx.lineTo(pxCenter + pw * 0.56, py + ph * 0.45);
            ctx.lineTo(pxCenter + pw * 0.7, py + ph * 1.35 + stepH);
            ctx.lineTo(pxCenter - pw * 0.7, py + ph * 1.35 + stepH);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Upper Platform Deck with Bright White & Cyan Glowing Edge
            const deckGrad = ctx.createLinearGradient(
              pxCenter - pw * 0.5,
              py,
              pxCenter + pw * 0.5,
              py + ph
            );
            deckGrad.addColorStop(0, `rgba(24, 42, 62, ${platAlpha * 0.44})`);
            deckGrad.addColorStop(0.5, `rgba(16, 28, 44, ${platAlpha * 0.36})`);
            deckGrad.addColorStop(1, `rgba(28, 48, 68, ${platAlpha * 0.44})`);

            ctx.fillStyle = deckGrad;
            ctx.strokeStyle = `rgba(248, 252, 255, ${platAlpha * 0.96})`;
            ctx.lineWidth = 1.85 * renderScale;
            ctx.beginPath();
            ctx.moveTo(pxCenter - pw * 0.5, py);
            ctx.lineTo(pxCenter + pw * 0.5, py);
            ctx.lineTo(pxCenter + pw * 0.62, py + ph);
            ctx.lineTo(pxCenter - pw * 0.62, py + ph);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Animated Vertical Hologram Equalizer Pillars rising from the platform deck
            const barCount = 7;
            for (let b = 0; b < barCount; b++) {
              const bx = pxCenter + ((b - (barCount - 1) * 0.5) / barCount) * (pw * 0.68);
              const bh =
                (8 + 14 * (0.5 + 0.5 * Math.sin(sec * 5.0 + elapsed * 2.2 + b * 1.1 + (isRight ? 1.5 : 0)))) *
                renderScale *
                pScale;
              ctx.fillStyle =
                b % 2 === 0
                  ? `rgba(${activeAct.accentRgb}, ${platAlpha * 0.62})`
                  : `rgba(240, 249, 255, ${platAlpha * 0.75})`;
              ctx.fillRect(bx - 1.4 * renderScale, py + ph * 0.35 - bh, 2.8 * renderScale, bh);
            }

            // Glowing horizontal light strip on platform front edge
            ctx.strokeStyle = `rgba(255, 255, 255, ${platAlpha * 0.96})`;
            ctx.lineWidth = 2.4 * renderScale;
            ctx.beginPath();
            const stripOffset = isRight ? -pw * 0.12 : pw * 0.12;
            ctx.moveTo(pxCenter - pw * 0.35 + stripOffset, py + ph * 1.15);
            ctx.lineTo(pxCenter + pw * 0.35 + stripOffset, py + ph * 1.15);
            ctx.stroke();
          };

          drawSteppedPlatform(
            cx - compW * (0.35 + forwardSlide * 0.18),
            cy + h * (0.085 + forwardSlide * 0.14),
            false
          );
          drawSteppedPlatform(
            cx + compW * (0.35 + forwardSlide * 0.18),
            cy + h * (0.095 + forwardSlide * 0.14),
            true
          );
        }

        ctx.restore();
      }

      // 3. 72 Radial 3D Perspective Warp Streaks & Volumetric Star Motes (Directly Scrubbed by Scroll p)
      const velocityStreakBoost = isInterpolating ? clamp(Math.abs(currentVelocity) * 0.32, 0, 2.2) : 0;
      ctx.save();
      for (let i = 0; i < radialTicks.length; i++) {
        const tk = radialTicks[i];
        // Scroll progress p drives 3D warp flight forward on scroll-down and backward on scroll-up
        const z = ((tk.z - p * 2.85 - elapsed * 0.015) % 1 + 1) % 1;
        const persp = 1 / Math.max(0.13, z);
        const rDist = tk.dist * minDim * 0.36 * persp;
        const sx = cx + Math.cos(tk.angle) * rDist * (compW / minDim);
        const sy = cy + Math.sin(tk.angle) * rDist;

        if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
          const alpha = smoothstep(0.05, 0.22, z) * (1 - smoothstep(0.76, 0.98, z)) * 0.78;
          if (tk.isLine || velocityStreakBoost > 0.2) {
            const len =
              tk.len *
              renderScale *
              clamp(persp * 0.48, 0.55, 2.8) *
              (1 + velocityStreakBoost);
            const rgb = RADIAL_STAR_RGB[i % RADIAL_STAR_RGB.length];
            ctx.strokeStyle = i % 3 === 0 ? `rgba(${rgb}, ${alpha * 0.92})` : `rgba(235, 246, 255, ${alpha * 0.88})`;
            ctx.lineWidth = 1.35 * renderScale;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(tk.angle) * len, sy + Math.sin(tk.angle) * len);
            ctx.stroke();
          } else {
            const sr = 3.2 * renderScale * clamp(persp * 0.45, 0.6, 2.6);
            const rgb = RADIAL_STAR_RGB[i % RADIAL_STAR_RGB.length];
            ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.98})`;
            ctx.beginPath();
            ctx.moveTo(sx, sy - sr);
            ctx.quadraticCurveTo(sx, sy, sx + sr, sy);
            ctx.quadraticCurveTo(sx, sy, sx, sy + sr);
            ctx.quadraticCurveTo(sx, sy, sx - sr, sy);
            ctx.quadraticCurveTo(sx, sy, sx, sy - sr);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // =====================================================================
      // 4. PREMIUM GLASSMORPHIC 3D HOLOGRAPHIC CODE HUD PLANES (ACT I & II: 00:00 - 00:03.1)
      //    Soft eye-friendly contrast, syntax-tinted typography, peripheral framing,
      //    and center safe-zone attenuation so foreground Hero/About UI is 100% clear.
      // =====================================================================
      const codeGlobalAlpha = 1 - smoothstep(2.05, 3.05, sec);
      if (codeGlobalAlpha > 0.01) {
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // Subtle foreground parallax + upward scroll travel synchronized with Hero/About DOM
        ctx.translate(parallaxX * 0.35, parallaxY * 0.35 - sec * (h * 0.042));

        const softPulse = 0.85 + 0.15 * Math.sin(elapsed * 2.4);

        samples.forEach((sample) => {
          const sampleSec = sample.progress * 9.0;
          const sampleWeight = sample.weight;

          VIDEO_CODE_BLOCKS.forEach((cb, cbIdx) => {
            // Directly driven by scroll (sampleSec) so scrolling smoothly glides past each 3D HUD panel
            const z = cb.z0 - sampleSec * 0.20;
            if (z <= 0.18 || z >= 0.95) return;

            const persp = 0.46 / z;
            const depthEnvelope =
              smoothstep(0.18, 0.32, z) * (1 - smoothstep(0.74, 0.93, z));

            const floatY = Math.sin(elapsed * 1.4 + cbIdx * 1.3) * (2.5 * renderScale);
            const sx = cx + cb.x * compW * persp;
            const sy = cy + cb.y * h * persp + floatY;

            // Radial Center Safe-Zone Attenuation: dims code planes near the center reading zone
            const normDistFromCenter = Math.hypot((sx - cx) / (w * 0.5), (sy - cy) / (h * 0.5));
            const centerSafeAttenuation = smoothstep(0.28, 0.68, normDistFromCenter);

            // Whisper-quiet luxury opacity cap (max ~0.42) so it never glares or hurts the eyes
            const alpha =
              codeGlobalAlpha *
              sampleWeight *
              depthEnvelope *
              (0.32 + 0.68 * centerSafeAttenuation) *
              0.44;

            if (alpha <= 0.015) return;

            ctx.save();
            ctx.translate(sx, sy);

            const fontPx = Math.round(9.6 * renderScale * clamp(persp * 0.78, 0.68, 1.16));
            const lineH = Math.round(fontPx * 1.48);
            const padX = Math.round(11 * renderScale);
            const padY = Math.round(8 * renderScale);
            const headerH = Math.round(fontPx * 1.85);

            // Estimate card dimensions cleanly without expensive per-frame measureText calls
            const maxChars = cb.lines.reduce((m, l) => Math.max(m, l.length), 24);
            const cardW = Math.round((maxChars * 0.61 + 4.5) * fontPx + padX * 2);
            const cardH = Math.round(headerH + cb.lines.length * lineH + padY * 1.8);
            const cornerR = 6 * renderScale;

            // 1. Frosted Obsidian-Sapphire Glass HUD Backing Plate
            ctx.fillStyle = `rgba(6, 13, 26, ${alpha * 1.15})`;
            ctx.strokeStyle = `rgba(${activeAct.accentRgb}, ${alpha * 0.42})`;
            ctx.lineWidth = 1.0 * renderScale;
            ctx.beginPath();
            ctx.roundRect(0, 0, cardW, cardH, cornerR);
            ctx.fill();
            ctx.stroke();

            // 2. Subtle Top Header Strip inside the Glass Card
            ctx.fillStyle = `rgba(${activeAct.accentRgb}, ${alpha * 0.14})`;
            ctx.beginPath();
            ctx.roundRect(0, 0, cardW, headerH, [cornerR, cornerR, 0, 0]);
            ctx.fill();

            // Header divider hair-line
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.24})`;
            ctx.lineWidth = 0.75 * renderScale;
            ctx.beginPath();
            ctx.moveTo(0, headerH);
            ctx.lineTo(cardW, headerH);
            ctx.stroke();

            // 3. Precision L-Shaped Corner Reticles (Top-Left & Bottom-Right)
            const tickLen = 5.5 * renderScale;
            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.72})`;
            ctx.lineWidth = 1.25 * renderScale;
            ctx.beginPath();
            ctx.moveTo(0, tickLen);
            ctx.lineTo(0, 0);
            ctx.lineTo(tickLen, 0);
            ctx.moveTo(cardW - tickLen, cardH);
            ctx.lineTo(cardW, cardH);
            ctx.lineTo(cardW, cardH - tickLen);
            ctx.stroke();

            // 4. Micro Status LED Dot + Module Filename & Sub-Tag in Header
            const dotR = 2.2 * renderScale;
            const headerMidY = headerH * 0.5;
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.95 * softPulse})`;
            ctx.beginPath();
            ctx.arc(padX, headerMidY, dotR, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = `600 ${Math.round(fontPx * 0.88)}px "JetBrains Mono", monospace`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.92})`;
            ctx.fillText(cb.headerGlyph || 'MODULE.ts', padX + dotR * 3.2, headerMidY);

            if (cb.subGlyph) {
              ctx.textAlign = 'right';
              ctx.font = `500 ${Math.round(fontPx * 0.78)}px "JetBrains Mono", monospace`;
              ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.68})`;
              ctx.fillText(cb.subGlyph, cardW - padX, headerMidY);
              ctx.textAlign = 'left';
            }

            // 5. Soft Syntax-Tinted Code Lines with Muted Line Numbers
            ctx.textBaseline = 'top';
            let yCur = headerH + padY * 0.65;
            const numColW = Math.round(fontPx * 2.1);

            for (let lIdx = 0; lIdx < cb.lines.length; lIdx++) {
              const rawLine = cb.lines[lIdx];
              const trimmed = rawLine.trimStart();

              // Muted Slate Line Number (01, 02, 03...)
              ctx.font = `400 ${Math.round(fontPx * 0.84)}px "JetBrains Mono", monospace`;
              ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 0.58})`;
              ctx.fillText(`0${lIdx + 1}`, padX, yCur + fontPx * 0.08);

              // Eye-soothing syntax coloring based on line role
              ctx.font = `500 ${fontPx}px "JetBrains Mono", monospace`;
              if (trimmed.startsWith('//')) {
                // Soft muted teal-slate for comments
                ctx.fillStyle = `rgba(125, 211, 252, ${alpha * 0.62})`;
              } else if (
                trimmed.startsWith('export ') ||
                trimmed.startsWith('struct ') ||
                trimmed.startsWith('def ') ||
                trimmed.startsWith('void ') ||
                trimmed.startsWith('let ')
              ) {
                // Soft ice-cyan for declarations/signatures
                ctx.fillStyle = `rgba(165, 243, 252, ${alpha * 0.88})`;
              } else if (trimmed.startsWith('return ')) {
                // Soft lavender-silver for return statements
                ctx.fillStyle = `rgba(216, 180, 254, ${alpha * 0.84})`;
              } else {
                // Soft cool silver-slate for body lines (never harsh pure white)
                ctx.fillStyle = `rgba(203, 213, 225, ${alpha * 0.82})`;
              }

              ctx.fillText(rawLine, padX + numColW, yCur);
              yCur += lineH;
            }

            ctx.restore();
          });
        });
        ctx.restore();
      }

      // Scene 2 Subtle Peripheral Telemetry Badges (00:02.2 - 00:05.6) — Soft & Unobtrusive
      const utfAlpha = smoothstep(2.2, 3.2, sec) * (1 - smoothstep(4.8, 5.65, sec)) * 0.34;
      if (utfAlpha > 0.015) {
        ctx.save();
        const scene2FontPx = Math.round(9.8 * renderScale);
        ctx.font = `500 ${scene2FontPx}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const drawSubtleTelemetryTag = (label: string, subLabel: string, tx: number, ty: number) => {
          ctx.fillStyle = `rgba(125, 211, 252, ${utfAlpha * 0.85})`;
          ctx.fillText(label, tx, ty);
          ctx.fillStyle = `rgba(148, 163, 184, ${utfAlpha * 0.68})`;
          ctx.fillText(subLabel, tx, ty + scene2FontPx * 1.45);
        };

        drawSubtleTelemetryTag(
          'SYS.STREAM // 0x7F_SYNC',
          'stream.pipe(quantumCore);',
          cx - compW * 0.42,
          cy - h * 0.26
        );
        drawSubtleTelemetryTag(
          'UTF8_CHANNEL // LOCK_120HZ',
          'vec4(1.0, 0.96, 1.0, 1.0)',
          cx + compW * 0.28,
          cy - h * 0.26
        );
        ctx.restore();
      }

      // Peripheral 3D Angled Data Planes in 00:06.2 - 00:09.0 (Visible on top-right & bottom-left of 00:07-00:09)
      const periphAlpha = smoothstep(6.0, 7.2, sec);
      if (periphAlpha > 0.02) {
        ctx.save();
        ctx.strokeStyle = `rgba(215, 235, 250, ${periphAlpha * 0.48})`;
        ctx.fillStyle = `rgba(215, 235, 250, ${periphAlpha * 0.58})`;
        ctx.lineWidth = 1.15 * renderScale;

        for (let r = 0; r < 9; r++) {
          const bx = w * 0.88 + r * 4 * renderScale;
          const by = h * 0.08 + r * 14 * renderScale;
          const bw = (42 - (r % 3) * 12) * renderScale;
          ctx.fillRect(bx, by, bw, 2.2 * renderScale);
        }

        for (let r = 0; r < 8; r++) {
          const bx = w * 0.04 + r * 3 * renderScale;
          const by = h * 0.76 + r * 14 * renderScale;
          const bw = (46 - (r % 4) * 10) * renderScale;
          ctx.fillRect(bx, by, bw, 2.2 * renderScale);
        }
        ctx.restore();
      }

      // =====================================================================
      // CAMERA DOLLY ZOOM FOR CENTRAL CHIP & NEURAL MATRIX (00:03.5 - 00:09.0)
      // Matches the exact zoom-in from 00:04 -> 00:09 in the reference video
      // =====================================================================
      const cameraZoom = 0.84 + smoothstep(3.6, 9.0, sec) * 0.62 + subtleBreath;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-cx, -cy);

      const chipSize = minDim * 0.132;
      const chipHalf = chipSize * 0.5;

      // =====================================================================
      // 5. ULTRA-REALISTIC 3D NEURAL CORTEX MESH & PHOTONIC PCB ARCHITECTURE (00:03.4 - 00:09)
      // =====================================================================
      const circuitAlpha = smoothstep(3.4, 5.2, sec);
      if (circuitAlpha > 0.01) {
        ctx.save();
        const traceGrow = smoothstep(3.4, 4.9, sec);

        // Fast zero-allocation 4-point stellar diffraction star with optical halo
        const drawRealisticStarFlare = (
          sx: number,
          sy: number,
          outerR: number,
          coreAlpha: number,
          haloRgb: string = '125, 211, 252'
        ) => {
          if (coreAlpha <= 0.01 || outerR <= 0.5) return;
          const a = clamp(coreAlpha, 0, 1);

          // 1. Soft optical airy-disk glow halo (zero gradient allocation)
          ctx.fillStyle = `rgba(${haloRgb}, ${a * 0.35})`;
          ctx.beginPath();
          ctx.arc(sx, sy, outerR * 1.85, 0, Math.PI * 2);
          ctx.fill();

          // 2. Primary 4-point curved diamond star core
          ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy - outerR);
          ctx.quadraticCurveTo(sx, sy, sx + outerR, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy + outerR);
          ctx.quadraticCurveTo(sx, sy, sx - outerR, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy - outerR);
          ctx.closePath();
          ctx.fill();
        };

        const positionedNodes = CIRCUIT_NODES.map((n) => ({
          ...n,
          sx: cx + n.nx * compW * 0.94,
          sy: cy + n.ny * h * 0.94,
        }));

        const innerLeftNodes = positionedNodes.filter((n) => n.layer === 'innerLeft');
        const midLeftNodes = positionedNodes.filter((n) => n.layer === 'midLeft');
        const outerLeftNodes = positionedNodes.filter((n) => n.layer === 'outerLeft');

        const innerRightNodes = positionedNodes.filter((n) => n.layer === 'innerRight');
        const midRightNodes = positionedNodes.filter((n) => n.layer === 'midRight');
        const outerRightNodes = positionedNodes.filter((n) => n.layer === 'outerRight');

        // 5A. Photorealistic Geodesic Neural Cortex & Curved Axonal Synapse Network on Left & Right (00:04.5 - 00:09.0)
        const meshAlpha = smoothstep(4.5, 6.2, sec);
        if (meshAlpha > 0.01) {
          const drawRealisticNeuralWeb = (
            colA: typeof positionedNodes,
            colB: typeof positionedNodes,
            baseOpacity: number,
            isRightWing: boolean,
            layerSeed: number
          ) => {
            // 1. Intra-column curved dendritic spine connections (vertical neural backbone)
            const spineAlpha = meshAlpha * baseOpacity * 0.72;
            ctx.strokeStyle = `rgba(224, 244, 255, ${spineAlpha * 0.78})`;
            ctx.lineWidth = 1.2 * renderScale;
            ctx.beginPath();
            for (let i = 0; i + 1 < colA.length; i++) {
              const n0 = colA[i];
              const n1 = colA[i + 1];
              const midX = (n0.sx + n1.sx) * 0.5 + (isRightWing ? 1 : -1) * 8 * renderScale;
              const midY = (n0.sy + n1.sy) * 0.5;
              ctx.moveTo(n0.sx, n0.sy);
              ctx.quadraticCurveTo(midX, midY, n1.sx, n1.sy);
            }
            ctx.stroke();

            // 2. Geodesic nearest-neighbor curved axonal pathways between colA and colB
            for (let i = 0; i < colA.length; i++) {
              const a = colA[i];
              const normA = colA.length > 1 ? i / (colA.length - 1) : 0.5;

              for (let j = 0; j < colB.length; j++) {
                const b = colB[j];
                const normB = colB.length > 1 ? j / (colB.length - 1) : 0.5;
                const rankDist = Math.abs(normA - normB);

                if (rankDist > 0.39) continue;

                const proximityWeight = 1 - (rankDist / 0.42) * 0.45;
                const pulseWave =
                  0.78 + 0.22 * Math.sin(sec * 3.6 + elapsed * 1.4 + i * 1.1 + j * 0.85 + layerSeed);
                const lineA = meshAlpha * baseOpacity * proximityWeight * pulseWave;

                const dx = b.sx - a.sx;
                const dy = b.sy - a.sy;
                const curveArch = ((i + j) % 2 === 0 ? 1 : -1) * 10 * renderScale;
                const c1x = a.sx + dx * 0.36;
                const c1y = a.sy + dy * 0.14 + curveArch;
                const c2x = a.sx + dx * 0.66;
                const c2y = a.sy + dy * 0.86 - curveArch;

                const axonColor =
                  (i + j) % 3 === 0
                    ? '167, 139, 250'
                    : (i + j) % 3 === 1
                    ? '56, 189, 248'
                    : '125, 211, 252';

                ctx.strokeStyle = `rgba(${axonColor}, ${lineA * 0.78})`;
                ctx.lineWidth = 1.25 * renderScale;
                ctx.beginPath();
                ctx.moveTo(a.sx, a.sy);
                ctx.bezierCurveTo(c1x, c1y, c2x, c2y, b.sx, b.sy);
                ctx.stroke();

                if ((i + j) % 2 === 0) {
                  // Scrubbed primarily by scroll timeline (sec) so scrolling propels synaptic pulses
                  const synT = ((sec * 0.82 + elapsed * 0.06 + (i * 0.23 + j * 0.17 + layerSeed * 0.3)) % 1 + 1) % 1;
                  const headPt = getBezierPoint(synT, a.sx, a.sy, c1x, c1y, c2x, c2y, b.sx, b.sy);
                  drawRealisticStarFlare(
                    headPt.x,
                    headPt.y,
                    3.2 * renderScale,
                    Math.min(1, lineA * 1.85),
                    axonColor
                  );
                }
              }
            }
          };

          drawRealisticNeuralWeb(innerLeftNodes, midLeftNodes, 0.74, false, 0.1);
          drawRealisticNeuralWeb(midLeftNodes, outerLeftNodes, 0.58, false, 0.45);
          drawRealisticNeuralWeb(innerRightNodes, midRightNodes, 0.74, true, 0.25);
          drawRealisticNeuralWeb(midRightNodes, outerRightNodes, 0.58, true, 0.65);
        }

        const drawCurvedPcbTrace = (
          x0: number,
          y0: number,
          c1x: number,
          c1y: number,
          c2x: number,
          c2y: number,
          x3: number,
          y3: number,
          traceOpacity: number,
          pulsePhase: number
        ) => {
          const approxLen = Math.hypot(x3 - x0, y3 - y0) * 1.35;
          ctx.save();
          if (traceGrow < 0.995) {
            ctx.setLineDash([approxLen * traceGrow, approxLen]);
          }

          // 1. Mid-layer ice-blue optical conduit
          ctx.strokeStyle = `rgba(56, 189, 248, ${traceOpacity * 0.38})`;
          ctx.lineWidth = 3.2 * renderScale;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x3, y3);
          ctx.stroke();

          // 2. Crisp silver-white metallic core trace
          ctx.strokeStyle = `rgba(245, 252, 255, ${traceOpacity * 0.94})`;
          ctx.lineWidth = 1.45 * renderScale;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x3, y3);
          ctx.stroke();
          ctx.restore();

          // 3. Scroll-Driven Traveling Star Data Packet along the grown trace
          const packetT = clamp(((sec * 0.88 + elapsed * 0.06 + pulsePhase) % 1 + 1) % 1, 0, traceGrow);
          const pt = getBezierPoint(packetT, x0, y0, c1x, c1y, c2x, c2y, x3, y3);
          drawRealisticStarFlare(pt.x, pt.y, 4.2 * renderScale, traceOpacity * traceGrow, '56, 189, 248');
        };

        // 5B. Paired S-Curved Pin Traces from the Central Quantum Processor to the Hub Nodes
        innerLeftNodes.forEach((hub, hIdx) => {
          for (let pair = 0; pair < 2; pair++) {
            const pinIndex = hIdx * 2 + pair;
            const pinOffset = ((pinIndex - 3.5) / 4) * (chipHalf * 0.78);
            const x0 = cx - chipHalf - 8 * renderScale;
            const y0 = cy + pinOffset;
            const targetY = hub.sy + (pair === 0 ? -4 : 4) * renderScale;
            const c1x = x0 - minDim * 0.085;
            const c1y = y0;
            const c2x = (c1x + hub.sx) * 0.52;
            const c2y = targetY;

            drawCurvedPcbTrace(
              x0,
              y0,
              c1x,
              c1y,
              c2x,
              c2y,
              hub.sx,
              targetY,
              circuitAlpha * 0.92,
              pinIndex * 0.12
            );
          }
        });

        innerRightNodes.forEach((hub, hIdx) => {
          for (let pair = 0; pair < 2; pair++) {
            const pinIndex = hIdx * 2 + pair;
            const pinOffset = ((pinIndex - 3.5) / 4) * (chipHalf * 0.78);
            const x0 = cx + chipHalf + 8 * renderScale;
            const y0 = cy + pinOffset;
            const targetY = hub.sy + (pair === 0 ? -4 : 4) * renderScale;
            const c1x = x0 + minDim * 0.085;
            const c1y = y0;
            const c2x = (c1x + hub.sx) * 0.52;
            const c2y = targetY;

            drawCurvedPcbTrace(
              x0,
              y0,
              c1x,
              c1y,
              c2x,
              c2y,
              hub.sx,
              targetY,
              circuitAlpha * 0.92,
              pinIndex * 0.12 + 0.5
            );
          }
        });

        positionedNodes.forEach((node, idx) => {
          if (node.layer === 'topRow' || node.layer === 'bottomRow') {
            const pinOffset = ((node.pinIdx - 3.5) / 4) * (chipHalf * 0.78);
            const isTop = node.layer === 'topRow';
            const x0 = cx + pinOffset;
            const y0 = isTop ? cy - chipHalf - 8 * renderScale : cy + chipHalf + 8 * renderScale;
            const c1x = x0;
            const c1y = isTop ? y0 - minDim * 0.085 : y0 + minDim * 0.085;
            const c2x = node.sx;
            const c2y = (c1y + node.sy) * 0.5;

            drawCurvedPcbTrace(
              x0,
              y0,
              c1x,
              c1y,
              c2x,
              c2y,
              node.sx,
              node.sy,
              circuitAlpha * 0.76,
              idx * 0.11
            );
          }

          const isPrimaryHub = node.layer === 'innerLeft' || node.layer === 'innerRight';
          const boxSize = (isPrimaryHub ? 31 : 23) * renderScale;
          const half = boxSize * 0.5;

          ctx.save();
          ctx.translate(node.sx, node.sy);

          ctx.fillStyle = `rgba(28, 52, 78, ${circuitAlpha * 0.34})`;
          ctx.strokeStyle = `rgba(242, 249, 255, ${circuitAlpha * (isPrimaryHub ? 0.98 : 0.84)})`;
          ctx.lineWidth = (isPrimaryHub ? 1.9 : 1.35) * renderScale;
          ctx.beginPath();
          ctx.roundRect(-half, -half, boxSize, boxSize, 4.5 * renderScale);
          ctx.fill();
          ctx.stroke();

          // Precision inner corner bracket accents on primary hub modules
          if (isPrimaryHub) {
            const cbR = half * 0.76;
            ctx.strokeStyle = `rgba(125, 211, 252, ${circuitAlpha * 0.65})`;
            ctx.lineWidth = 0.95 * renderScale;
            ctx.strokeRect(-cbR, -cbR, cbR * 2, cbR * 2);
          }

          const ir = boxSize * 0.26;
          ctx.fillStyle = `rgba(255, 255, 255, ${circuitAlpha * 0.98})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${circuitAlpha * 0.96})`;
          ctx.lineWidth = 1.45 * renderScale;

          if (node.icon === 'square') {
            ctx.fillRect(-ir, -ir, ir * 2, ir * 2);
          } else if (node.icon === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -ir * 1.15);
            ctx.lineTo(ir * 1.15, ir * 0.95);
            ctx.lineTo(-ir * 1.15, ir * 0.95);
            ctx.closePath();
            ctx.fill();
          } else if (node.icon === 'wave') {
            ctx.beginPath();
            for (let x = -ir; x <= ir; x += 2) {
              const y = Math.sin((x / ir) * Math.PI * 1.5 + sec * 2.2 + elapsed * 1.8) * (ir * 0.65);
              if (x === -ir) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          } else if (node.icon === 'bars') {
            ctx.fillRect(-ir * 0.9, -ir * 0.2, ir * 0.45, ir * 1.1);
            ctx.fillRect(-ir * 0.2, -ir * 0.85, ir * 0.45, ir * 1.75);
            ctx.fillRect(ir * 0.5, -ir * 0.5, ir * 0.45, ir * 1.4);
          } else if (node.icon === 'tree') {
            ctx.beginPath();
            ctx.moveTo(-ir * 0.7, 0);
            ctx.lineTo(ir * 0.6, -ir * 0.6);
            ctx.moveTo(-ir * 0.7, 0);
            ctx.lineTo(ir * 0.6, ir * 0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-ir * 0.7, 0, 1.9 * renderScale, 0, Math.PI * 2);
            ctx.arc(ir * 0.6, -ir * 0.6, 1.9 * renderScale, 0, Math.PI * 2);
            ctx.arc(ir * 0.6, ir * 0.6, 1.9 * renderScale, 0, Math.PI * 2);
            ctx.fill();
          } else if (node.icon === 'gauge') {
            ctx.beginPath();
            ctx.arc(0, ir * 0.3, ir * 0.85, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, ir * 0.3);
            ctx.lineTo(ir * 0.48, -ir * 0.35);
            ctx.stroke();
          } else if (node.icon === 'sliders') {
            ctx.beginPath();
            ctx.moveTo(-ir * 0.8, -ir * 0.45);
            ctx.lineTo(ir * 0.8, -ir * 0.45);
            ctx.moveTo(-ir * 0.8, ir * 0.45);
            ctx.lineTo(ir * 0.8, ir * 0.45);
            ctx.stroke();
            ctx.fillRect(-ir * 0.3, -ir * 0.7, ir * 0.35, ir * 0.5);
            ctx.fillRect(ir * 0.1, ir * 0.2, ir * 0.35, ir * 0.5);
          } else {
            ctx.beginPath();
            ctx.arc(-ir * 0.45, -ir * 0.45, 1.8 * renderScale, 0, Math.PI * 2);
            ctx.arc(ir * 0.45, -ir * 0.45, 1.8 * renderScale, 0, Math.PI * 2);
            ctx.arc(-ir * 0.45, ir * 0.45, 1.8 * renderScale, 0, Math.PI * 2);
            ctx.arc(ir * 0.45, ir * 0.45, 1.8 * renderScale, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });

        ctx.restore();
      }

      // =====================================================================
      // 6. ULTRA-REALISTIC 3D QUANTUM AI PROCESSOR ARCHITECTURE & 3D GIMBAL CORE
      //    48-Pin Dual-Tier LGA Package, 16-Core Tensor Silicon Wafer Array,
      //    3D Tilted Gyroscopic Orbital Rings & Crackling Plasma Singularity Core
      // =====================================================================
      const chipAlpha = smoothstep(1.7, 2.95, sec);
      const fullPackageMorph = smoothstep(2.05, 3.3, sec);
      if (chipAlpha > 0.01) {
        ctx.save();
        ctx.translate(cx + parallaxX * 0.22, cy + parallaxY * 0.22);

        const coreBloomProgress = smoothstep(6.8, 8.9, sec);
        const pulseGlow = 0.045 * Math.sin(elapsed * 3.6);

        // 6A. Multi-Stage Volumetric Photonic Reactor Halo (Crisp high-contrast glow)
        const bloomR = chipSize * (1.95 + coreBloomProgress * 0.75);
        const bloom = ctx.createRadialGradient(0, 0, chipSize * 0.03, 0, 0, bloomR);
        bloom.addColorStop(
          0,
          `rgba(255, 255, 255, ${fullPackageMorph * (0.42 + coreBloomProgress * 0.28 + pulseGlow)})`
        );
        bloom.addColorStop(
          0.28,
          `rgba(${activeAct.accentRgb}, ${chipAlpha * (0.28 + coreBloomProgress * 0.18)})`
        );
        bloom.addColorStop(
          0.65,
          `rgba(${activeAct.secondaryRgb}, ${chipAlpha * (0.12 + coreBloomProgress * 0.1)})`
        );
        bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(0, 0, bloomR, 0, Math.PI * 2);
        ctx.fill();

        // 6A-II. 3 Tilted 3D Perspective Gyroscopic Gimbal Rings Orbiting the Quantum Processor (Scrubbed by sec)
        const gimbalConfigs = [
          {
            rx: chipSize * 1.38,
            ry: chipSize * (0.46 + 0.14 * Math.sin(sec * 1.8 + elapsed * 0.35)),
            tilt: sec * 1.35 + elapsed * 0.14,
            rgb: activeAct.accentRgb,
            alpha: 0.56,
          },
          {
            rx: chipSize * 1.18,
            ry: chipSize * (0.38 + 0.12 * Math.cos(sec * 2.1 + elapsed * 0.42)),
            tilt: -sec * 1.55 - elapsed * 0.16 + 1.047,
            rgb: activeAct.secondaryRgb,
            alpha: 0.48,
          },
          {
            rx: chipSize * 1.56,
            ry: chipSize * (0.32 + 0.1 * Math.sin(sec * 1.4 + elapsed * 0.28 + 2.1)),
            tilt: sec * 1.05 + elapsed * 0.1 + 2.094,
            rgb: '240, 249, 255',
            alpha: 0.36,
          },
        ];

        gimbalConfigs.forEach((g, gIdx) => {
          ctx.strokeStyle = `rgba(${g.rgb}, ${chipAlpha * g.alpha})`;
          ctx.lineWidth = (1.5 - gIdx * 0.2) * renderScale;
          ctx.beginPath();
          ctx.ellipse(0, 0, g.rx, g.ry, g.tilt, 0, Math.PI * 2);
          ctx.stroke();

          // Orbiting photonic satellite node along the 3D tilted gimbal ellipse (Locked to scroll sec)
          const satAngle = (sec * (2.6 + gIdx * 0.65) + elapsed * 0.28) * (gIdx % 2 === 0 ? 1 : -1);
          const localX = Math.cos(satAngle) * g.rx;
          const localY = Math.sin(satAngle) * g.ry;
          const cosT = Math.cos(g.tilt);
          const sinT = Math.sin(g.tilt);
          const sx = localX * cosT - localY * sinT;
          const sy = localX * sinT + localY * cosT;

          ctx.fillStyle = `rgba(255, 255, 255, ${chipAlpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.8 * renderScale, 0, Math.PI * 2);
          ctx.fill();
        });

        // 6B. 48 Dual-Tier Precision Metallic LGA/QFP Contact Pins (12 per side) with Glowing Tips
        const pinAlpha = chipAlpha * (0.35 + 0.65 * fullPackageMorph);
        const pinCountPerSide = 12;
        const pinLen = chipSize * 0.165;
        const pinThick = Math.max(1.8, chipSize * 0.028);
        for (let i = 0; i < pinCountPerSide; i++) {
          const offset = ((i - (pinCountPerSide - 1) * 0.5) / (pinCountPerSide * 0.5)) * (chipHalf * 0.82);
          const pinWave = 0.75 + 0.25 * Math.sin(elapsed * 4.2 + i * 0.65 + sec * 2.0);

          // Metallic pin body
          ctx.fillStyle = `rgba(232, 246, 255, ${pinAlpha * 0.94})`;
          // Left & Right pins
          ctx.fillRect(-chipHalf - pinLen, offset - pinThick * 0.5, pinLen, pinThick);
          ctx.fillRect(chipHalf, offset - pinThick * 0.5, pinLen, pinThick);
          // Top & Bottom pins
          ctx.fillRect(offset - pinThick * 0.5, -chipHalf - pinLen, pinThick, pinLen);
          ctx.fillRect(offset - pinThick * 0.5, chipHalf, pinThick, pinLen);

          // Glowing photonic contact pads at pin tips
          const tipR = pinThick * 0.78;
          ctx.fillStyle = `rgba(${activeAct.accentRgb}, ${pinAlpha * pinWave * 0.95})`;
          ctx.beginPath();
          ctx.arc(-chipHalf - pinLen, offset, tipR, 0, Math.PI * 2);
          ctx.arc(chipHalf + pinLen, offset, tipR, 0, Math.PI * 2);
          ctx.arc(offset, -chipHalf - pinLen, tipR, 0, Math.PI * 2);
          ctx.arc(offset, chipHalf + pinLen, tipR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6C. Outer 3D Chamfered Titanium-Sapphire Package Substrate (Luminous & Translucent)
        const pkgGlow = ctx.createLinearGradient(-chipHalf, -chipHalf, chipHalf, chipHalf);
        pkgGlow.addColorStop(0, `rgba(${activeAct.accentRgb}, ${chipAlpha * 0.26})`);
        pkgGlow.addColorStop(0.5, `rgba(240, 249, 255, ${chipAlpha * 0.15})`);
        pkgGlow.addColorStop(1, `rgba(${activeAct.secondaryRgb}, ${chipAlpha * 0.26})`);
        ctx.fillStyle = pkgGlow;
        ctx.strokeStyle = `rgba(245, 252, 255, ${chipAlpha * 0.98})`;
        ctx.lineWidth = 2.5 * renderScale;
        ctx.beginPath();
        ctx.roundRect(-chipHalf, -chipHalf, chipSize, chipSize, 10 * renderScale);
        ctx.fill();
        ctx.stroke();

        // Outer Chamfered Octagonal Bevel Frame + 4 Corner Laser Fiducial Mounts
        const bev = chipHalf * 0.91;
        const cut = chipHalf * 0.19;
        ctx.strokeStyle = `rgba(186, 230, 253, ${chipAlpha * 0.82})`;
        ctx.lineWidth = 1.25 * renderScale;
        ctx.beginPath();
        ctx.moveTo(-bev + cut, -bev);
        ctx.lineTo(bev - cut, -bev);
        ctx.lineTo(bev, -bev + cut);
        ctx.lineTo(bev, bev - cut);
        ctx.lineTo(bev - cut, bev);
        ctx.lineTo(-bev + cut, bev);
        ctx.lineTo(-bev, bev - cut);
        ctx.lineTo(-bev, -bev + cut);
        ctx.closePath();
        ctx.stroke();

        // 4 Corner Fiducial Alignment Rings (⊕)
        const fidOff = chipHalf * 0.81;
        const fidR = Math.max(2.0, chipSize * 0.026);
        const corners = [
          [-fidOff, -fidOff],
          [fidOff, -fidOff],
          [fidOff, fidOff],
          [-fidOff, fidOff],
        ];
        ctx.strokeStyle = `rgba(240, 249, 255, ${chipAlpha * 0.88})`;
        ctx.lineWidth = 1.1 * renderScale;
        corners.forEach(([fx, fy]) => {
          ctx.beginPath();
          ctx.arc(fx, fy, fidR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(${activeAct.accentRgb}, ${chipAlpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(fx, fy, fidR * 0.42, 0, Math.PI * 2);
          ctx.fill();
        });

        // 6D. Inner Silicon Die Carrier Frame & Perimeter SMD Micro-Capacitor Array
        const midSize = chipSize * 0.74;
        const midHalf = midSize * 0.5;
        const dieGrad = ctx.createLinearGradient(-midHalf, -midHalf, midHalf, midHalf);
        dieGrad.addColorStop(0, `rgba(56, 189, 248, ${chipAlpha * 0.18})`);
        dieGrad.addColorStop(0.5, `rgba(224, 242, 254, ${chipAlpha * 0.12})`);
        dieGrad.addColorStop(1, `rgba(139, 92, 246, ${chipAlpha * 0.18})`);
        ctx.fillStyle = dieGrad;
        ctx.strokeStyle = `rgba(224, 244, 255, ${chipAlpha * 0.92})`;
        ctx.lineWidth = 1.65 * renderScale;
        ctx.beginPath();
        ctx.roundRect(-midHalf, -midHalf, midSize, midSize, 5.5 * renderScale);
        ctx.fill();
        ctx.stroke();

        // SMD Micro-Capacitors lining the substrate corridor between package & die
        const smdDist = (chipHalf * 0.9 + midHalf) * 0.5;
        const smdW = Math.max(1.6, chipSize * 0.022);
        const smdL = Math.max(3.0, chipSize * 0.042);
        ctx.fillStyle = `rgba(224, 244, 255, ${chipAlpha * 0.78})`;
        for (let s = -3; s <= 3; s++) {
          const sPos = (s / 4) * (midHalf * 0.78);
          ctx.fillRect(sPos - smdL * 0.5, -smdDist - smdW * 0.5, smdL, smdW);
          ctx.fillRect(sPos - smdL * 0.5, smdDist - smdW * 0.5, smdL, smdW);
          ctx.fillRect(-smdDist - smdW * 0.5, sPos - smdL * 0.5, smdW, smdL);
          ctx.fillRect(smdDist - smdW * 0.5, sPos - smdL * 0.5, smdW, smdL);
        }

        // 6E. 16-Core (4x4) Quantum Tensor Silicon Wafer Array inside the Die
        const gridSpan = midSize * 0.84;
        const cellStep = gridSpan / 4;
        const tileW = cellStep * 0.74;
        const startXY = -gridSpan * 0.5 + (cellStep - tileW) * 0.5;

        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const tx = startXY + col * cellStep;
            const ty = startXY + row * cellStep;
            const corePulse =
              0.55 +
              0.45 * Math.sin(elapsed * 4.2 + row * 1.3 + col * 1.7 + sec * 2.4);
            const isInnerCore = (row === 1 || row === 2) && (col === 1 || col === 2);

            const tileColor =
              (row + col) % 2 === 0
                ? `rgba(${activeAct.accentRgb}, ${chipAlpha * (0.28 + corePulse * 0.42)})`
                : `rgba(${activeAct.secondaryRgb}, ${chipAlpha * (0.24 + corePulse * 0.38)})`;
            ctx.fillStyle = tileColor;
            ctx.strokeStyle = `rgba(240, 249, 255, ${chipAlpha * (isInnerCore ? 0.88 : 0.68)})`;
            ctx.lineWidth = 0.95 * renderScale;
            ctx.beginPath();
            ctx.roundRect(tx, ty, tileW, tileW, 2 * renderScale);
            ctx.fill();
            ctx.stroke();

            // Internal micro-register lines inside each tensor core tile
            ctx.strokeStyle = `rgba(255, 255, 255, ${chipAlpha * corePulse * 0.62})`;
            ctx.lineWidth = 0.7 * renderScale;
            ctx.beginPath();
            ctx.moveTo(tx + tileW * 0.2, ty + tileW * 0.35);
            ctx.lineTo(tx + tileW * 0.8, ty + tileW * 0.35);
            ctx.moveTo(tx + tileW * 0.2, ty + tileW * 0.65);
            ctx.lineTo(tx + tileW * 0.8, ty + tileW * 0.65);
            ctx.stroke();
          }
        }

        // High-Bandwidth Interconnect (HBI) Crossbar Axes across the 16 Tensor Cores
        ctx.strokeStyle = `rgba(255, 255, 255, ${chipAlpha * 0.78})`;
        ctx.lineWidth = 1.2 * renderScale;
        ctx.beginPath();
        ctx.moveTo(-midHalf, 0);
        ctx.lineTo(midHalf, 0);
        ctx.moveTo(0, -midHalf);
        ctx.lineTo(0, midHalf);
        ctx.stroke();

        // 6F. Central Quantum Photonic Singularity Core, Crackling Plasma Arcs & Gyroscopic Rings
        const coreSize = chipSize * 0.42;
        const coreHalf = coreSize * 0.5;
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreHalf * 1.55);
        coreGrad.addColorStop(
          0,
          `rgba(255, 255, 255, ${chipAlpha * (0.96 + coreBloomProgress * 0.04)})`
        );
        coreGrad.addColorStop(
          0.48,
          `rgba(224, 246, 255, ${chipAlpha * (0.85 + coreBloomProgress * 0.15)})`
        );
        coreGrad.addColorStop(1, `rgba(${activeAct.accentRgb}, ${chipAlpha * 0.58})`);
        ctx.fillStyle = coreGrad;
        ctx.strokeStyle = `rgba(255, 255, 255, ${chipAlpha * 0.99})`;
        ctx.lineWidth = 2.0 * renderScale;
        ctx.beginPath();
        ctx.roundRect(-coreHalf, -coreHalf, coreSize, coreSize, 4.5 * renderScale);
        ctx.fill();
        ctx.stroke();

        // Crackling Plasma Energy Filaments inside the Quantum Core
        ctx.strokeStyle = `rgba(255, 255, 255, ${chipAlpha * 0.82})`;
        ctx.lineWidth = 1.15 * renderScale;
        for (let arcIdx = 0; arcIdx < 6; arcIdx++) {
          const ang = (arcIdx / 6) * Math.PI * 2 + elapsed * 3.1;
          const jitter = Math.sin(elapsed * 14.0 + arcIdx * 2.3) * (coreHalf * 0.24);
          const endX = Math.cos(ang) * (coreHalf * 0.88);
          const endY = Math.sin(ang) * (coreHalf * 0.88);
          const ctrlX = Math.cos(ang + 0.35) * (coreHalf * 0.45) + jitter;
          const ctrlY = Math.sin(ang - 0.35) * (coreHalf * 0.45) - jitter;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
          ctx.stroke();
        }

        // Counter-rotating gyroscopic quantum containment rings inside the central core
        const gyroR1 = coreHalf * 0.78;
        const gyroR2 = coreHalf * 0.54;
        const rot1 = elapsed * 2.1 + sec * 0.9;
        const rot2 = -elapsed * 2.6 - sec * 1.1;

        ctx.strokeStyle = `rgba(255, 255, 255, ${chipAlpha * 0.94})`;
        ctx.lineWidth = 1.35 * renderScale;
        for (let seg = 0; seg < 4; seg++) {
          const a0 = rot1 + (seg * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(0, 0, gyroR1, a0, a0 + Math.PI * 0.32);
          ctx.stroke();
        }

        ctx.strokeStyle = `rgba(${activeAct.accentRgb}, ${chipAlpha * 0.9})`;
        ctx.lineWidth = 1.2 * renderScale;
        for (let seg = 0; seg < 3; seg++) {
          const a0 = rot2 + (seg * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(0, 0, gyroR2, a0, a0 + Math.PI * 0.42);
          ctx.stroke();
        }

        // Central 8-Point Diamond Singularity Star-Burst
        const starCoreR = coreHalf * (0.52 + 0.1 * Math.sin(elapsed * 5.2));
        ctx.fillStyle = `rgba(255, 255, 255, ${chipAlpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -starCoreR);
        ctx.quadraticCurveTo(0, 0, starCoreR, 0);
        ctx.quadraticCurveTo(0, 0, 0, starCoreR);
        ctx.quadraticCurveTo(0, 0, -starCoreR, 0);
        ctx.quadraticCurveTo(0, 0, 0, -starCoreR);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // =====================================================================
      // 7. 6 CONVERGING 3D GALACTIC STAR-STREAMS & PHOTONIC FILAMENTS (SCROLL-LOCKED ACT II-V)
      // =====================================================================
      const ribbonAlpha =
        smoothstep(0.7, 1.55, sec) * (1 - smoothstep(5.4, 6.7, sec));
      if (ribbonAlpha > 0.01) {
        const ribbons = [
          { x0: cx - compW * 0.56, y0: h * 0.1, x1: cx - compW * 0.28, y1: cy - h * 0.18, x2: cx - compW * 0.14, y2: cy - h * 0.02, rgb: '56, 189, 248' },
          { x0: cx - compW * 0.56, y0: h * 0.54, x1: cx - compW * 0.30, y1: cy + h * 0.08, x2: cx - compW * 0.12, y2: cy + h * 0.02, rgb: '167, 139, 250' },
          { x0: cx - compW * 0.42, y0: h * 1.05, x1: cx - compW * 0.22, y1: cy + h * 0.25, x2: cx - compW * 0.08, y2: cy + h * 0.06, rgb: '125, 211, 252' },
          { x0: cx + compW * 0.56, y0: h * 0.12, x1: cx + compW * 0.28, y1: cy - h * 0.16, x2: cx + compW * 0.14, y2: cy - h * 0.02, rgb: '125, 211, 252' },
          { x0: cx + compW * 0.56, y0: h * 0.52, x1: cx + compW * 0.30, y1: cy + h * 0.06, x2: cx + compW * 0.12, y2: cy + h * 0.02, rgb: '232, 121, 249' },
          { x0: cx + compW * 0.38, y0: h * 1.05, x1: cx + compW * 0.22, y1: cy + h * 0.26, x2: cx + compW * 0.08, y2: cy + h * 0.06, rgb: '56, 189, 248' },
        ];

        const headReach = smoothstep(0.65, 2.4, sec);
        const tailStart = smoothstep(5.0, 6.7, sec);

        ctx.save();
        const primarySample = samples[samples.length - 1];
        const sSec = primarySample.progress * 9.0;

        // 7A. Luminous Photonic Guide Filaments connecting the side streams into the processor core
        ribbons.forEach((rb, rbIdx) => {
          const waveShiftY = Math.sin(sec * 2.5 + elapsed * 0.8 + rbIdx * 1.1) * (12 * renderScale);
          const filGrad = ctx.createLinearGradient(rb.x0, rb.y0, cx, cy);
          filGrad.addColorStop(0, `rgba(${rb.rgb}, 0)`);
          filGrad.addColorStop(0.35, `rgba(${rb.rgb}, ${ribbonAlpha * 0.26})`);
          filGrad.addColorStop(0.85, `rgba(240, 249, 255, ${ribbonAlpha * 0.42})`);
          filGrad.addColorStop(1, `rgba(255, 255, 255, ${ribbonAlpha * 0.62})`);
          ctx.strokeStyle = filGrad;
          ctx.lineWidth = 2.2 * renderScale;
          ctx.beginPath();
          ctx.moveTo(rb.x0, rb.y0);
          ctx.bezierCurveTo(rb.x1, rb.y1 + waveShiftY, rb.x2, rb.y2 - waveShiftY * 0.5, cx, cy);
          ctx.stroke();
        });

        // 7B. Crisp 4-Point Stellar Stream Particles with Comet Micro-Trails (Scrubbed by sSec)
        ctx.fillStyle = `rgba(248, 252, 255, ${ribbonAlpha * 0.96})`;
        ctx.beginPath();
        for (let i = 0; i < streamDots.length; i++) {
          const sd = streamDots[i];
          if (sd.isBokeh) continue;
          const rb = ribbons[sd.ribbonIdx];
          const u = ((sd.u + sSec * 0.52 + elapsed * sd.speed * 0.04) % 1 + 1) % 1;
          if (u > headReach || u < tailStart * 0.85) continue;

          const pt = getBezierPoint(u, rb.x0, rb.y0, rb.x1, rb.y1, rb.x2, rb.y2, cx, cy);
          const taper = 1 - u * 0.82;
          const px = pt.x + sd.spreadX * renderScale * taper;
          const py = pt.y + sd.spreadY * renderScale * taper;
          const r = sd.radius * renderScale * (1 - u * 0.32) * 1.85;
          ctx.moveTo(px, py - r);
          ctx.quadraticCurveTo(px, py, px + r, py);
          ctx.quadraticCurveTo(px, py, px, py + r);
          ctx.quadraticCurveTo(px, py, px - r, py);
          ctx.quadraticCurveTo(px, py, px, py - r);
        }
        ctx.fill();

        // 7C. Foreground Multi-Layered Optical Bokeh Stars (Zero Gradient Allocation)
        for (let i = 0; i < streamDots.length; i++) {
          const sd = streamDots[i];
          if (!sd.isBokeh) continue;
          const rb = ribbons[sd.ribbonIdx];
          const u = ((sd.u + sSec * 0.52 + elapsed * sd.speed * 0.04) % 1 + 1) % 1;
          if (u > headReach || u < tailStart * 0.85) continue;

          const pt = getBezierPoint(u, rb.x0, rb.y0, rb.x1, rb.y1, rb.x2, rb.y2, cx, cy);
          const taper = 1 - u * 0.82;
          const px = pt.x + sd.spreadX * renderScale * taper;
          const py = pt.y + sd.spreadY * renderScale * taper;
          const r = sd.radius * renderScale * (1 - u * 0.3) * 1.52;
          const starA = ribbonAlpha * sd.alpha * 1.4;

          ctx.fillStyle = `rgba(${rb.rgb}, ${clamp(starA * 0.42, 0, 1)})`;
          ctx.beginPath();
          ctx.arc(px, py, r * 1.7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${clamp(starA, 0, 1)})`;
          ctx.beginPath();
          ctx.moveTo(px, py - r);
          ctx.quadraticCurveTo(px, py, px + r, py);
          ctx.quadraticCurveTo(px, py, px, py + r);
          ctx.quadraticCurveTo(px, py, px - r, py);
          ctx.quadraticCurveTo(px, py, px, py - r);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Continuous Ambient Multi-Chromatic Orbital Pulse Rings (00:00 - 00:09)
      ctx.save();
      ctx.translate(cx, cy);
      const orbitalColors = [
        `rgba(${activeAct.accentRgb}, 0.22)`,
        `rgba(${activeAct.secondaryRgb}, 0.18)`,
        'rgba(139, 92, 246, 0.16)',
        'rgba(16, 185, 129, 0.15)',
      ];
      for (let rIdx = 0; rIdx < 4; rIdx++) {
        const ringRad =
          minDim * (0.22 + rIdx * 0.11 + Math.sin(elapsed * 1.2 + rIdx * 1.4) * 0.014);
        const startAng = elapsed * (rIdx % 2 === 0 ? 0.52 : -0.44) + rIdx * 1.57 + p * Math.PI * 1.5;
        ctx.strokeStyle = orbitalColors[rIdx];
        ctx.lineWidth = 1.5 * renderScale;
        ctx.beginPath();
        ctx.arc(0, 0, ringRad, startAng, startAng + Math.PI * 0.68);
        ctx.stroke();
      }
      ctx.restore();

      // Holographic "△  ⚡  ≡" Symbols below center in 00:01.6 - 00:05.8
      const symAlpha = smoothstep(1.6, 2.3, sec) * (1 - smoothstep(5.1, 5.9, sec));
      if (symAlpha > 0.02) {
        ctx.save();
        ctx.font = `600 ${Math.round(14.5 * renderScale)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(240, 248, 255, ${symAlpha * 0.96})`;
        ctx.textAlign = 'center';
        ctx.fillText('△   ⚡   ≡', cx, cy + minDim * 0.21);
        ctx.restore();
      }

      ctx.restore(); // End cameraZoom
      ctx.restore(); // End 3D Cinema Camera Roll & Pan

      // =====================================================================
      // 7B. ANAMORPHIC CINEMA LENS FLARE & OPTICAL IRIS GHOSTING RINGS
      // =====================================================================
      ctx.save();
      const flareIntensity =
        0.28 +
        0.19 * Math.sin(sec * Math.PI * 1.1 + elapsed * 2.1) +
        clamp(Math.abs(currentVelocity) * 0.08, 0, 0.28);
      const flareY = focusCenterY;
      const flareW = w * (0.76 + p * 0.22);

      // Horizontal Anamorphic Laser-Streak across the quantum core
      const anamorphicGrad = ctx.createLinearGradient(
        focusCenterX - flareW * 0.5,
        flareY,
        focusCenterX + flareW * 0.5,
        flareY
      );
      anamorphicGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      anamorphicGrad.addColorStop(0.22, `rgba(${activeAct.secondaryRgb}, ${flareIntensity * 0.32})`);
      anamorphicGrad.addColorStop(0.45, `rgba(${activeAct.accentRgb}, ${flareIntensity * 0.72})`);
      anamorphicGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareIntensity * 0.96})`);
      anamorphicGrad.addColorStop(0.55, `rgba(${activeAct.accentRgb}, ${flareIntensity * 0.72})`);
      anamorphicGrad.addColorStop(0.78, `rgba(${activeAct.secondaryRgb}, ${flareIntensity * 0.32})`);
      anamorphicGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = anamorphicGrad;
      ctx.fillRect(
        focusCenterX - flareW * 0.5,
        flareY - 2.6 * renderScale,
        flareW,
        5.2 * renderScale
      );

      // Soft vertical & horizontal cinema bloom core
      const softStreakH = 28 * renderScale;
      const softStreakGrad = ctx.createRadialGradient(
        focusCenterX,
        flareY,
        0,
        focusCenterX,
        flareY,
        flareW * 0.34
      );
      softStreakGrad.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity * 0.38})`);
      softStreakGrad.addColorStop(0.35, `rgba(${activeAct.accentRgb}, ${flareIntensity * 0.22})`);
      softStreakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = softStreakGrad;
      ctx.fillRect(
        focusCenterX - flareW * 0.34,
        flareY - softStreakH,
        flareW * 0.68,
        softStreakH * 2
      );

      // Cinema Optical Iris Ghosting Rings (Counter-Axis Lens Reflections that react to cursor & camera pan)
      const ghostOffsets = [-0.32, -0.16, 0.15, 0.29, 0.42];
      ghostOffsets.forEach((off, gIdx) => {
        const gx = cx + (cx - focusCenterX) * (2.1 + gIdx * 0.55) + off * w * 0.38;
        const gy = cy + (cy - focusCenterY) * (2.1 + gIdx * 0.55) + off * h * 0.16;
        const gr = (14 + gIdx * 10) * renderScale;
        ctx.strokeStyle =
          gIdx % 2 === 0
            ? `rgba(${activeAct.accentRgb}, ${flareIntensity * 0.25})`
            : `rgba(${activeAct.secondaryRgb}, ${flareIntensity * 0.2})`;
        ctx.lineWidth = 1.35 * renderScale;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Subtle Anamorphic Widescreen Cinema Top/Bottom Atmospheric Vignette
      const topVig = ctx.createLinearGradient(0, 0, 0, h * 0.11);
      topVig.addColorStop(0, 'rgba(2, 3, 8, 0.72)');
      topVig.addColorStop(1, 'rgba(2, 3, 8, 0)');
      ctx.fillStyle = topVig;
      ctx.fillRect(0, 0, w, h * 0.11);

      const botVig = ctx.createLinearGradient(0, h * 0.89, 0, h);
      botVig.addColorStop(0, 'rgba(2, 3, 8, 0)');
      botVig.addColorStop(1, 'rgba(2, 3, 8, 0.76)');
      ctx.fillStyle = botVig;
      ctx.fillRect(0, h * 0.89, w, h * 0.11);
      ctx.restore();

      // =====================================================================
      // 8. FOUR-POINTED SILVER-WHITE STAR (✦) AT BOTTOM-RIGHT (00:00 - 00:09)
      // =====================================================================
      ctx.save();
      const starX = w * 0.915;
      const starY = h * 0.835;
      const starR = 14.5 * renderScale * (0.92 + 0.12 * Math.sin(elapsed * 3.2));
      ctx.translate(starX, starY);
      ctx.fillStyle = 'rgba(235, 244, 252, 0.94)';
      ctx.beginPath();
      ctx.moveTo(0, -starR);
      ctx.quadraticCurveTo(0, 0, starR, 0);
      ctx.quadraticCurveTo(0, 0, 0, starR);
      ctx.quadraticCurveTo(0, 0, -starR, 0);
      ctx.quadraticCurveTo(0, 0, 0, -starR);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();

      const curFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(p * (TOTAL_FRAMES - 1)) + 1));
      if (curFrame !== lastReportedFrame) {
        lastReportedFrame = curFrame;
        window.dispatchEvent(
          new CustomEvent('cyber-video-frame', {
            detail: {
              currentFrame: curFrame,
              totalFrames: TOTAL_FRAMES,
              videoTimeSec: sec,
              cinemaAct: activeAct,
              actLocalProgress,
            },
          })
        );
        if (onFrameStatusChange) {
          const atlasTelemetry = webglAtlasRef.current.getTelemetry();
          onFrameStatusChange({
            currentFrame: curFrame,
            totalFrames: TOTAL_FRAMES,
            extractingProgress: null,
            videoTimeSec: sec,
            cacheResidentCount: Math.max(PREDICTIVE_LOOKAHEAD_FRAMES, atlasTelemetry.residentFrames),
            interpolatedSubFrames: samples.length,
            resolutionLabel: `${w}x${h} 4K UHD`,
            predictiveBufferedFrames: PREDICTIVE_LOOKAHEAD_FRAMES,
            atlasTelemetry,
          });
        }
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      domMutationObserver.disconnect();
    };
  }, [onFrameStatusChange]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#04070b]"
      aria-hidden="true"
      data-predictive-atlas-frames={PREDICTIVE_LOOKAHEAD_FRAMES}
    >
      {/* Low-Latency Hardware-Accelerated WebGL Texture-Atlas Layer (Active when custom 4K video/ZIP is loaded) */}
      {customSource && (
        <canvas
          ref={webglCanvasRef}
          className="absolute inset-0 w-full h-full block object-cover opacity-90"
        />
      )}
      {/* 4K Ultra-HD (3840x2160) 60FPS Real-Time Composite Layer */}
      <canvas
        ref={canvasRef}
        className="relative w-full h-full block object-cover"
      />
    </div>
  );
};
