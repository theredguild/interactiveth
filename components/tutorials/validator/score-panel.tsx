'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Trophy, Coins, TrendingUp, Package } from 'lucide-react';

interface ScorePanelProps {
  blockNumber: number;
  totalRewards: number;
  txCount: number;
  gasUtilization: number;
  isCompleted: boolean;
}

export function ScorePanel({ 
  blockNumber, 
  totalRewards, 
  txCount, 
  gasUtilization,
  isCompleted 
}: ScorePanelProps) {
  const t = useTranslations();

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-4">
      {/* Block Number */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t('simulator.validator.stats.blocks')}</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-foreground">{blockNumber - 1}</p>
      </div>

      {/* Transaction Count */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t('simulator.validator.stats.txs')}</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-foreground">{txCount}</p>
      </div>

      {/* Gas Utilization */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${
            gasUtilization > 0.9 ? 'bg-green-500' : 
            gasUtilization > 0.5 ? 'bg-yellow-500' : 
            gasUtilization > 0 ? 'bg-red-500' : 'bg-muted'
          }`} />
          <span className="text-xs text-muted-foreground">{t('simulator.validator.stats.utilization')}</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {(gasUtilization * 100).toFixed(0)}%
        </p>
      </div>

      {/* Total Rewards */}
      <motion.div 
        className="rounded-xl border border-border bg-card p-4"
        animate={isCompleted ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-primary" />
          <span className="text-xs text-muted-foreground">{t('simulator.validator.stats.rewards')}</span>
        </div>
        <p className="mt-1 text-2xl font-bold text-primary">
          {totalRewards.toFixed(3)} ETH
        </p>
      </motion.div>
    </div>
  );
}
