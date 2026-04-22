"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const PARTICLE_COUNT = 40;
const COLORS = [
  "#22d3ee", // cyan-400
  "#f59e0b", // amber-500
  "#a855f7", // purple-500
  "#34d399", // emerald-400
  "#f472b6", // pink-400
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.4,
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 6,
  }));
}

interface ConfettiOverlayProps {
  show: boolean;
}

export function ConfettiOverlay({
  show,
}: ConfettiOverlayProps): React.ReactElement {
  const particles = useMemo(() => (show ? generateParticles() : []), [show]);

  return (
    <AnimatePresence>
      {show && particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 1,
                x: `${p.x}vw`,
                y: -20,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                opacity: [1, 1, 0],
                y: "100vh",
                rotate: p.rotation + 360,
                scale: [1, 1.2, 0.5],
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: p.size > 7 ? "50%" : "2px",
                backgroundColor: p.color,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
