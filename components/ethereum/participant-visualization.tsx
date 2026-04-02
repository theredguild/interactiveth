'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { SimulationStep, Wallet, Node } from '@/lib/ethereum-types';
import { shortenAddress } from '@/lib/ethereum-utils';
import { User, Wallet as WalletIcon, Server, Globe, Radio, ArrowRight } from 'lucide-react';

interface ParticipantVisualizationProps {
  step: SimulationStep;
  wallets: Wallet[];
  activeWallet: Wallet | null;
  nodes: Node[];
}

export function ParticipantVisualization({ 
  step, 
  wallets, 
  activeWallet,
  nodes 
}: ParticipantVisualizationProps) {
  const t = useTranslations();
  const isUserActive = ['creating-tx', 'signing-tx'].includes(step);
  const isNodeActive = ['broadcasting', 'mempool'].includes(step);
  
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Globe className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t('simulator.panel.participants.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('simulator.panel.participants.subtitle')}</p>
        </div>
      </div>

      {/* User & Wallet Section */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('simulator.panel.participants.userAndWallet')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {wallets.map((wallet) => {
            const isActive = activeWallet?.address === wallet.address && isUserActive;
            return (
              <motion.div
                key={wallet.address}
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`rounded-lg border p-3 transition-all ${
                  isActive 
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                    : 'border-border bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`flex size-8 items-center justify-center rounded-full ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    <WalletIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {wallet.name}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {shortenAddress(wallet.address, 4)}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 border-t border-border pt-2"
                  >
                    <p className="text-xs text-primary">
                      {step === 'creating-tx' ? t('simulator.panel.participants.creating') : t('simulator.panel.participants.signing')}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Flow arrow */}
      <div className="my-4 flex items-center justify-center">
        <motion.div
          animate={isUserActive || isNodeActive ? { x: [0, 5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <ArrowRight className={`size-5 ${isUserActive || isNodeActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </motion.div>
      </div>

      {/* Nodes Section */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Server className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('simulator.panel.participants.ethereumNodes')}</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('simulator.panel.participants.nodesDescription')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {nodes.map((node, idx) => {
            const isActive = isNodeActive;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0.5 }}
                animate={isActive ? { 
                  opacity: 1,
                  scale: [1, 1.05, 1],
                } : { opacity: 0.7 }}
                transition={{ 
                  repeat: isActive ? Infinity : 0, 
                  duration: 1,
                  delay: idx * 0.1,
                }}
                className={`rounded-lg border p-2 text-center transition-all ${
                  isActive 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border bg-secondary/20'
                }`}
              >
                <div className={`mx-auto mb-1 flex size-6 items-center justify-center rounded ${
                  node.type === 'execution' ? 'bg-chart-1/20 text-chart-1' : 'bg-chart-2/20 text-chart-2'
                }`}>
                  {node.type === 'execution' ? (
                    <Server className="size-3" />
                  ) : (
                    <Radio className="size-3" />
                  )}
                </div>
                <p className="truncate text-xs font-medium text-foreground">{node.name.split('-')[0]}</p>
                <p className="text-xs text-muted-foreground">{node.location}</p>
                {isActive && step === 'mempool' && (
                  <p className="mt-1 text-xs text-accent">{t('simulator.panels.mempool.title')}</p>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t('simulator.panel.participants.moreNodes')}
        </p>
      </div>
    </div>
  );
}
