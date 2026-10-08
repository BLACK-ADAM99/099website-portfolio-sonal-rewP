import React, { useEffect, useState, useRef } from 'react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CyberCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailingPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animationId: number | null = null;
    let lastTime = performance.now();

    const animateTrail = (now: number) => {
      const dtMs = Math.max(1, Math.min(64, now - lastTime));
      lastTime = now;
      const lerpFactor = 1 - Math.pow(1 - 0.25, dtMs / 16.6667);

      const offset = isHoveringRef.current ? 22 : 14;
      const dx = mousePos.current.x - trailingPos.current.x;
      const dy = mousePos.current.y - trailingPos.current.y;

      trailingPos.current.x += dx * lerpFactor;
      trailingPos.current.y += dy * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x - offset}px, ${
          trailingPos.current.y - offset
        }px, 0)`;
      }

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animationId = requestAnimationFrame(animateTrail);
      } else {
        animationId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        trailingPos.current.x = e.clientX;
        trailingPos.current.y = e.clientY;
        setIsVisible(true);
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      if (animationId === null) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animateTrail);
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          'button, a, input, textarea, [role="button"], .cursor-pointer'
        );
        if (isClickable !== isHoveringRef.current) {
          isHoveringRef.current = isClickable;
          setIsHovering(isClickable);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    if (ripples.length === 0) return;
    const timeout = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timeout);
  }, [ripples]);

  if (!isVisible) return null;

  return (
    <>
      {/* Click Shockwave Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="fixed pointer-events-none z-[9997] w-12 h-12 rounded-full border border-fuchsia-400/80 animate-ping shadow-[0_0_15px_#ec4899]"
        />
      ))}

      {/* Ultra Precise Laser Point */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] will-change-transform ${
          isClicking
            ? 'scale-150 bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
            : 'bg-fuchsia-400 shadow-[0_0_8px_#ec4899]'
        }`}
      />

      {/* Trailing Cyber Crosshair Reticle Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] will-change-transform transition-all duration-150 ease-out flex items-center justify-center ${
          isHovering
            ? 'w-11 h-11 border-2 border-fuchsia-400/90 bg-fuchsia-500/15 shadow-[0_0_20px_rgba(217,70,239,0.5)] rotate-45 scale-110'
            : isClicking
            ? 'w-8 h-8 border border-cyan-400 bg-cyan-500/20 scale-90'
            : 'w-7 h-7 border border-cyan-400/70 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
        }`}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-cyan-300" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-cyan-300" />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-cyan-300" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-cyan-300" />
      </div>
    </>
  );
};
