'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, SimulationStep, Node } from '@/lib/ethereum-types';
import { shortenHash } from '@/lib/ethereum-utils';
import { Inbox, ArrowRight, Server, HelpCircle } from 'lucide-react';

interface MempoolVisualizationProps {
  transactions: Transaction[];
  step: SimulationStep;
  nodes: Node[];
}

export function MempoolVisualization({ transactions, step, nodes }: MempoolVisualizationProps) {
  const isActive = step === 'mempool';
  const isExtracting = ['building-block', 'proposing-block'].includes(step);

  return (
    <div
      className={`rounded-xl border bg-card p-6 transition-all duration-300 ${
        isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`flex size-10 items-center justify-center rounded-lg ${
              isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Inbox className="size-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Mempool</h3>
            <p className="text-xs text-muted-foreground">
              {transactions.length} pending transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="group relative">
          <HelpCircle className="size-4 cursor-help text-muted-foreground" />
          <div className="absolute right-0 top-6 z-50 hidden w-64 rounded-lg border border-border bg-popover p-3 text-sm shadow-lg group-hover:block">
            <p className="font-medium text-foreground">What is the mempool?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The mempool is NOT a single location. Each Ethereum node maintains its own mempool - a local queue of pending transactions waiting to be included in a block. Validators select transactions from their mempool when building blocks.
            </p>
          </div>
        </div>
      </div>

      {/* Visual representation of distributed mempool */}
      <div className="mb-4 rounded-lg bg-secondary/30 p-3">
        <p className="mb-2 text-xs text-muted-foreground">Distributed across nodes:</p>
        <div className="flex flex-wrap gap-1">
          {nodes.slice(0, 4).map((node, idx) => (
            <motion.div
              key={node.id}
              animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
              transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
              className="flex items-center gap-1 rounded bg-secondary px-2 py-1"
            >
              <Server className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{node.name.split('-')[0]}</span>
            </motion.div>
          ))}
          <span className="flex items-center px-2 text-xs text-muted-foreground">+1000s</span>
        </div>
      </div>

      <div className="min-h-[120px] rounded-lg bg-secondary/50 p-4">
        <AnimatePresence mode="popLayout">
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center py-4 text-center"
            >
              <Inbox className="mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {isExtracting ? 'Transactions moved to block' : 'No pending transactions'}
              </p>
              {!isExtracting && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Transactions wait here until a validator includes them
                </p>
              )}
            </motion.div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex size-6 items-center justify-center rounded bg-chart-4/20 text-chart-4">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <code className="block truncate font-mono text-xs text-foreground">
                      {shortenHash(tx.hash)}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      {tx.gasPrice} Gwei priority
                    </p>
                  </div>
                  <span className="text-xs font-medium text-foreground">{tx.value.toFixed(2)} ETH</span>
                  {isExtracting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <ArrowRight className="size-4 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
