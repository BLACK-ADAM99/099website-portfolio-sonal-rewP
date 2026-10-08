import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCyberTheme } from '../context/ThemeContext';

/**
 * Procedurally generates a glowing 4-pointed star flare texture with
 * a super-bright white core, radial gradient aura, and diamond starburst rays.
 */
const createGlowingStarTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.Texture();
  }

  const cx = 64;
  const cy = 64;

  // 1. Ethereal outer atmospheric glow
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
  outerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  outerGlow.addColorStop(0.12, 'rgba(240, 250, 255, 0.9)');
  outerGlow.addColorStop(0.35, 'rgba(200, 235, 255, 0.45)');
  outerGlow.addColorStop(0.65, 'rgba(150, 200, 255, 0.12)');
  outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outerGlow;
  ctx.fillRect(0, 0, 128, 128);

  ctx.save();
  ctx.translate(cx, cy);

  // 2. Primary 4-pointed cross starburst rays (horizontal & vertical)
  // Horizontal beam
  const hRay = ctx.createLinearGradient(-60, 0, 60, 0);
  hRay.addColorStop(0, 'rgba(255, 255, 255, 0)');
  hRay.addColorStop(0.25, 'rgba(255, 255, 255, 0.4)');
  hRay.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  hRay.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
  hRay.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = hRay;
  ctx.beginPath();
  ctx.ellipse(0, 0, 58, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vertical beam
  const vRay = ctx.createLinearGradient(0, -60, 0, 60);
  vRay.addColorStop(0, 'rgba(255, 255, 255, 0)');
  vRay.addColorStop(0.25, 'rgba(255, 255, 255, 0.4)');
  vRay.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  vRay.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
  vRay.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = vRay;
  ctx.beginPath();
  ctx.ellipse(0, 0, 2.8, 58, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Secondary 45-degree diamond micro-flares
  ctx.rotate(Math.PI / 4);
  const dRay1 = ctx.createLinearGradient(-32, 0, 32, 0);
  dRay1.addColorStop(0, 'rgba(255, 255, 255, 0)');
  dRay1.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
  dRay1.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = dRay1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  const dRay2 = ctx.createLinearGradient(0, -32, 0, 32);
  dRay2.addColorStop(0, 'rgba(255, 255, 255, 0)');
  dRay2.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
  dRay2.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = dRay2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.8, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Supernova White Center Core
  const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
  coreGlow.addColorStop(0, '#ffffff');
  coreGlow.addColorStop(0.4, 'rgba(255, 255, 255, 0.95)');
  coreGlow.addColorStop(0.8, 'rgba(220, 240, 255, 0.5)');
  coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

export const CyberParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useCyberTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup with Atmospheric Deep Void Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030108, 0.0022);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 32;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.display = 'block';

    container.appendChild(renderer.domElement);

    // 2. Dynamic Colors based on Active Cyber Theme
    let hexColor1 = 0x06b6d4; // Electric Cyan
    let hexColor2 = 0xec4899; // Neon Fuchsia

    if (theme === 'quant') {
      hexColor1 = 0x10b981; // Matrix Toxic Emerald
      hexColor2 = 0x06b6d4; // Cyan
    } else if (theme === 'gold') {
      hexColor1 = 0xf59e0b; // Amber 24K Gold
      hexColor2 = 0xfbbf24; // Warm Yellow Starlight
    } else if (theme === 'stealth') {
      hexColor1 = 0xffffff; // Diamond Ice White
      hexColor2 = 0x38bdf8; // Sky Blue
    }

    const color1 = new THREE.Color(hexColor1);
    const color2 = new THREE.Color(hexColor2);
    const whiteColor = new THREE.Color(0xffffff);

    // 3. Glowing Star Texture
    const starTexture = createGlowingStarTexture();

    // 4. Star Field Particles Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1600;
    const posArray = new Float32Array(particlesCount * 3);
    const originalY = new Float32Array(particlesCount);
    const colorsArray = new Float32Array(particlesCount * 3);
    const baseColors = new Float32Array(particlesCount * 3);
    const twinkleSpeeds = new Float32Array(particlesCount);
    const twinklePhases = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // Spread stars across deep 3D spatial void
      posArray[i3] = (Math.random() - 0.5) * 65;     // x
      posArray[i3 + 1] = (Math.random() - 0.5) * 65; // y
      posArray[i3 + 2] = (Math.random() - 0.5) * 65; // z

      originalY[i] = posArray[i3 + 1];

      // Star Color blend: majority cyan/fuchsia with pure diamond white stars sprinkled in
      const isPureStar = Math.random() < 0.22;
      let mixedColor = color1.clone().lerp(color2, Math.random());
      if (isPureStar) {
        mixedColor = mixedColor.lerp(whiteColor, 0.75);
      }

      colorsArray[i3] = mixedColor.r;
      colorsArray[i3 + 1] = mixedColor.g;
      colorsArray[i3 + 2] = mixedColor.b;

      baseColors[i3] = mixedColor.r;
      baseColors[i3 + 1] = mixedColor.g;
      baseColors[i3 + 2] = mixedColor.b;

      twinkleSpeeds[i] = 1.2 + Math.random() * 2.8;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // PointsMaterial configured for celestial starfield
    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.15,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 5. Constellation Mode Line Connections (Neural Star Network)
    // Pre-allocate buffer for high-performance 60FPS dynamic connections
    const maxConnections = 650;
    const constellationNodesCount = 180; // Focus on primary star cluster for optimal 60fps
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // 6. Interactive Mouse Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Scroll Elevation & Velocity Physics
    let scrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 8. Responsive Viewport Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 9. Cosmic Render Loop with Constellation Neural Network & Star Twinkling
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.045;
      currentMouseY += (targetMouseY - currentMouseY) * 0.045;

      // Smooth velocity decay
      scrollVelocity *= 0.92;

      // Cosmic orbital rotation synchronized for stars and constellation mesh
      const rotY = elapsedTime * 0.03 + currentMouseX * 0.16;
      const rotX = currentMouseY * 0.14;
      const posY = -scrollY * 0.006;

      particlesMesh.rotation.y = rotY;
      particlesMesh.rotation.x = rotX;
      particlesMesh.position.y = posY;

      linesMesh.rotation.y = rotY;
      linesMesh.rotation.x = rotX;
      linesMesh.position.y = posY;

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const colors = particlesGeometry.attributes.color.array as Float32Array;

      // Organic celestial sine-wave undulation & twinkling pulse
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Gentle wave floating through space
        positions[i3 + 1] = originalY[i] + Math.sin(elapsedTime * 1.1 + positions[i3] * 0.22) * 0.65;

        // Individual star twinkling intensity
        const twinkle = 0.72 + 0.35 * Math.sin(elapsedTime * twinkleSpeeds[i] + twinklePhases[i]);
        colors[i3] = baseColors[i3] * twinkle;
        colors[i3 + 1] = baseColors[i3 + 1] * twinkle;
        colors[i3 + 2] = baseColors[i3 + 2] * twinkle;
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.color.needsUpdate = true;

      // ==========================================
      // CONSTELLATION MODE: Dynamic Star Connections
      // ==========================================
      // Distance threshold subtly morphs based on scroll position and cosmic sine wave
      const scrollModulation = Math.sin(scrollY * 0.0035 + elapsedTime * 0.45);
      const baseDistanceThreshold = 6.4;
      const dynamicThreshold = baseDistanceThreshold + scrollModulation * 1.7;
      const thresholdSq = dynamicThreshold * dynamicThreshold;

      // Periodic activation cycle: pulses every ~6.5 seconds with organic neural breathing
      const periodicCycle = (Math.sin(elapsedTime * 0.95) + 1) * 0.5; // 0 to 1
      const pulseIntensity = 0.28 + 0.72 * Math.pow(periodicCycle, 1.4);

      // Scroll speed dynamically energizes line connections
      const scrollBoost = Math.min(0.4, Math.abs(scrollVelocity) * 0.04);
      const constellationAlpha = Math.min(1.0, pulseIntensity + scrollBoost);

      let connectionCount = 0;
      let linePosIdx = 0;
      let lineColIdx = 0;

      for (let i = 0; i < constellationNodesCount; i++) {
        const i3 = i * 3;
        const x1 = positions[i3];
        const y1 = positions[i3 + 1];
        const z1 = positions[i3 + 2];

        for (let j = i + 1; j < constellationNodesCount; j++) {
          const j3 = j * 3;
          const dx = x1 - positions[j3];
          const dy = y1 - positions[j3 + 1];
          const dz = z1 - positions[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < thresholdSq) {
            const dist = Math.sqrt(distSq);
            // Alpha falls off towards maximum threshold, multiplied by periodic pulse
            const edgeAlpha = (1.0 - dist / dynamicThreshold) * constellationAlpha * 0.75;

            // Point A
            linePositions[linePosIdx++] = x1;
            linePositions[linePosIdx++] = y1;
            linePositions[linePosIdx++] = z1;

            lineColors[lineColIdx++] = colors[i3] * edgeAlpha;
            lineColors[lineColIdx++] = colors[i3 + 1] * edgeAlpha;
            lineColors[lineColIdx++] = colors[i3 + 2] * edgeAlpha;

            // Point B
            linePositions[linePosIdx++] = positions[j3];
            linePositions[linePosIdx++] = positions[j3 + 1];
            linePositions[linePosIdx++] = positions[j3 + 2];

            lineColors[lineColIdx++] = colors[j3] * edgeAlpha;
            lineColors[lineColIdx++] = colors[j3 + 1] * edgeAlpha;
            lineColors[lineColIdx++] = colors[j3 + 2] * edgeAlpha;

            connectionCount++;
            if (connectionCount >= maxConnections) {
              break;
            }
          }
        }
        if (connectionCount >= maxConnections) {
          break;
        }
      }

      linesGeometry.setDrawRange(0, connectionCount * 2);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Thorough Memory Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      starTexture.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 transition-opacity duration-700" 
      aria-hidden="true" 
    />
  );
};
