'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TimerDisplayProps {
  seconds: number;
  isPlaying: boolean;
  isCompleted: boolean;
}

export function TimerDisplay({ seconds, isPlaying, isCompleted }: TimerDisplayProps) {
  const t = useTranslations();
  
  const getStatusColor = () => {
    if (isCompleted) return 'text-green-500';
    if (!isPlaying) return 'text-muted-foreground';
    if (seconds <= 3) return 'text-red-500 animate-pulse';
    if (seconds <= 6) return 'text-yellow-500';
    return 'text-foreground';
  };

  const getBgColor = () => {
    if (isCompleted) return 'bg-green-500/10 border-green-500/30';
    if (!isPlaying) return 'bg-muted border-border';
    if (seconds <= 3) return 'bg-red-500/10 border-red-500/30 animate-pulse';
    if (seconds <= 6) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-card border-border';
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-2 ${getBgColor()}`}>
      <div className={`flex size-8 items-center justify-center rounded-full ${
        isCompleted ? 'bg-green-500/20' : 
        seconds <= 3 ? 'bg-red-500/20' : 
        'bg-primary/10'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="size-4 text-green-500" />
        ) : seconds <= 3 ? (
          <AlertCircle className="size-4 text-red-500" />
        ) : (
          <Clock className="size-4 text-primary" />
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">
          {isCompleted ? t('simulator.validator.timer.completed') : t('simulator.validator.timer.remaining')}
        </p>
        <p className={`text-xl font-bold ${getStatusColor()}`}>
          {seconds}s
        </p>
      </div>
    </div>
  );
}
