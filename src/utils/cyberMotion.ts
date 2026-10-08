// Ultra-Smooth 60FPS GPU-Composited 3D Arrival, Section Reveal & 16-Color Chromatic Presets
// Uses strictly compositor-only properties (transform + opacity) for locked 60/120 FPS animations.

export interface ArrivalPreset {
  initial: {
    opacity: number;
    x?: number;
    y?: number;
    scale?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  };
  whileInView: {
    opacity: number;
    x: number;
    y: number;
    scale: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  transition: {
    duration: number;
    ease: [number, number, number, number];
    delay?: number;
  };
}

export interface ChromaticColorSpec {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  gradientClass: string;
}

// 16 Unique High-Contrast Cyber-Chromatic Colors used across components, cards, badges & connectors
export const CHROMATIC_16_PALETTE: ChromaticColorSpec[] = [
  {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-400/50',
    bgClass: 'bg-cyan-500/15',
    badgeClass: 'bg-cyan-950/75 text-cyan-300 border-cyan-400/45',
    gradientClass: 'from-cyan-400 to-sky-500',
  },
  {
    id: 'neon-fuchsia',
    name: 'Neon Fuchsia',
    hex: '#d946ef',
    rgb: '217, 70, 239',
    textClass: 'text-fuchsia-400',
    borderClass: 'border-fuchsia-400/50',
    bgClass: 'bg-fuchsia-500/15',
    badgeClass: 'bg-fuchsia-950/75 text-fuchsia-300 border-fuchsia-400/45',
    gradientClass: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'quantum-violet',
    name: 'Quantum Violet',
    hex: '#8b5cf6',
    rgb: '139, 92, 246',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-400/50',
    bgClass: 'bg-violet-500/15',
    badgeClass: 'bg-violet-950/75 text-violet-300 border-violet-400/45',
    gradientClass: 'from-violet-400 to-purple-500',
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    hex: '#10b981',
    rgb: '16, 185, 129',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-400/50',
    bgClass: 'bg-emerald-500/15',
    badgeClass: 'bg-emerald-950/75 text-emerald-300 border-emerald-400/45',
    gradientClass: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-400/50',
    bgClass: 'bg-amber-500/15',
    badgeClass: 'bg-amber-950/75 text-amber-300 border-amber-400/45',
    gradientClass: 'from-amber-400 to-orange-500',
  },
  {
    id: 'crimson-laser',
    name: 'Crimson Laser',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-400/50',
    bgClass: 'bg-rose-500/15',
    badgeClass: 'bg-rose-950/75 text-rose-300 border-rose-400/45',
    gradientClass: 'from-rose-400 to-red-500',
  },
  {
    id: 'cobalt-sapphire',
    name: 'Cobalt Sapphire',
    hex: '#3b82f6',
    rgb: '59, 130, 246',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-400/50',
    bgClass: 'bg-blue-500/15',
    badgeClass: 'bg-blue-950/75 text-blue-300 border-blue-400/45',
    gradientClass: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'acid-lime',
    name: 'Acid Lime',
    hex: '#84cc16',
    rgb: '132, 204, 22',
    textClass: 'text-lime-400',
    borderClass: 'border-lime-400/50',
    bgClass: 'bg-lime-500/15',
    badgeClass: 'bg-lime-950/75 text-lime-300 border-lime-400/45',
    gradientClass: 'from-lime-400 to-emerald-500',
  },
  {
    id: 'plasma-orange',
    name: 'Plasma Orange',
    hex: '#f97316',
    rgb: '249, 115, 22',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-400/50',
    bgClass: 'bg-orange-500/15',
    badgeClass: 'bg-orange-950/75 text-orange-300 border-orange-400/45',
    gradientClass: 'from-orange-400 to-rose-500',
  },
  {
    id: 'bioluminescent-teal',
    name: 'Bioluminescent Teal',
    hex: '#14b8a6',
    rgb: '20, 184, 166',
    textClass: 'text-teal-400',
    borderClass: 'border-teal-400/50',
    bgClass: 'bg-teal-500/15',
    badgeClass: 'bg-teal-950/75 text-teal-300 border-teal-400/45',
    gradientClass: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'magenta-pulse',
    name: 'Magenta Pulse',
    hex: '#ec4899',
    rgb: '236, 72, 153',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-400/50',
    bgClass: 'bg-pink-500/15',
    badgeClass: 'bg-pink-950/75 text-pink-300 border-pink-400/45',
    gradientClass: 'from-pink-400 to-fuchsia-500',
  },
  {
    id: 'indigo-starlight',
    name: 'Indigo Starlight',
    hex: '#6366f1',
    rgb: '99, 102, 241',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-400/50',
    bgClass: 'bg-indigo-500/15',
    badgeClass: 'bg-indigo-950/75 text-indigo-300 border-indigo-400/45',
    gradientClass: 'from-indigo-400 to-violet-500',
  },
  {
    id: 'supernova-gold',
    name: 'Supernova Gold',
    hex: '#eab308',
    rgb: '234, 179, 8',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-400/50',
    bgClass: 'bg-yellow-500/15',
    badgeClass: 'bg-yellow-950/75 text-yellow-300 border-yellow-400/45',
    gradientClass: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'arctic-sky',
    name: 'Arctic Sky',
    hex: '#0ea5e9',
    rgb: '14, 165, 233',
    textClass: 'text-sky-400',
    borderClass: 'border-sky-400/50',
    bgClass: 'bg-sky-500/15',
    badgeClass: 'bg-sky-950/75 text-sky-300 border-sky-400/45',
    gradientClass: 'from-sky-400 to-blue-500',
  },
  {
    id: 'ultraviolet-core',
    name: 'Ultraviolet Core',
    hex: '#a855f7',
    rgb: '168, 85, 247',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-400/50',
    bgClass: 'bg-purple-500/15',
    badgeClass: 'bg-purple-950/75 text-purple-300 border-purple-400/45',
    gradientClass: 'from-purple-400 to-fuchsia-500',
  },
  {
    id: 'scarlet-ruby',
    name: 'Scarlet Ruby',
    hex: '#ef4444',
    rgb: '239, 68, 68',
    textClass: 'text-red-400',
    borderClass: 'border-red-400/50',
    bgClass: 'bg-red-500/15',
    badgeClass: 'bg-red-950/75 text-red-300 border-red-400/45',
    gradientClass: 'from-red-400 to-orange-500',
  },
  {
    id: 'hyper-mint',
    name: 'Hyper Mint',
    hex: '#2dd4bf',
    rgb: '45, 212, 191',
    textClass: 'text-teal-300',
    borderClass: 'border-teal-300/50',
    bgClass: 'bg-teal-400/15',
    badgeClass: 'bg-teal-950/75 text-teal-200 border-teal-300/45',
    gradientClass: 'from-teal-300 to-emerald-400',
  },
  {
    id: 'flamingo-rose',
    name: 'Flamingo Rose',
    hex: '#fb7185',
    rgb: '251, 113, 133',
    textClass: 'text-rose-300',
    borderClass: 'border-rose-300/50',
    bgClass: 'bg-rose-400/15',
    badgeClass: 'bg-rose-950/75 text-rose-200 border-rose-300/45',
    gradientClass: 'from-rose-300 to-pink-500',
  },
  {
    id: 'cerulean-ice',
    name: 'Cerulean Ice',
    hex: '#38bdf8',
    rgb: '56, 189, 248',
    textClass: 'text-sky-300',
    borderClass: 'border-sky-300/50',
    bgClass: 'bg-sky-400/15',
    badgeClass: 'bg-sky-950/75 text-sky-200 border-sky-300/45',
    gradientClass: 'from-sky-300 to-cyan-400',
  },
  {
    id: 'orchid-nebula',
    name: 'Orchid Nebula',
    hex: '#c084fc',
    rgb: '192, 132, 252',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-300/50',
    bgClass: 'bg-purple-400/15',
    badgeClass: 'bg-purple-950/75 text-purple-200 border-purple-300/45',
    gradientClass: 'from-purple-300 to-fuchsia-400',
  },
  {
    id: 'jade-matrix',
    name: 'Jade Matrix',
    hex: '#4ade80',
    rgb: '74, 222, 128',
    textClass: 'text-green-400',
    borderClass: 'border-green-400/50',
    bgClass: 'bg-green-500/15',
    badgeClass: 'bg-green-950/75 text-green-300 border-green-400/45',
    gradientClass: 'from-green-400 to-emerald-500',
  },
  {
    id: 'titanium-gold',
    name: 'Titanium Gold',
    hex: '#facc15',
    rgb: '250, 204, 21',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-300/50',
    bgClass: 'bg-yellow-400/15',
    badgeClass: 'bg-yellow-950/75 text-yellow-200 border-yellow-300/45',
    gradientClass: 'from-yellow-300 to-amber-400',
  },
  {
    id: 'tangerine-flare',
    name: 'Tangerine Flare',
    hex: '#fb923c',
    rgb: '251, 146, 60',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-300/50',
    bgClass: 'bg-orange-400/15',
    badgeClass: 'bg-orange-950/75 text-orange-200 border-orange-300/45',
    gradientClass: 'from-orange-300 to-amber-500',
  },
  {
    id: 'periwinkle-nova',
    name: 'Periwinkle Nova',
    hex: '#818cf8',
    rgb: '129, 140, 248',
    textClass: 'text-indigo-300',
    borderClass: 'border-indigo-300/50',
    bgClass: 'bg-indigo-400/15',
    badgeClass: 'bg-indigo-950/75 text-indigo-200 border-indigo-300/45',
    gradientClass: 'from-indigo-300 to-blue-500',
  },
  {
    id: 'sakura-neon',
    name: 'Sakura Neon',
    hex: '#f472b6',
    rgb: '244, 114, 182',
    textClass: 'text-pink-300',
    borderClass: 'border-pink-300/50',
    bgClass: 'bg-pink-400/15',
    badgeClass: 'bg-pink-950/75 text-pink-200 border-pink-300/45',
    gradientClass: 'from-pink-300 to-rose-400',
  },
  {
    id: 'glacial-aqua',
    name: 'Glacial Aqua',
    hex: '#22d3ee',
    rgb: '34, 211, 238',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-300/50',
    bgClass: 'bg-cyan-400/15',
    badgeClass: 'bg-cyan-950/75 text-cyan-200 border-cyan-300/45',
    gradientClass: 'from-cyan-300 to-teal-400',
  },
  {
    id: 'chartreuse-volt',
    name: 'Chartreuse Volt',
    hex: '#a3e635',
    rgb: '163, 230, 53',
    textClass: 'text-lime-300',
    borderClass: 'border-lime-300/50',
    bgClass: 'bg-lime-400/15',
    badgeClass: 'bg-lime-950/75 text-lime-200 border-lime-300/45',
    gradientClass: 'from-lime-300 to-green-400',
  },
  {
    id: 'astral-heliotrope',
    name: 'Astral Heliotrope',
    hex: '#e879f9',
    rgb: '232, 121, 249',
    textClass: 'text-fuchsia-300',
    borderClass: 'border-fuchsia-300/50',
    bgClass: 'bg-fuchsia-400/15',
    badgeClass: 'bg-fuchsia-950/75 text-fuchsia-200 border-fuchsia-300/45',
    gradientClass: 'from-fuchsia-300 to-purple-500',
  },
];

export const CHROMATIC_28_PALETTE = CHROMATIC_16_PALETTE;

// 28 Distinct Silky-Smooth 3D Perspective Liquid-Spring Arrival Choreographies
const COMPLEX_ARRIVAL_DIRECTIONS = [
  // 0: Quantum Vortex Rise from Bottom-Left
  { x: -24, y: 30, scale: 0.92, rotateX: 12, rotateY: -9, rotateZ: -1.0, stiffness: 92, damping: 21 },
  // 1: Hologram Prism Unfold from Deep Center
  { x: 0, y: 34, scale: 0.91, rotateX: 14, rotateY: 0, rotateZ: 0, stiffness: 94, damping: 22 },
  // 2: Quantum Vortex Rise from Bottom-Right
  { x: 24, y: 30, scale: 0.92, rotateX: 12, rotateY: 9, rotateZ: 1.0, stiffness: 92, damping: 21 },
  // 3: Cyber Blade Sweep from Left
  { x: -32, y: 20, scale: 0.93, rotateX: 9, rotateY: -11, rotateZ: -0.8, stiffness: 96, damping: 22 },
  // 4: Cyber Blade Sweep from Right
  { x: 32, y: 20, scale: 0.93, rotateX: 9, rotateY: 11, rotateZ: 0.8, stiffness: 96, damping: 22 },
  // 5: Orbital Anti-Gravity Flip-In
  { x: 0, y: -22, scale: 0.92, rotateX: -12, rotateY: 7, rotateZ: 0.5, stiffness: 90, damping: 21 },
  // 6: Synapse Elastic Pop from Center-Left
  { x: -18, y: 26, scale: 0.9, rotateX: 11, rotateY: -7, rotateZ: -0.6, stiffness: 98, damping: 21 },
  // 7: Synapse Elastic Pop from Center-Right
  { x: 18, y: 26, scale: 0.9, rotateX: 11, rotateY: 7, rotateZ: 0.6, stiffness: 98, damping: 21 },
  // 8: Isometric Vault Flip
  { x: -20, y: -18, scale: 0.92, rotateX: -10, rotateY: -10, rotateZ: -0.9, stiffness: 92, damping: 22 },
  // 9: Plasma Wave Ascend
  { x: 12, y: 36, scale: 0.92, rotateX: 14, rotateY: 6, rotateZ: 0.5, stiffness: 88, damping: 22 },
  // 10: Tesseract Corner Lock
  { x: 28, y: -18, scale: 0.92, rotateX: -11, rotateY: 10, rotateZ: 0.9, stiffness: 94, damping: 21 },
  // 11: Quantum Tunnel Deep Zoom
  { x: 0, y: 22, scale: 0.88, rotateX: 10, rotateY: 0, rotateZ: 0, stiffness: 96, damping: 22 },
  // 12: Helix Spiral Left
  { x: -22, y: 28, scale: 0.92, rotateX: 11, rotateY: -12, rotateZ: -1.2, stiffness: 92, damping: 21 },
  // 13: Helix Spiral Right
  { x: 22, y: 28, scale: 0.92, rotateX: 11, rotateY: 12, rotateZ: 1.2, stiffness: 92, damping: 21 },
  // 14: Crystal Facet Tilt
  { x: -12, y: 30, scale: 0.92, rotateX: 12, rotateY: 8, rotateZ: -0.5, stiffness: 96, damping: 22 },
  // 15: Hyperdrive Lock-In
  { x: 12, y: 30, scale: 0.92, rotateX: 12, rotateY: -8, rotateZ: 0.5, stiffness: 96, damping: 22 },
  // 16: Supernova Radial Bloom
  { x: 0, y: 28, scale: 0.89, rotateX: 15, rotateY: -4, rotateZ: -0.4, stiffness: 95, damping: 21 },
  // 17: Cybernetic Vector Glide Left
  { x: -34, y: 14, scale: 0.92, rotateX: 8, rotateY: -13, rotateZ: -0.9, stiffness: 94, damping: 22 },
  // 18: Cybernetic Vector Glide Right
  { x: 34, y: 14, scale: 0.92, rotateX: 8, rotateY: 13, rotateZ: 0.9, stiffness: 94, damping: 22 },
  // 19: Zero-G Zenith Descent
  { x: -8, y: -24, scale: 0.91, rotateX: -14, rotateY: -6, rotateZ: -0.6, stiffness: 90, damping: 21 },
  // 20: Chromatic Wave Surge
  { x: 16, y: 32, scale: 0.91, rotateX: 13, rotateY: 9, rotateZ: 0.8, stiffness: 94, damping: 21 },
  // 21: Neural Lattice Snap
  { x: -16, y: 32, scale: 0.91, rotateX: 13, rotateY: -9, rotateZ: -0.8, stiffness: 94, damping: 21 },
  // 22: Starlight Orbital Arc Left
  { x: -26, y: -14, scale: 0.92, rotateX: -9, rotateY: -11, rotateZ: -0.8, stiffness: 92, damping: 22 },
  // 23: Starlight Orbital Arc Right
  { x: 26, y: -14, scale: 0.92, rotateX: -9, rotateY: 11, rotateZ: 0.8, stiffness: 92, damping: 22 },
  // 24: Sub-Space Folding Entry
  { x: 0, y: 24, scale: 0.88, rotateX: 16, rotateY: 0, rotateZ: 0, stiffness: 98, damping: 21 },
  // 25: Velocity Shear Left
  { x: -28, y: 22, scale: 0.92, rotateX: 11, rotateY: -10, rotateZ: -1.1, stiffness: 94, damping: 21 },
  // 26: Velocity Shear Right
  { x: 28, y: 22, scale: 0.92, rotateX: 11, rotateY: 10, rotateZ: 1.1, stiffness: 94, damping: 21 },
  // 27: Apex Crown Lock
  { x: 0, y: -20, scale: 0.92, rotateX: -12, rotateY: 0, rotateZ: 0, stiffness: 96, damping: 21 },
];

export const getTopLevelArrival = (
  index: number = 0,
  staggerStep: number = 0.032
): ArrivalPreset => {
  const dir = COMPLEX_ARRIVAL_DIRECTIONS[Math.abs(index) % COMPLEX_ARRIVAL_DIRECTIONS.length];
  return {
    initial: {
      opacity: 0,
      x: dir.x * 0.45,
      y: dir.y * 0.55,
      scale: Math.max(0.95, dir.scale),
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    },
    whileInView: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    },
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      delay: Math.min(index * staggerStep, 0.14),
    },
  };
};

export const getUltraLevelArrival = (
  index: number = 0,
  staggerStep: number = 0.032
): ArrivalPreset => {
  return getTopLevelArrival(index, staggerStep);
};

// Outer section container stays immediately composited while ScrollSlideUpReveal and child cards handle smooth arrival
export const SECTION_REVEAL = {
  initial: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  viewport: {
    once: true,
    amount: 0.04,
  },
  transition: {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export const HEADER_ARRIVAL = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    rotateX: 0,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
  },
  transition: {
    duration: 0.38,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};
