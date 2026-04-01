'use client';

import { motion } from 'framer-motion';
import type { Block, SimulationStep } from '@/lib/ethereum-types';
import { shortenHash, shortenAddress } from '@/lib/ethereum-utils';
import { Box, Hash, Clock, Fuel, User } from 'lucide-react';

interface BlockVisualizationProps {
  block: Block | null;
  step: SimulationStep;
}

export function BlockVisualization({ block, step }: BlockVisualizationProps) {
  const isActive = ['building-block', 'proposing-block', 'attesting', 'finalizing'].includes(step);

  if (!block) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <Box className="size-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Block</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Waiting for block construction...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border bg-card p-6 transition-all duration-300 ${
        isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          animate={isActive ? { rotateY: [0, 360] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className={`flex size-10 items-center justify-center rounded-lg ${
            block.status === 'finalized'
              ? 'bg-primary text-primary-foreground'
              : isActive
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          <Box className="size-5" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Block #{block.number}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                block.status === 'finalized'
                  ? 'bg-primary'
                  : block.status === 'attested'
                  ? 'bg-accent'
                  : 'bg-chart-4 animate-pulse'
              }`}
            />
            <span className="text-xs capitalize text-muted-foreground">{block.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Hash className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Hash:</span>
          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
            {shortenHash(block.hash)}
          </code>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Hash className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Parent:</span>
          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
            {shortenHash(block.parentHash)}
          </code>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Proposer:</span>
          <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
            {shortenAddress(block.miner)}
          </code>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="font-mono font-semibold text-foreground">{block.transactions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Gas Used</p>
              <p className="font-mono font-semibold text-foreground">
                {(block.gasUsed / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        {block.attestations > 0 && (
          <div className="mt-2 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Attestations</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: i < block.attestations ? 1 : 0.5 }}
                  transition={{ delay: i * 0.1 }}
                  className={`size-4 rounded ${
                    i < block.attestations ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {block.attestations}/8 validators ({((block.attestations / 8) * 100).toFixed(0)}%)
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
