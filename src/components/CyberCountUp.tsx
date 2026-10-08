import React, { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface CyberCountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

export const CyberCountUp: React.FC<CyberCountUpProps> = React.memo(({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  durationMs = 1250,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView) return;

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = value * eased;

      if (ref.current) {
        ref.current.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (ref.current) {
        ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, durationMs, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
});
