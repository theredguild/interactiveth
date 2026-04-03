'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Clock, Zap, Users, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InclusionEstimatorProps {
  position: number;
  estimatedTime: number | null;
  pendingCount: number;
}

export function InclusionEstimator({ position, estimatedTime, pendingCount }: InclusionEstimatorProps) {
  const t = useTranslations();

  const getStatus = () => {
    if (!estimatedTime) return { color: 'text-muted-foreground', icon: Clock, message: t('simulator.gas.estimator.calculating') };
    if (estimatedTime <= 12) return { color: 'text-green-500', icon: CheckCircle2, message: t('simulator.gas.estimator.fast') };
    if (estimatedTime <= 60) return { color: 'text-yellow-500', icon: Zap, message: t('simulator.gas.estimator.medium') };
    return { color: 'text-red-500', icon: AlertCircle, message: t('simulator.gas.estimator.slow') };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{t('simulator.gas.estimator.title')}</h2>
      
      <div className="space-y-4">
        {/* Position in Queue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('simulator.gas.estimator.position')}</span>
          </div>
          <span className="text-lg font-bold">
            #{position} / {pendingCount}
          </span>
        </div>

        {/* Estimated Time */}
        <motion.div
          key={estimatedTime}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`flex items-center justify-between rounded-lg bg-secondary/50 p-3 ${status.color}`}
        >
          <div className="flex items-center gap-2">
            <Icon className="size-5" />
            <span className="text-sm font-medium">{t('simulator.gas.estimator.time')}</span>
          </div>
          <span className="text-lg font-bold">
            {estimatedTime ? `~${estimatedTime}s` : '...'}
          </span>
        </motion.div>

        {/* Status Message */}
        <p className={`text-sm ${status.color}`}>
          {status.message}
        </p>

        {/* Explanation */}
        <div className="rounded-lg bg-secondary/30 p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{t('simulator.gas.estimator.howItWorks')}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('simulator.gas.estimator.explanation')}
          </p>
        </div>
      </div>
    </div>
  );
}
