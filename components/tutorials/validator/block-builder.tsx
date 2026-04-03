'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SelectedTransaction } from '@/hooks/use-validator-simulation';
import { X, Wallet, FileCode, Coins, Box, CheckCircle2 } from 'lucide-react';

interface BlockBuilderProps {
  transactions: SelectedTransaction[];
  onRemove: (txId: string) => void;
  gasUsed: number;
  gasLimit: number;
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

export function BlockBuilder({ 
  transactions, 
  onRemove, 
  gasUsed, 
  gasLimit,
  isPlaying 
}: BlockBuilderProps) {
  const t = useTranslations();
  const gasUtilization = (gasUsed / gasLimit) * 100;

  return (
    <div className="rounded-xl border-2 border-primary bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            {t('simulator.validator.block.title')}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {transactions.length} {t('simulator.validator.block.transactions')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('simulator.validator.block.gasUsed', { 
              used: gasUsed.toLocaleString(), 
              limit: gasLimit.toLocaleString() 
            })}
          </p>
        </div>
      </div>

      {/* Gas Progress Bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t('simulator.validator.block.gasUtilization')}</span>
          <span className={
            gasUtilization > 90 ? 'text-red-500' : 
            gasUtilization > 70 ? 'text-green-500' : 
            'text-yellow-500'
          }>
            {gasUtilization.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div 
            className={`h-full ${
              gasUtilization > 90 ? 'bg-red-500' : 
              gasUtilization > 70 ? 'bg-green-500' : 
              'bg-yellow-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(gasUtilization, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {gasUtilization > 95 && (
          <p className="mt-1 text-xs text-red-500">
            {t('simulator.validator.block.almostFull')}
          </p>
        )}
      </div>

      {/* Selected Transactions */}
      <div className="min-h-[300px] space-y-2">
        <AnimatePresence mode="popLayout">
          {transactions.map((tx, index) => {
            const Icon = TYPE_ICONS[tx.type];
            const colorClass = TYPE_COLORS[tx.type];
            
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative rounded-lg border border-primary/30 bg-primary/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {tx.order}
                    </div>
                    <div className={`flex size-8 items-center justify-center rounded ${colorClass}`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {tx.value.toFixed(3)} ETH
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.gasLimit.toLocaleString()} gas @ {tx.gasPrice} Gwei
                      </p>
                    </div>
                  </div>
                  
                  {isPlaying && (
                    <button
                      onClick={() => onRemove(tx.id)}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {transactions.length === 0 && (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center">
            <Box className="mb-2 size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {t('simulator.validator.block.empty')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('simulator.validator.block.hint')}
            </p>
          </div>
        )}
      </div>

      {/* Block Ready Indicator */}
      {transactions.length > 0 && gasUtilization >= 80 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-500"
        >
          <CheckCircle2 className="size-5" />
          <span className="text-sm font-medium">
            {t('simulator.validator.block.ready')}
          </span>
        </motion.div>
      )}
    </div>
  );
}
