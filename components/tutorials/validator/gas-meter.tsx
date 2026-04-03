'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Fuel, AlertCircle } from 'lucide-react';

interface GasMeterProps {
  used: number;
  limit: number;
  utilization: number;
}

export function GasMeter({ used, limit, utilization }: GasMeterProps) {
  const t = useTranslations();
  const percentage = utilization * 100;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
      <div className="flex size-8 items-center justify-center rounded-full bg-orange-500/10">
        <Fuel className="size-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{t('simulator.validator.gas.title')}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {(used / 1000000).toFixed(2)}M / {(limit / 1000000).toFixed(1)}M
          </span>
          <span className={`text-xs ${
            percentage > 90 ? 'text-red-500' : 
            percentage > 70 ? 'text-green-500' : 
            'text-yellow-500'
          }`}>
            ({percentage.toFixed(0)}%)
          </span>
        </div>
      </div>
      {percentage > 95 && (
        <AlertCircle className="size-4 text-red-500" />
      )}
    </div>
  );
}
