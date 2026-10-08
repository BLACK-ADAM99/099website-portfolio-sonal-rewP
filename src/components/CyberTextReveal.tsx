import React from 'react';
import { motion } from 'motion/react';

export type TextRevealEffect = 'flip3d' | 'elasticPop' | 'cyberSlide' | 'waveRise' | 'neonUnfold';

interface CyberTextRevealProps {
  text: string;
  mode?: 'chars' | 'words';
  effect?: TextRevealEffect;
  className?: string;
  charClassName?: string;
  staggerDelay?: number;
  initialDelay?: number;
  once?: boolean;
  interactiveHover?: boolean;
}

export const CyberTextReveal: React.FC<CyberTextRevealProps> = React.memo(({
  text,
  className = '',
  initialDelay = 0,
  once = true,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.12 }}
      transition={{
        duration: 0.36,
        delay: Math.min(initialDelay, 0.14),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`inline-block transform-gpu ${className}`}
    >
      {text}
    </motion.span>
  );
});
