'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { PendingTransaction } from '@/hooks/use-gas-auction';
import { Flame, User } from 'lucide-react';

interface MempoolQueueProps {
  transactions: PendingTransaction[];
  userPosition: number;
  userPriorityFee: number;
}

export function MempoolQueue({ transactions, userPosition, userPriorityFee }: MempoolQueueProps) {
  const t = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('simulator.gas.queue.title')}</h2>
        <span className="text-sm text-muted-foreground">
          {t('simulator.gas.queue.count', { count: transactions.length })}
        </span>
      </div>

      <div className="space-y-2 pr-2 max-h-[350px] overflow-y-auto">
        {/* Show first 8 txs */}
        {transactions.slice(0, 8).map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`flex items-center justify-between rounded-lg border p-3 ${
              index < userPosition - 1
                ? 'border-border bg-secondary/30'
                : index === userPosition - 1
                ? 'border-primary bg-primary/10'
                : 'border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-sm text-foreground">
                {tx.maxPriorityFeePerGas.toFixed(2)} Gwei
              </span>
            </div>
            <Flame className={`size-4 ${
              tx.maxPriorityFeePerGas > userPriorityFee
                ? 'text-red-500'
                : tx.maxPriorityFeePerGas < userPriorityFee
                ? 'text-green-500'
                : 'text-yellow-500'
            }`} />
          </motion.div>
        ))}

        {/* User position indicator if beyond visible list */}
        {userPosition > 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3"
          >
            <span className="w-6 text-center text-sm font-medium text-primary">
              {userPosition}
            </span>
            <User className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('simulator.gas.queue.yourTx')} ({userPriorityFee.toFixed(2)} Gwei)
            </span>
          </motion.div>
        )}

        {transactions.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {t('simulator.gas.queue.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
