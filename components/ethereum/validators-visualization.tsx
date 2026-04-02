'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Validator, SimulationStep } from '@/lib/ethereum-types';
import { shortenAddress } from '@/lib/ethereum-utils';
import { Users, Crown, CheckCircle2, Shield, HelpCircle } from 'lucide-react';

interface ValidatorsVisualizationProps {
  validators: Validator[];
  step: SimulationStep;
}

export function ValidatorsVisualization({ validators, step }: ValidatorsVisualizationProps) {
  const t = useTranslations();
  const isActive = ['selecting-validator', 'attesting', 'finalizing'].includes(step);

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
            <Users className="size-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('simulator.panels.validators.title')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('simulator.panel.validators.attestedCount', { 
                attested: validators.filter(v => v.hasAttested).length, 
                total: validators.length 
              })}
            </p>
          </div>
        </div>
        <div className="group relative">
          <HelpCircle className="size-4 cursor-help text-muted-foreground" />
          <div className="absolute right-0 top-6 z-50 hidden w-64 rounded-lg border border-border bg-popover p-3 text-sm shadow-lg group-hover:block">
            <p className="font-medium text-foreground">{t('simulator.panel.validators.whatAreValidators')}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('simulator.panel.validators.validatorsTooltip')}
            </p>
          </div>
        </div>
      </div>

      {/* Validator roles explanation */}
      <div className="mb-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Crown className="size-3 text-primary" />
          <span className="text-muted-foreground">{t('simulator.panel.validators.proposer')}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="size-3 text-accent" />
          <span className="text-muted-foreground">{t('simulator.panel.validators.attested')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="size-3 text-muted-foreground" />
          <span className="text-muted-foreground">{t('simulator.panel.validators.waiting')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {validators.map((validator, index) => (
          <motion.div
            key={validator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-lg border p-3 transition-all ${
              validator.isProposer
                ? 'border-primary bg-primary/10'
                : validator.hasAttested
                ? 'border-accent bg-accent/10'
                : validator.status === 'finalized'
                ? 'border-primary/50 bg-primary/5'
                : 'border-border bg-secondary/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex size-8 items-center justify-center rounded-full ${
                  validator.isProposer
                    ? 'bg-primary text-primary-foreground'
                    : validator.hasAttested
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {validator.isProposer ? (
                  <Crown className="size-4" />
                ) : validator.hasAttested ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Shield className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {validator.name}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {t('simulator.panel.validators.ethStaked', { amount: validator.stake })}
                </p>
              </div>
            </div>

            {validator.isProposer && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -right-1 -top-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground"
              >
                {t('simulator.panel.validators.proposer')}
              </motion.div>
            )}

            {validator.hasAttested && !validator.isProposer && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -right-1 -top-1"
              >
                <CheckCircle2 className="size-4 text-accent" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {step === 'selecting-validator' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm"
        >
          <p className="font-medium text-foreground">{t('simulator.panel.validators.randaoTitle')}</p>
          <p className="text-xs text-muted-foreground">
            {t('simulator.panel.validators.randaoDesc')}
          </p>
        </motion.div>
      )}

      {step === 'attesting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-lg bg-accent/10 p-3 text-sm"
        >
          <p className="font-medium text-accent">{t('simulator.panel.validators.attestationTitle')}</p>
          <p className="text-xs text-muted-foreground">
            {t('simulator.panel.validators.attestationDesc')}
          </p>
        </motion.div>
      )}

      {step === 'finalizing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-lg bg-primary/10 p-3 text-sm"
        >
          <p className="font-medium text-primary">{t('simulator.panel.validators.consensusTitle')}</p>
          <p className="text-xs text-muted-foreground">
            {t('simulator.panel.validators.consensusDesc')}
          </p>
        </motion.div>
      )}
    </div>
  );
}
