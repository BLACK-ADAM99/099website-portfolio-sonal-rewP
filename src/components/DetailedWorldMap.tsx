import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Wifi, 
  Navigation2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X, 
  Radio, 
  Crosshair, 
  Activity,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';
import cyberWorldMapImg from '../assets/images/cyber_world_map_detailed_1790519133621.jpg';

interface CityNode {
  id: string;
  name: string;
  country: string;
  lat: string;
  lon: string;
  xPct: number; // Percentage X on map
  yPct: number; // Percentage Y on map
  type: 'hq' | 'hub';
  role: string;
}

export const DetailedWorldMap: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'matrix' | 'satellite'>('matrix');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<CityNode | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRectRef = useRef<DOMRect | null>(null);
  const coordsSpanRef = useRef<HTMLSpanElement>(null);
  const pingSpanRef = useRef<HTMLSpanElement>(null);

  // Exact User Coordinates (100% English):
  // Decimal: 22.4329° N, 87.8599° E
  // DMS: 22° 25' 58" N, 87° 51' 35" E
  const EXACT_LAT = 22.4329;
  const EXACT_LON = 87.8599;
  const EXACT_DEC_LABEL = '22.4329° N, 87.8599° E';
  const EXACT_DMS_EN_LABEL = '22° 25\' 58" N, 87° 51\' 35" E';
  const EXACT_X_PCT = 71.68;
  const EXACT_Y_PCT = 44.63;

  // Dynamic Ping Telemetry Jitter via direct DOM ref update (zero React re-renders)
  useEffect(() => {
    const pingTimer = setInterval(() => {
      if (pingSpanRef.current) {
        pingSpanRef.current.textContent = `PING: ${Math.floor(Math.random() * 4) + 11}ms`;
      }
    }, 2800);
    return () => clearInterval(pingTimer);
  }, []);

  // Real world global nodes anchored at exact coordinates 22.4329° N, 87.8599° E (West Bengal, Kolkata / Kolaghat)
  const globalNodes: CityNode[] = [
    {
      id: 'kolkata',
      name: 'KOLAGHAT / KOLKATA (HQ)',
      country: 'West Bengal, India',
      lat: '22.4329° N',
      lon: '87.8599° E',
      xPct: EXACT_X_PCT,
      yPct: EXACT_Y_PCT,
      type: 'hq',
      role: 'PRIMARY AI & QUANT HEADQUARTERS',
    },
    {
      id: 'silicon-valley',
      name: 'SILICON VALLEY',
      country: 'United States',
      lat: '37.3861° N',
      lon: '122.0839° W',
      xPct: 16.5,
      yPct: 35.5,
      type: 'hub',
      role: 'AI & ENTERPRISE COMPUTE',
    },
    {
      id: 'new-york',
      name: 'NEW YORK',
      country: 'United States',
      lat: '40.7128° N',
      lon: '74.0060° W',
      xPct: 28.2,
      yPct: 33.2,
      type: 'hub',
      role: 'ALGORITHMIC CAPITAL & WALL ST',
    },
    {
      id: 'sao-paulo',
      name: 'SAO PAULO',
      country: 'Brazil',
      lat: '23.5505° S',
      lon: '46.6333° W',
      xPct: 35.2,
      yPct: 71.5,
      type: 'hub',
      role: 'LATAM FINTECH GATEWAY',
    },
    {
      id: 'london',
      name: 'LONDON',
      country: 'United Kingdom',
      lat: '51.5074° N',
      lon: '0.1278° W',
      xPct: 48.5,
      yPct: 25.8,
      type: 'hub',
      role: 'GLOBAL FOREX LIQUIDITY',
    },
    {
      id: 'frankfurt',
      name: 'FRANKFURT',
      country: 'Germany',
      lat: '50.1109° N',
      lon: '8.6821° E',
      xPct: 52.2,
      yPct: 27.2,
      type: 'hub',
      role: 'CLOUD & DATA INTERCONNECT',
    },
    {
      id: 'dubai',
      name: 'DUBAI',
      country: 'United Arab Emirates',
      lat: '25.2048° N',
      lon: '55.2708° E',
      xPct: 63.0,
      yPct: 43.2,
      type: 'hub',
      role: 'MIDDLE EAST COMMERCE UPLINK',
    },
    {
      id: 'singapore',
      name: 'SINGAPORE',
      country: 'Singapore',
      lat: '1.3521° N',
      lon: '103.8198° E',
      xPct: 76.2,
      yPct: 57.8,
      type: 'hub',
      role: 'ASIA-PAC QUANTITATIVE GATEWAY',
    },
    {
      id: 'tokyo',
      name: 'TOKYO',
      country: 'Japan',
      lat: '35.6762° N',
      lon: '139.6503° E',
      xPct: 85.5,
      yPct: 36.0,
      type: 'hub',
      role: 'ROBOTICS & SPATIAL COMPUTE LAB',
    },
    {
      id: 'sydney',
      name: 'SYDNEY',
      country: 'Australia',
      lat: '33.8688° S',
      lon: '151.2093° E',
      xPct: 88.2,
      yPct: 75.5,
      type: 'hub',
      role: 'OCEANIC TELEMETRY NODE',
    },
  ];

  const continentLabels = [
    { name: 'NORTH AMERICA', x: 20, y: 24 },
    { name: 'SOUTH AMERICA', x: 33, y: 64 },
    { name: 'EUROPE', x: 51, y: 19 },
    { name: 'AFRICA', x: 52, y: 54 },
    { name: 'ASIA', x: 73, y: 27 },
    { name: 'AUSTRALIA', x: 84, y: 69 },
  ];

  const handleMouseEnterMap = () => {
    if (mapContainerRef.current) {
      mapRectRef.current = mapContainerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseLeaveMap = () => {
    mapRectRef.current = null;
    if (coordsSpanRef.current) {
      coordsSpanRef.current.textContent = EXACT_DEC_LABEL;
    }
  };

  // Track live mouse position calibrated to the map projection so hovering HQ reads 22.4329° N, 87.8599° E
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapRectRef.current || (mapRectRef.current = mapContainerRef.current.getBoundingClientRect());
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width))) * 100;
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height))) * 100;

    const lonNum = Math.max(-180, Math.min(180, (xPct - 49.2) / 0.2559));
    const latNum = Math.max(-85, Math.min(85, (58.85 - yPct) / 0.634));

    const latStr = `${Math.abs(latNum).toFixed(4)}° ${latNum >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(lonNum).toFixed(4)}° ${lonNum >= 0 ? 'E' : 'W'}`;

    if (coordsSpanRef.current) {
      coordsSpanRef.current.textContent = `${latStr}, ${lonStr}`;
    }
  };

  const handleZoomIn = () => {
    cyberSound.playClick();
    setZoomLevel(prev => Math.min(Number((prev + 0.35).toFixed(2)), 2.4));
  };

  const handleZoomOut = () => {
    cyberSound.playClick();
    setZoomLevel(prev => Math.max(Number((prev - 0.35).toFixed(2)), 1));
  };

  const handleResetWorldView = () => {
    cyberSound.playClick();
    setZoomLevel(1);
    setViewMode('matrix');
  };

  useEffect(() => {
    if (!isExpanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cyberSound.playClick();
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const kolkataHq = globalNodes.find(n => n.id === 'kolkata')!;
  const hqSvgX = (kolkataHq.xPct / 100) * 1000;
  const hqSvgY = (kolkataHq.yPct / 100) * 562.5;

  return (
    <>
      {/* Main Map Box Component with continuous ambient glow */}
      <div className="relative w-full rounded-2xl bg-[#08031a]/88 backdrop-blur-md border border-purple-500/50 p-3.5 sm:p-5 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col justify-between group overflow-hidden">
        
        {/* Top HUD Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/50 pb-2.5 mb-2.5 font-mono text-[10px]">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Globe className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
            <span className="tracking-wider">GLOBAL TELEMETRY MAP • WHOLE WORLD VIEW</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Switch between Global World Map & Satellite View */}
            <button
              type="button"
              onClick={() => {
                cyberSound.playClick();
                setViewMode(prev => (prev === 'matrix' ? 'satellite' : 'matrix'));
              }}
              className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-400/60 text-[9px] font-bold text-cyan-200 transition-colors cursor-pointer"
              title="Toggle between Whole World Map and Satellite Map"
            >
              {viewMode === 'matrix' ? 'SATELLITE VIEW' : 'WORLD MAP VIEW'}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-700/50 text-[9px] text-fuchsia-300">
              <Crosshair className="w-2.5 h-2.5 text-fuchsia-400 animate-spin-slow" />
              <span ref={coordsSpanRef}>{EXACT_DEC_LABEL}</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#10b981]" />
              <span ref={pingSpanRef} className="text-[9px]">PING: 12ms</span>
            </div>
          </div>
        </div>

        {/* Map Viewport with Full World Visibility & Smooth Zoom */}
        <div 
          ref={mapContainerRef}
          onMouseEnter={handleMouseEnterMap}
          onMouseLeave={handleMouseLeaveMap}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/9] min-h-[285px] sm:min-h-[325px] rounded-xl overflow-hidden bg-[#040210] border border-cyan-500/35 select-none cursor-crosshair"
        >
          {viewMode === 'satellite' ? (
            /* Satellite & Hybrid World/Location Map in 100% English (hl=en) */
            <div className="relative w-full h-full">
              <iframe
                title="Global Satellite Map - 22.4329° N, 87.8599° E (West Bengal, India)"
                src={`https://maps.google.com/maps?q=${EXACT_LAT},${EXACT_LON}&ll=${EXACT_LAT},${EXACT_LON}&z=4&t=h&hl=en&output=embed`}
                className="w-full h-full border-0 filter contrast-[1.08] saturate-[1.15]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Cyber Target Reticle Overlay on Exact Coordinate Center */}
              <div className="pointer-events-none absolute inset-0 border-2 border-cyan-400/30 rounded-xl shadow-[inset_0_0_40px_rgba(6,182,212,0.25)]" />
              <div className="pointer-events-none absolute top-2.5 left-2.5 z-20 px-2.5 py-1.5 rounded-lg bg-[#08031a]/92 border border-fuchsia-500/70 backdrop-blur-md font-mono text-[9px] space-y-0.5 shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                <div className="text-fuchsia-300 font-bold flex items-center gap-1">
                  <Navigation2 className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-pulse" />
                  <span>EXACT GPS LOCK: {EXACT_DEC_LABEL}</span>
                </div>
                <div className="text-emerald-300 font-semibold">{EXACT_DMS_EN_LABEL}</div>
                <div className="text-slate-300">Kolaghat, Purba Medinipur • West Bengal, India</div>
              </div>
            </div>
          ) : (
            /* Full-World Layer (zoomLevel = 1 shows 100% of the world from Americas to Australia) */
            <div 
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: zoomLevel > 1 ? `${EXACT_X_PCT}% ${EXACT_Y_PCT}%` : '50% 50%',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-full h-full"
            >
              {/* Full World Geography Image fitted completely inside the frame */}
              <img
                src={cyberWorldMapImg}
                alt="Complete World Map showing all continents and global network hubs in English"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-fill object-center filter contrast-[1.16] brightness-[1.08] saturate-[1.15]"
                referrerPolicy="no-referrer"
              />

              {/* Tactical Latitude/Longitude Equator & Tropic Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

              {/* Equator & Prime Meridian Reference Lines */}
              <div className="absolute left-0 right-0 top-[56%] h-[1px] border-t border-dashed border-cyan-400/25 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-[49.2%] w-[1px] border-l border-dashed border-cyan-400/25 pointer-events-none" />

              {/* Exact Latitude (22.4329° N) & Longitude (87.8599° E) Laser Crosshair Lines */}
              <div
                style={{ top: `${EXACT_Y_PCT}%` }}
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
              />
              <div
                style={{ left: `${EXACT_X_PCT}%` }}
                className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-fuchsia-400/50 to-transparent pointer-events-none"
              />

              {/* Subtle Rotating 360-Degree Radar Scanner Beam */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden opacity-45">
                <div className="w-[160%] h-[160%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_285deg,rgba(217,70,239,0.08)_330deg,rgba(6,182,212,0.32)_360deg)] animate-[spin_6s_linear_infinite]" />
              </div>

              {/* Continent Labels in Crisp English across the World Map */}
              {continentLabels.map((cont) => (
                <div
                  key={cont.name}
                  style={{ left: `${cont.x}%`, top: `${cont.y}%`, transform: 'translate(-50%, -50%)' }}
                  className="absolute z-10 pointer-events-none select-none"
                >
                  <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold tracking-[0.2em] text-cyan-200/45 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] whitespace-nowrap">
                    {cont.name}
                  </span>
                </div>
              ))}

              {/* SVG Overlay: Global Geodesic Arcs radiating across the Whole World from India HQ */}
              <svg 
                viewBox="0 0 1000 562.5" 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="transmissionArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
                  </linearGradient>
                  <radialGradient id="westBengalGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="55%" stopColor="#ec4899" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Glowing Tactical Highlight over West Bengal, India (22.4329° N, 87.8599° E) */}
                <g>
                  <circle
                    cx={hqSvgX}
                    cy={hqSvgY}
                    r="22"
                    fill="url(#westBengalGlow)"
                  />
                  <circle
                    cx={hqSvgX}
                    cy={hqSvgY}
                    r="10"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                </g>

                {/* Render dynamic flight/transmission arcs from India HQ to all global hub nodes */}
                {globalNodes.filter(n => n.id !== 'kolkata').map((hub) => {
                  const startX = hqSvgX;
                  const startY = hqSvgY;
                  const endX = (hub.xPct / 100) * 1000;
                  const endY = (hub.yPct / 100) * 562.5;

                  // Midpoint calculation for curvature
                  const midX = (startX + endX) / 2;
                  const midY = Math.max(28, Math.min(startY, endY) - Math.abs(startX - endX) * 0.16);
                  const pathD = `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;

                  return (
                    <g key={hub.id}>
                      {/* Glowing Arc Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="url(#transmissionArc)"
                        strokeWidth="1.35"
                        strokeDasharray="4 4"
                        className="opacity-75"
                      />

                      {/* Animated Traveling Quantum Photon */}
                      <circle r="3" fill="#22d3ee" className="shadow-[0_0_12px_#06b6d4]">
                        <animateMotion
                          path={pathD}
                          dur={`${2.2 + (Math.abs(startX - endX) / 260)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* City Nodes Markers Overlay with Visible English Labels */}
              {globalNodes.map((node) => {
                const isHq = node.type === 'hq';
                const isHovered = hoveredNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.xPct}%`,
                      top: `${node.yPct}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-20 cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredNode(node);
                      cyberSound.playHover();
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {isHq ? (
                      /* Primary HQ: West Bengal, India (22.4329° N, 87.8599° E) */
                      <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-5 rounded-full bg-fuchsia-500/35 animate-ping pointer-events-none" />
                        <div className="absolute -inset-3 rounded-full bg-cyan-400/40 animate-pulse pointer-events-none" />
                        <div className="absolute -inset-4 rounded-full border border-dashed border-fuchsia-400/90 animate-spin-slow pointer-events-none" />

                        <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 p-0.5 shadow-[0_0_22px_#ec4899] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
                        </div>

                        {/* Sleek Non-Obstructing English Callout Pill */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#09041e]/92 border border-fuchsia-400/80 shadow-[0_0_18px_rgba(217,70,239,0.5)] backdrop-blur-md pointer-events-none z-30 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[8px] font-mono font-bold text-fuchsia-300">
                            <Navigation2 className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />
                            <span>INDIA HQ • KOLAGHAT</span>
                          </div>
                          {isHovered && (
                            <div className="pt-0.5 mt-0.5 border-t border-purple-700/60 text-[7.5px] font-mono text-cyan-200 space-y-0.5">
                              <div>{EXACT_DEC_LABEL}</div>
                              <div className="text-emerald-300">{EXACT_DMS_EN_LABEL}</div>
                              <div className="text-slate-300">West Bengal, India [IN]</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Global Hub Points with Visible English City Labels */
                      <div className="relative group/pin flex flex-col items-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 border border-white block shadow-[0_0_10px_#06b6d4] group-hover/pin:scale-125 transition-transform" />
                        <span className="mt-0.5 px-1 py-[1px] rounded bg-[#050312]/80 border border-cyan-500/30 text-[7px] font-mono font-bold text-cyan-200/95 whitespace-nowrap pointer-events-none shadow-sm">
                          {node.name}
                        </span>

                        {/* Detailed English Tooltip on Hover */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover/pin:block w-40 p-1.5 rounded-md bg-[#09031d]/95 border border-cyan-400/70 text-[8.5px] font-mono text-cyan-200 shadow-[0_0_18px_rgba(6,182,212,0.45)] backdrop-blur-md z-30 whitespace-nowrap text-center">
                          <div className="font-bold text-white">{node.name} • {node.country}</div>
                          <div className="text-slate-300">{node.lat}, {node.lon}</div>
                          <div className="text-fuchsia-300 text-[7.5px] font-semibold">{node.role}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Map Controls Island (1X World Reset, Zoom In, Zoom Out, Fullscreen 100000x Expand) */}
          <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1 p-1 rounded-lg bg-[#070216]/90 border border-purple-500/45 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            {viewMode === 'matrix' && (
              <>
                <button
                  type="button"
                  onClick={handleResetWorldView}
                  className={`px-1.5 py-1 rounded text-[8.5px] font-mono font-bold transition-colors cursor-pointer ${
                    zoomLevel === 1
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50'
                      : 'text-slate-300 hover:text-white hover:bg-purple-900/40'
                  }`}
                  title="Show Whole World (1x Zoom)"
                >
                  WORLD 1X
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-purple-300" />
                </button>
                <div className="w-[1px] h-3.5 bg-purple-700/50 mx-0.5" />
              </>
            )}
            <button
              type="button"
              onClick={() => {
                cyberSound.playClick();
                setIsExpanded(true);
              }}
              className="p-1 rounded text-fuchsia-300 hover:text-white hover:bg-fuchsia-900/40 transition-colors flex items-center gap-1 text-[9px] font-mono font-bold cursor-pointer"
              title="Expand Fullscreen World Map"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FULL MAP</span>
            </button>
          </div>

          {/* Left Bottom Exact English DMS Coordinate Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#070216]/90 border border-cyan-500/45 text-[8.5px] font-mono text-cyan-200 backdrop-blur-sm pointer-events-none shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping" />
            <span>HQ: {EXACT_DMS_EN_LABEL}</span>
          </div>

        </div>

        {/* Bottom HUD Bar (100% English) */}
        <div className="mt-2.5 pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
            <span className="text-slate-200 font-bold">{EXACT_DEC_LABEL}</span>
            <span className="text-emerald-300 hidden md:inline">({EXACT_DMS_EN_LABEL})</span>
          </div>
          <div className="text-cyan-400 font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>KOLAGHAT, WEST BENGAL, INDIA HQ</span>
          </div>
        </div>

      </div>

      {/* Fullscreen World Map Modal (100% English) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-6xl max-h-[92vh] rounded-2xl bg-[#070217] border border-fuchsia-500/50 p-4 sm:p-6 shadow-[0_0_60px_rgba(217,70,239,0.35)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-fuchsia-400">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-tech text-white uppercase tracking-wider">
                      GLOBAL WORLD MAP MATRIX // {EXACT_DEC_LABEL} ({EXACT_DMS_EN_LABEL})
                    </h3>
                    <p className="text-[10px] font-mono text-purple-300">
                      Kolaghat, Purba Medinipur, West Bengal, India &bull; 10 Active Global Network Gateways
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expansive Full World Map View */}
              <div className="relative w-full flex-1 rounded-xl overflow-hidden border border-purple-900/40 min-h-[420px]">
                <img
                  src={cyberWorldMapImg}
                  alt="Full Real World Map in English"
                  className="w-full h-full object-fill object-center filter contrast-125 brightness-105"
                  referrerPolicy="no-referrer"
                />

                {/* Continent Labels in Fullscreen */}
                {continentLabels.map((cont) => (
                  <div
                    key={cont.name}
                    style={{ left: `${cont.x}%`, top: `${cont.y}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute z-10 pointer-events-none select-none"
                  >
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-200/50 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] whitespace-nowrap">
                      {cont.name}
                    </span>
                  </div>
                ))}

                {/* Laser scanline in expanded view */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] pointer-events-none animate-scanline z-10" />

                {/* Exact 22.4329° N, 87.8599° E Target in Fullscreen */}
                <div 
                  className="absolute z-20"
                  style={{ left: `${kolkataHq.xPct}%`, top: `${kolkataHq.yPct}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-fuchsia-500/40 animate-ping absolute" />
                    <div className="w-4 h-4 rounded-full bg-cyan-400/50 animate-pulse absolute" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff] relative z-10" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black/90 border border-fuchsia-500/80 text-[10px] font-mono text-fuchsia-300 whitespace-nowrap shadow-[0_0_12px_rgba(217,70,239,0.5)] text-center">
                      <div>WEST BENGAL, INDIA (HQ) &bull; {EXACT_DEC_LABEL}</div>
                      <div className="text-emerald-300 text-[9px]">{EXACT_DMS_EN_LABEL}</div>
                    </div>
                  </div>
                </div>

                {/* Other Major Global Hubs in Fullscreen */}
                {globalNodes.filter(n => n.id !== 'kolkata').map(node => (
                  <div
                    key={node.id}
                    style={{ left: `${node.xPct}%`, top: `${node.yPct}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute z-20"
                  >
                    <div className="relative group/pin">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white block shadow-[0_0_10px_#06b6d4]" />
                      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/85 border border-cyan-500/60 text-[9px] font-mono text-cyan-200 whitespace-nowrap">
                        {node.name} ({node.country})
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-3 pt-2.5 border-t border-purple-900/40 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-purple-300">
                  Total Active Global Transmission Gateways: 10 Nodes (All Continents Connected)
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-white font-semibold transition-colors text-xs"
                >
                  Close Map
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
