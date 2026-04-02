'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Transaction, SimulationStep, Wallet } from '@/lib/ethereum-types';
import { shortenAddress, shortenHash } from '@/lib/ethereum-utils';
import { ArrowRight, FileText, Key, Radio, Inbox, User, Wallet as WalletIcon, CheckCircle2, Fingerprint } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction | null;
  step: SimulationStep;
  activeWallet: Wallet | null;
  wallets: Wallet[];
}

const stepIcons: Record<string, React.ReactNode> = {
  'creating-tx': <FileText className="size-5" />,
  'signing-tx': <Key className="size-5" />,
  'broadcasting': <Radio className="size-5" />,
  'mempool': <Inbox className="size-5" />,
};

export function TransactionCard({ transaction, step, activeWallet, wallets }: TransactionCardProps) {
  const t = useTranslations();
  const isActive = ['creating-tx', 'signing-tx', 'broadcasting', 'mempool'].includes(step);
  const recipientWallet = wallets.find(w => w.address === transaction?.to);
  
  const getStepTitle = (stepKey: string) => {
    const titleMap: Record<string, string> = {
      'creating-tx': t('simulator.transaction.creating'),
      'signing-tx': t('simulator.transaction.signing'),
      'broadcasting': t('simulator.transaction.broadcasting'),
      'mempool': t('simulator.transaction.inMempool'),
    };
    return titleMap[stepKey] || t('simulator.transaction.title');
  };
  
  if (!transaction && step === 'idle') {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="size-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{t('simulator.transaction.title')}</h3>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('simulator.transaction.waitingForUser')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('simulator.transaction.instruction')}
          </p>
        </div>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border bg-card p-6 transition-all duration-300 ${
        isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
      }`}
    >
      {/* Header with current action */}
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`flex size-10 items-center justify-center rounded-lg ${
            isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {stepIcons[step] || <FileText className="size-5" />}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {getStepTitle(step)}
          </h3>
          {transaction.hash && (
            <p className="font-mono text-xs text-muted-foreground">{shortenHash(transaction.hash)}</p>
          )}
        </div>
      </div>

      {/* Who is doing this */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3"
        >
          <div className="flex items-start gap-2">
            {step === 'creating-tx' && (
              <>
                <User className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('simulator.transaction.userInitiates')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('simulator.transaction.walletOpens', { wallet: activeWallet?.name || 'Unknown' })}
                  </p>
                </div>
              </>
            )}
            {step === 'signing-tx' && (
              <>
                <Fingerprint className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('simulator.transaction.walletSigns')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('simulator.transaction.walletSignsDesc', { wallet: activeWallet?.name || 'Unknown' })}
                  </p>
                </div>
              </>
            )}
            {step === 'broadcasting' && (
              <>
                <Radio className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('simulator.transaction.walletSends')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('simulator.transaction.walletSendsDesc')}
                  </p>
                </div>
              </>
            )}
            {step === 'mempool' && (
              <>
                <Inbox className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('simulator.transaction.propagates')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('simulator.transaction.propagatesDesc')}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* From/To with wallet names */}
      <div className="space-y-3">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <WalletIcon className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('simulator.transaction.from')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{activeWallet?.name || 'Unknown'}</span>
            <code className="rounded bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {shortenAddress(transaction.from)}
            </code>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <ArrowRight className="size-5 text-primary" />
          </motion.div>
        </div>

        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <WalletIcon className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('simulator.transaction.to')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{recipientWallet?.name || 'Unknown'}</span>
            <code className="rounded bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {shortenAddress(transaction.to)}
            </code>
          </div>
        </div>
      </div>

      {/* Transaction details */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">{t('simulator.transaction.value')}</p>
          <p className="font-mono font-semibold text-foreground">{transaction.value.toFixed(3)} ETH</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('simulator.transaction.gasPrice')}</p>
          <p className="font-mono font-semibold text-foreground">{transaction.gasPrice} Gwei</p>
        </div>
      </div>

      {/* Signature (if signed) */}
      {transaction.signature && (
        <div className="mt-3 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span className="text-xs text-muted-foreground">{t('simulator.transaction.signed')}</span>
          </div>
          <code className="mt-1 block truncate rounded bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground">
            {transaction.signature.slice(0, 42)}...
          </code>
        </div>
      )}

      {/* Status */}
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">{t('simulator.transaction.status')}</p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              transaction.status === 'confirmed'
                ? 'bg-primary'
                : transaction.status === 'in-block'
                ? 'bg-accent'
                : 'bg-chart-4 animate-pulse'
            }`}
          />
          <span className="text-sm capitalize text-foreground">{transaction.status.replace('-', ' ')}</span>
        </div>
      </div>
    </motion.div>
  );
}
