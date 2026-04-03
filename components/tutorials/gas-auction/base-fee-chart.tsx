'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface BaseFeeChartProps {
  history: { block: number; baseFee: number }[];
  currentBaseFee: number;
  userMaxFee?: number;
}

export function BaseFeeChart({ history, currentBaseFee, userMaxFee }: BaseFeeChartProps) {
  const t = useTranslations();
  
  // Calculate chart dimensions based on all data including user max fee
  const { maxFee, minFee, range } = useMemo(() => {
    const allFees = [...history.map(h => h.baseFee)];
    if (userMaxFee) allFees.push(userMaxFee);
    
    const max = Math.max(...allFees, 50);
    const min = Math.min(...allFees, 10);
    return { maxFee: max, minFee: min, range: max - min || 1 };
  }, [history, userMaxFee]);

  // Calculate Y position for user's max fee line
  const userMaxFeeY = userMaxFee 
    ? 200 - ((userMaxFee - minFee) / range) * 180 - 10
    : null;

  // Generate path data for the line chart
  const pathData = useMemo(() => {
    if (history.length === 0) return '';
    
    return history.map((point, i) => {
      const x = (i / Math.max(history.length - 1, 1)) * 280 + 10;
      const y = 200 - ((point.baseFee - minFee) / range) * 180 - 10;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history, minFee, range]);

  // Current point position
  const currentX = history.length > 0 ? 280 : 10;
  const currentY = history.length > 0 
    ? 200 - ((currentBaseFee - minFee) / range) * 180 - 10
    : 190;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{t('simulator.gas.chart.title')}</h2>
        {userMaxFee && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-0.5 bg-accent border-dashed" style={{ borderTop: '2px dashed hsl(var(--accent))' }}></span>
            <span className="text-muted-foreground">Your Max Fee: {userMaxFee.toFixed(2)} Gwei</span>
          </div>
        )}
      </div>
      
      <div className="h-64">
        <svg className="h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={tick}
              x1="0"
              y1={200 - tick * 180}
              x2="300"
              y2={200 - tick * 180}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}
          
          {/* User's max fee reference line */}
          {userMaxFeeY && (
            <line
              x1="10"
              y1={userMaxFeeY}
              x2="290"
              y2={userMaxFeeY}
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Line chart - no animation, just render the path */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          )}
          
          {/* Data points for each history item */}
          {history.map((point, i) => {
            const x = (i / Math.max(history.length - 1, 1)) * 280 + 10;
            const y = 200 - ((point.baseFee - minFee) / range) * 180 - 10;
            const isLast = i === history.length - 1;
            
            return (
              <circle
                key={point.block}
                cx={x}
                cy={y}
                r={isLast ? 6 : 3}
                fill={isLast ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t('simulator.gas.chart.blocks', { count: history.length })}</span>
        <span>{t('simulator.gas.chart.range', { min: minFee.toFixed(1), max: maxFee.toFixed(1) })}</span>
      </div>
    </div>
  );
}
