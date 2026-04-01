'use client';

import { motion } from 'framer-motion';
import type { SimulationStep } from '@/lib/ethereum-types';

interface NetworkAnimationProps {
  step: SimulationStep;
}

export function NetworkAnimation({ step }: NetworkAnimationProps) {
  const showBroadcast = step === 'broadcasting';
  const showConsensus = ['attesting', 'finalizing'].includes(step);
  const showFinalized = step === 'complete';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Broadcasting animation */}
      {showBroadcast && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`broadcast-${i}`}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeOut',
              }}
              className="absolute left-1/4 top-1/3 size-20 rounded-full border-2 border-accent"
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </>
      )}

      {/* Consensus animation */}
      {showConsensus && (
        <>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={`consensus-${i}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="absolute size-3 rounded-full bg-primary"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Connection lines */}
          <svg className="absolute inset-0 size-full">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle1 = (i / 12) * Math.PI * 2;
              const angle2 = ((i + 1) / 12) * Math.PI * 2;
              const radius = 150;
              const x1 = 50 + (Math.cos(angle1) * radius) / 5;
              const y1 = 50 + (Math.sin(angle1) * radius) / 5;
              const x2 = 50 + (Math.cos(angle2) * radius) / 5;
              const y2 = 50 + (Math.sin(angle2) * radius) / 5;

              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                  }}
                />
              );
            })}
          </svg>
        </>
      )}

      {/* Finalized animation */}
      {showFinalized && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 3 }}
            className="flex size-24 items-center justify-center rounded-full bg-primary/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: 'linear' }}
              className="size-16 rounded-full border-4 border-primary border-t-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
