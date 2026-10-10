import React, { useEffect, useRef } from 'react';
import { CHROMATIC_28_PALETTE } from '../utils/cyberMotion';

interface PhysicsStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  colorIndex: number;
  colorHex: string;
  colorRgb: string;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  mass: number;
  rotation: number;
  rotationSpeed: number;
  rayScale: number;
  hasDiagonalRays: boolean;
}

interface CursorStarSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  colorHex: string;
  colorRgb: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

interface ShootingComet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tailLen: number;
  colorIndex: number;
  colorHex: string;
  colorRgb: string;
  life: number;
  maxLife: number;
  radius: number;
}

const STAR_SPRITE_SIZE = 64;
const STAR_SPRITE_HALF = STAR_SPRITE_SIZE / 2;
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

/**
 * Pre-renders a high-DPI glowing celestial star sprite for a given chromatic color
 * so every star has a soft radial nebula halo, 4 primary diamond starburst rays,
 * 4 diagonal micro-flares, and a brilliant diamond-white supernova core at zero CPU cost.
 */
const createChromaticStarSprite = (colorHex: string, colorRgb: string): HTMLCanvasElement => {
  const sprite = document.createElement('canvas');
  sprite.width = STAR_SPRITE_SIZE;
  sprite.height = STAR_SPRITE_SIZE;
  const sCtx = sprite.getContext('2d');
  if (!sCtx) return sprite;

  const cx = STAR_SPRITE_HALF;
  const cy = STAR_SPRITE_HALF;

  // 1. Soft outer chromatic nebula halo
  const haloGrad = sCtx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  haloGrad.addColorStop(0, '#ffffff');
  haloGrad.addColorStop(0.14, colorHex);
  haloGrad.addColorStop(0.38, `rgba(${colorRgb}, 0.48)`);
  haloGrad.addColorStop(0.72, `rgba(${colorRgb}, 0.12)`);
  haloGrad.addColorStop(1, `rgba(${colorRgb}, 0)`);
  sCtx.fillStyle = haloGrad;
  sCtx.fillRect(0, 0, STAR_SPRITE_SIZE, STAR_SPRITE_SIZE);

  sCtx.save();
  sCtx.translate(cx, cy);

  // 2. Primary 4-pointed diamond starburst spikes (Horizontal & Vertical)
  const drawSpike = (length: number, thickness: number, alpha: number) => {
    const spikeGrad = sCtx.createLinearGradient(-length, 0, length, 0);
    spikeGrad.addColorStop(0, `rgba(${colorRgb}, 0)`);
    spikeGrad.addColorStop(0.25, `rgba(${colorRgb}, ${alpha * 0.55})`);
    spikeGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
    spikeGrad.addColorStop(0.75, `rgba(${colorRgb}, ${alpha * 0.55})`);
    spikeGrad.addColorStop(1, `rgba(${colorRgb}, 0)`);
    sCtx.fillStyle = spikeGrad;
    sCtx.beginPath();
    sCtx.moveTo(-length, 0);
    sCtx.quadraticCurveTo(0, -thickness, length, 0);
    sCtx.quadraticCurveTo(0, thickness, -length, 0);
    sCtx.closePath();
    sCtx.fill();
  };

  drawSpike(cx * 0.94, 2.6, 0.98);
  sCtx.rotate(Math.PI / 2);
  drawSpike(cx * 0.94, 2.6, 0.98);

  // 3. Secondary 45-degree diagonal star rays
  sCtx.rotate(Math.PI / 4);
  drawSpike(cx * 0.56, 1.6, 0.78);
  sCtx.rotate(Math.PI / 2);
  drawSpike(cx * 0.56, 1.6, 0.78);

  // 4. Crisp 4-pointed geometric star facet body (✦)
  sCtx.rotate(-Math.PI * 1.25);
  const starOuter = 9.5;
  const starInner = 2.4;
  sCtx.fillStyle = '#ffffff';
  sCtx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? starOuter : starInner;
    const ang = (i * Math.PI) / 4;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    if (i === 0) sCtx.moveTo(px, py);
    else sCtx.lineTo(px, py);
  }
  sCtx.closePath();
  sCtx.fill();

  sCtx.restore();
  return sprite;
};

/**
 * Draws a crisp rotating 4-pointed celestial star (✦) path directly in world coordinates
 * WITHOUT ctx.save()/ctx.translate()/ctx.rotate()/ctx.restore() for 4x faster 60/120FPS rendering.
 */
const drawFastVectorStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerR: number,
  innerR: number,
  rotation: number,
  fillStyle: string,
  alpha: number
) => {
  if (alpha <= 0.01 || outerR <= 0.2) return;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const diag = 0.70710678 * innerR;
  const dCos = (cos - sin) * diag;
  const dSin = (sin + cos) * diag;
  const dCos2 = (-cos - sin) * diag;
  const dSin2 = (cos - sin) * diag;

  ctx.globalAlpha = alpha > 1 ? 1 : alpha;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(x + cos * outerR, y + sin * outerR);
  ctx.lineTo(x + dCos, y + dSin);
  ctx.lineTo(x - sin * outerR, y + cos * outerR);
  ctx.lineTo(x + dCos2, y + dSin2);
  ctx.lineTo(x - cos * outerR, y - sin * outerR);
  ctx.lineTo(x - dCos, y - dSin);
  ctx.lineTo(x + sin * outerR, y - cos * outerR);
  ctx.lineTo(x - dCos2, y - dSin2);
  ctx.closePath();
  ctx.fill();
};

/**
 * Interactive 60/120FPS Celestial Star Physics Overlay that converts all 28+ colourful
 * background dots into glowing, twinkling, rotating stars while preserving 100% of
 * their physics features: cursor repulsion/attraction, vortex swirl, velocity wakes,
 * synaptic constellation links, cursor tethers, and click shockwave star bursts.
 */
export const CyberParticlePhysicsOverlay: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastW = 0;
    let lastH = 0;

    const updateSize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      if (lastW === nextW && lastH > 0 && nextW < 1024 && Math.abs(nextH - lastH) < 140) {
        return;
      }
      width = nextW;
      height = nextH;
      lastW = nextW;
      lastH = nextH;
      canvas.width = width;
      canvas.height = height;
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // Lazy on-demand cache for the 28 chromatic star sprites so mount takes 0ms on startup
    const starSprites: (HTMLCanvasElement | undefined)[] = new Array(CHROMATIC_28_PALETTE.length);
    const getStarSprite = (idx: number): HTMLCanvasElement => {
      let sp = starSprites[idx];
      if (!sp) {
        const c = CHROMATIC_28_PALETTE[idx];
        sp = createChromaticStarSprite(c.hex, c.rgb);
        starSprites[idx] = sp;
      }
      return sp;
    };

    // Initialize multi-chromatic physics stars across the viewport
    const starCount = width < 768 ? 14 : 26;
    const stars: PhysicsStar[] = Array.from({ length: starCount }, (_, i) => {
      const colorIndex = i % CHROMATIC_28_PALETTE.length;
      const paletteColor = CHROMATIC_28_PALETTE[colorIndex];
      const angle = (i / starCount) * Math.PI * 2 + i * 0.37;
      const speed = 0.22 + (i % 7) * 0.065;
      const bvx = Math.cos(angle) * speed;
      const bvy = Math.sin(angle) * speed;

      return {
        x: ((i * 137.5) % 100) * 0.01 * width,
        y: ((i * 293.7) % 100) * 0.01 * height,
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        radius: 1.8 + (i % 5) * 0.65,
        colorIndex,
        colorHex: paletteColor.hex,
        colorRgb: paletteColor.rgb,
        alpha: 0.48 + (i % 4) * 0.13,
        phase: i * 0.9,
        pulseSpeed: 1.6 + (i % 5) * 0.38,
        mass: 0.75 + (i % 4) * 0.22,
        rotation: (i * 0.45) % (Math.PI * 2),
        rotationSpeed: (i % 2 === 0 ? 1 : -1) * (0.008 + (i % 5) * 0.0035),
        rayScale: 1.85 + (i % 4) * 0.32,
        hasDiagonalRays: i % 3 === 0,
      };
    });

    const sparks: CursorStarSpark[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      active: false,
      lastMoveTime: 0,
      shockwaveTime: 0,
      shockwaveX: -9999,
      shockwaveY: -9999,
    };

    let colorCycleIdx = 0;

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (mouse.active) {
        const dx = e.clientX - mouse.x;
        const dy = e.clientY - mouse.y;
        mouse.vx = dx * 0.35;
        mouse.vy = dy * 0.35;

        const speedSq = dx * dx + dy * dy;
        if (speedSq > 22 && sparks.length < 42) {
          const cIdx = colorCycleIdx % CHROMATIC_28_PALETTE.length;
          const c = CHROMATIC_28_PALETTE[cIdx];
          colorCycleIdx++;
          sparks.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 2.2 - dx * 0.08,
            vy: (Math.random() - 0.5) * 2.2 - dy * 0.08,
            radius: 1.8 + Math.random() * 1.8,
            colorIndex: cIdx,
            colorHex: c.hex,
            colorRgb: c.rgb,
            life: 0,
            maxLife: 24 + Math.random() * 18,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.14,
          });
        }
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastMoveTime = now;
    };

    const onMouseDown = (e: MouseEvent) => {
      mouse.shockwaveX = e.clientX;
      mouse.shockwaveY = e.clientY;
      mouse.shockwaveTime = performance.now();

      // Spawn a chromatic burst of 14 physics star-sparks on click
      for (let i = 0; i < 14; i++) {
        if (sparks.length >= 56) break;
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.2;
        const spd = 2.2 + Math.random() * 3.6;
        const cIdx = (colorCycleIdx + i) % CHROMATIC_28_PALETTE.length;
        const c = CHROMATIC_28_PALETTE[cIdx];
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 2.2 + Math.random() * 1.8,
          colorIndex: cIdx,
          colorHex: c.hex,
          colorRgb: c.rgb,
          life: 0,
          maxLife: 32 + Math.random() * 16,
          rotation: angle,
          rotationSpeed: (i % 2 === 0 ? 1 : -1) * 0.09,
        });
      }
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    let rafId: number;
    let lastFrameTime = 0;
    let lastCometSpawn = performance.now();
    const comets: ShootingComet[] = [];
    const interactionRadius = 210;
    const interactionRadiusSq = interactionRadius * interactionRadius;
    const connectDistance = 128;
    const connectDistanceSq = connectDistance * connectDistance;

    const spawnShootingComet = () => {
      if (comets.length >= 3) return;
      const cIdx = colorCycleIdx % CHROMATIC_28_PALETTE.length;
      const c = CHROMATIC_28_PALETTE[cIdx];
      colorCycleIdx++;

      const fromLeft = Math.random() > 0.45;
      const startX = fromLeft ? Math.random() * width * 0.65 : width * 0.35 + Math.random() * width * 0.65;
      const startY = Math.random() * height * 0.42;
      const angle = fromLeft
        ? 0.38 + Math.random() * 0.32
        : Math.PI - (0.38 + Math.random() * 0.32);
      const speed = 11.5 + Math.random() * 6.5;

      comets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tailLen: 95 + Math.random() * 65,
        colorIndex: cIdx,
        colorHex: c.hex,
        colorRgb: c.rgb,
        life: 0,
        maxLife: 44 + Math.random() * 24,
        radius: 2.3 + Math.random() * 1.1,
      });
    };

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const isCursorRecent = mouse.active && now - mouse.lastMoveTime < 1500;
      const shockwaveAge = now - mouse.shockwaveTime;
      const hasShockwave = shockwaveAge >= 0 && shockwaveAge < 650;

      // Maintain smooth 60FPS real-time celestial motion
      if (!isCursorRecent && !hasShockwave && sparks.length === 0 && comets.length === 0 && now - lastFrameTime < 15.5) {
        return;
      }
      lastFrameTime = now;

      // Periodically spawn a cinematic shooting star comet every ~2.2 seconds
      if (now - lastCometSpawn > 2200) {
        lastCometSpawn = now + Math.random() * 900;
        spawnShootingComet();
      }

      ctx.clearRect(0, 0, width, height);

      const elapsed = now * 0.001;
      const scrollVelocity = clamp(window.__lenisScrollState?.velocity || 0, -28, 28);

      // Decay cursor velocity smoothly
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      // 1. Update & Render Main Multi-Chromatic Physics Stars
      for (let i = 0; i < stars.length; i++) {
        const p = stars[i];

        // Gentle harmonic drift return toward base orbital velocity
        p.vx += (p.baseVx - p.vx) * 0.025;
        p.vy += (p.baseVy - p.vy) * 0.025;

        let cursorProximityBoost = 0;

        // Cursor electromagnetic + vortex swirl physics
        if (isCursorRecent) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < interactionRadiusSq && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const normX = dx / dist;
            const normY = dy / dist;
            const influence = (1 - dist / interactionRadius) / p.mass;
            cursorProximityBoost = 1 - dist / interactionRadius;

            // Inner core repulsion (< 58px) + outer orbital attraction + tangential swirl
            if (dist < 58) {
              const repel = (1 - dist / 58) * 1.45;
              p.vx -= normX * repel;
              p.vy -= normY * repel;
            } else {
              // Gentle gravitational pull + orbital tangent + cursor velocity wake
              p.vx += (normX * 0.18 - normY * 0.36) * influence + mouse.vx * 0.032 * influence;
              p.vy += (normY * 0.18 + normX * 0.36) * influence + mouse.vy * 0.032 * influence;
            }
          }
        }

        // Click shockwave impulse
        if (hasShockwave) {
          const sdx = p.x - mouse.shockwaveX;
          const sdy = p.y - mouse.shockwaveY;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
          if (sDist < 280) {
            const waveForce = (1 - sDist / 280) * (1 - shockwaveAge / 650) * 2.4;
            p.vx += (sdx / sDist) * waveForce;
            p.vy += (sdy / sDist) * waveForce;
            cursorProximityBoost = Math.max(cursorProximityBoost, 1 - sDist / 280);
          }
        }

        // Speed cap for stability
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > 20) {
          const scale = 4.47 / Math.sqrt(speedSq);
          p.vx *= scale;
          p.vy *= scale;
        }

        p.x += p.vx;
        p.y += p.vy - scrollVelocity * (0.045 * p.mass);
        p.rotation += p.rotationSpeed * (1 + cursorProximityBoost * 2.5);

        // Toroidal viewport wrap
        if (p.x < -24) p.x = width + 24;
        else if (p.x > width + 24) p.x = -24;
        if (p.y < -24) p.y = height + 24;
        else if (p.y > height + 24) p.y = -24;

        // Draw synaptic constellation links to nearby stars
        ctx.globalAlpha = 1;
        for (let j = i + 1; j < stars.length; j++) {
          const p2 = stars[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const lDistSq = ldx * ldx + ldy * ldy;

          if (lDistSq < connectDistanceSq) {
            const lDist = Math.sqrt(lDistSq);
            const lineAlpha = (1 - lDist / connectDistance) * 0.18;
            ctx.strokeStyle = `rgba(${p.colorRgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw synaptic tether to cursor when within interaction radius
        if (isCursorRecent && cursorProximityBoost > 0) {
          const tetherAlpha = cursorProximityBoost * 0.38;
          ctx.strokeStyle = `rgba(${p.colorRgb}, ${tetherAlpha})`;
          ctx.lineWidth = 1.05;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Render glowing multi-chromatic celestial star (Pre-baked Star Sprite + Crisp Rotating 4-Point Vector Star)
        const twinkle = 0.72 + 0.28 * Math.sin(elapsed * p.pulseSpeed + p.phase);
        const curAlpha = Math.min(1, (p.alpha + cursorProximityBoost * 0.35) * twinkle);
        const starRadius = p.radius * (0.92 + twinkle * 0.24 + cursorProximityBoost * 0.28);

        // A. Draw pre-rendered chromatic starburst sprite halo & cross-rays (zero save/restore overhead)
        const sprite = getStarSprite(p.colorIndex);
        const spriteDrawSize = starRadius * 7.8;
        ctx.globalAlpha = curAlpha;
        ctx.drawImage(
          sprite,
          p.x - spriteDrawSize * 0.5,
          p.y - spriteDrawSize * 0.5,
          spriteDrawSize,
          spriteDrawSize
        );

        // B. Draw crisp rotating 4-pointed diamond star facet & white supernova center
        const outerStarR = starRadius * p.rayScale;
        const innerStarR = starRadius * 0.42;
        drawFastVectorStar(
          ctx,
          p.x,
          p.y,
          outerStarR,
          innerStarR,
          p.rotation,
          p.colorHex,
          curAlpha * 1.15
        );

        if (p.hasDiagonalRays || cursorProximityBoost > 0.2) {
          drawFastVectorStar(
            ctx,
            p.x,
            p.y,
            outerStarR * 0.72,
            innerStarR * 0.65,
            p.rotation + 0.785398,
            '#ffffff',
            curAlpha * 0.9
          );
        }
      }

      // 2. Update & Render Cursor Velocity & Click Burst Star-Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;

        const lifeRatio = 1 - s.life / s.maxLife;
        const sparkR = s.radius * lifeRatio;

        const sprite = getStarSprite(s.colorIndex);
        const sz = sparkR * 6.2;
        ctx.globalAlpha = lifeRatio * 0.85;
        ctx.drawImage(sprite, s.x - sz * 0.5, s.y - sz * 0.5, sz, sz);

        drawFastVectorStar(
          ctx,
          s.x,
          s.y,
          sparkR * 2.1,
          sparkR * 0.48,
          s.rotation,
          '#ffffff',
          lifeRatio * 0.95
        );
      }

      ctx.globalAlpha = 1;

      // 2B. Update & Render Autonomous Photonic Shooting Star Comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.life += 1;
        if (c.life >= c.maxLife) {
          comets.splice(i, 1);
          continue;
        }
        c.x += c.vx;
        c.y += c.vy;

        const lifeNorm = c.life / c.maxLife;
        const fade = Math.sin(lifeNorm * Math.PI);
        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy) || 1;
        const tailX = c.x - (c.vx / speed) * c.tailLen * fade;
        const tailY = c.y - (c.vy / speed) * c.tailLen * fade;

        // Luminous tapered comet tail
        const tailGrad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        tailGrad.addColorStop(0, `rgba(${c.colorRgb}, 0)`);
        tailGrad.addColorStop(0.65, `rgba(${c.colorRgb}, ${fade * 0.45})`);
        tailGrad.addColorStop(1, `rgba(255, 255, 255, ${fade * 0.96})`);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        // Glowing starburst comet head
        const sprite = getStarSprite(c.colorIndex);
        const headSize = c.radius * 9.5 * (0.7 + 0.3 * fade);
        ctx.globalAlpha = fade * 0.92;
        ctx.drawImage(sprite, c.x - headSize * 0.5, c.y - headSize * 0.5, headSize, headSize);
        ctx.globalAlpha = 1;
      }

      // 3. Expanding Click Shockwave Ring
      if (hasShockwave) {
        const progress = shockwaveAge / 650;
        const ringRadius = 12 + progress * 190;
        const ringAlpha = (1 - progress) * 0.38;
        ctx.strokeStyle = `rgba(6, 182, 212, ${ringAlpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(mouse.shockwaveX, mouse.shockwaveY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] select-none"
    />
  );
});
