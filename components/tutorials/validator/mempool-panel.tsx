'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MempoolTransaction } from '@/hooks/use-validator-simulation';
import { ArrowRight, Flame, Wallet, FileCode, Coins } from 'lucide-react';

interface MempoolPanelProps {
  transactions: MempoolTransaction[];
  onSelect: (tx: MempoolTransaction) => void;
  canAddMore: boolean;
  isPlaying: boolean;
}

const TYPE_ICONS = {
  transfer: Wallet,
  contract: FileCode,
  defi: Coins,
};

const TYPE_COLORS = {
  transfer: 'bg-blue-500/20 text-blue-500',
  contract: 'bg-purple-500/20 text-purple-500',
  defi: 'bg-green-500/20 text-green-500',
};

export function MempoolPanel({ transactions, onSelect, canAddMore, isPlaying }: MempoolPanelProps) {
  const t = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {t('simulator.validator.mempool.title')}
        </h2>
        <span className="text-sm text-muted-foreground">
          {t('simulator.validator.mempool.count', { count: transactions.length })}
        </span>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {t('simulator.validator.mempool.hint')}
      </p>

      <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2">
        {transactions.map((tx, index) => {
          const Icon = TYPE_ICONS[tx.type];
          const colorClass = TYPE_COLORS[tx.type];
          
          return (
            <motion.button
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => isPlaying && canAddMore && onSelect(tx)}
              disabled={!isPlaying || !canAddMore}
              className={`w-full rounded-lg border p-3 text-left transition-all ${
                isPlaying && canAddMore
                  ? 'border-border bg-secondary/50 hover:border-primary hover:bg-primary/5 cursor-pointer'
                  : 'border-border bg-muted opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-8 items-center justify-center rounded ${colorClass}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.value.toFixed(3)} ETH
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('simulator.validator.mempool.gasLimit', { limit: tx.gasLimit.toLocaleString() })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Flame className="size-3 text-orange-500" />
                    {tx.gasPrice} Gwei
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{tx.priorityFee} priority
                  </p>
                </div>
              </div>
              
              {isPlaying && canAddMore && (
                <div className="mt-2 flex items-center justify-end text-xs text-primary">
                  {t('simulator.validator.mempool.clickToAdd')}
                  <ArrowRight className="ml-1 size-3" />
                </div>
              )}
            </motion.button>
          );
        })}
        
        {transactions.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <p>{t('simulator.validator.mempool.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
