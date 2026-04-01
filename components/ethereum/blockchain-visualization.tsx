'use client';

import { motion } from 'framer-motion';
import type { Block } from '@/lib/ethereum-types';
import { shortenHash } from '@/lib/ethereum-utils';
import { Box, Link, CheckCircle2 } from 'lucide-react';

interface BlockchainVisualizationProps {
  blocks: Block[];
}

export function BlockchainVisualization({ blocks }: BlockchainVisualizationProps) {
  const displayBlocks = blocks.slice(-5);

  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <Link className="size-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Blockchain</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Finalized blocks will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Link className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Blockchain</h3>
          <p className="text-xs text-muted-foreground">{blocks.length} finalized blocks</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {displayBlocks.map((block, index) => (
          <motion.div
            key={block.hash}
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="group relative">
              <div className="rounded-lg border border-primary bg-primary/10 p-3 transition-all hover:bg-primary/20">
                <div className="flex items-center gap-2">
                  <Box className="size-5 text-primary" />
                  <span className="font-mono font-semibold text-foreground">#{block.number}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {shortenHash(block.hash, 6)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                  <CheckCircle2 className="size-3" />
                  <span>Finalized</span>
                </div>
              </div>

              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="font-mono font-semibold text-foreground">{block.transactions.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Attestations</p>
                <p className="font-mono font-semibold text-foreground">{block.attestations}/8</p>
              </div>
            </div>

            {index < displayBlocks.length - 1 && (
              <div className="flex w-8 items-center justify-center">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-0.5 w-full bg-primary/50"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
