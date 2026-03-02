import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  emoji?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--empowerment))',
  'hsl(var(--safe))',
  'hsl(var(--warning))',
  'hsl(340, 82%, 65%)',
  'hsl(280, 70%, 65%)',
];

const EMOJIS = ['✨', '⭐', '💥', '🔥', '💪'];

let particleId = 0;

export function useParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = useCallback((originX: number, originY: number, count = 12) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i + (Math.random() * 30 - 15);
      newParticles.push({
        id: ++particleId,
        x: originX,
        y: originY,
        angle,
        distance: 40 + Math.random() * 60,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        emoji: Math.random() > 0.7 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
      });
    }
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles((p) => p.filter((pt) => !newParticles.includes(pt)));
    }, 700);
  }, []);

  return { particles, burst };
}

export function ParticleLayer({ particles }: { particles: Particle[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;

          return p.emoji ? (
            <motion.span
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 0, opacity: 1 }}
              animate={{ x: p.x + tx, y: p.y + ty, scale: 1.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute text-sm"
              style={{ left: 0, top: 0 }}
            >
              {p.emoji}
            </motion.span>
          ) : (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 0, opacity: 1 }}
              animate={{ x: p.x + tx, y: p.y + ty, scale: 0.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size}px ${p.color}`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
