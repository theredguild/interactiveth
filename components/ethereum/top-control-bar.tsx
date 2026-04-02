'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { SimulationStep } from '@/lib/ethereum-types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react';

interface TopControlBarProps {
  step: SimulationStep;
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  totalTransactions: number;
  onTogglePlayPause: () => void;
  onNextStep: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

export function TopControlBar({
  step,
  isPlaying,
  isPaused,
  speed,
  totalTransactions,
  onTogglePlayPause,
  onNextStep,
  onSetSpeed,
  onReset,
}: TopControlBarProps) {
  const t = useTranslations();
  const isIdle = step === 'idle';
  const isComplete = step === 'complete';
  
  // Determine status text
  const getStatusText = () => {
    if (isPlaying) return t('simulator.controls.playing');
    if (isPaused) return t('simulator.controls.paused');
    if (isComplete) return t('simulator.controls.completed');
    if (isIdle) return t('simulator.controls.ready');
    return t('simulator.controls.manualMode');
  };

  // Next step is enabled when paused or when in manual mode (not playing)
  const canNextStep = !isPlaying && (isPaused || !isIdle);

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Left side - Status indicator */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`size-3 rounded-full ${
              isPlaying
                ? 'bg-primary shadow-lg shadow-primary/50'
                : isPaused
                ? 'bg-amber-500'
                : step === 'complete'
                ? 'bg-primary'
                : 'bg-muted-foreground'
            }`}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {getStatusText()}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalTransactions > 0 && t('simulator.controls.txProcessed', { count: totalTransactions })}
            </p>
          </div>
        </div>

        {/* Center - Main controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause button */}
          <Button
            onClick={onTogglePlayPause}
            variant={isPlaying ? 'default' : 'outline'}
            size="lg"
            className="gap-2 px-6"
          >
            {isPlaying ? (
              <>
                <Pause className="size-5" />
                <span className="hidden sm:inline">{t('common.pause')}</span>
              </>
            ) : (
              <>
                <Play className="size-5" />
                <span className="hidden sm:inline">{isPaused ? t('common.play') : t('common.play')}</span>
              </>
            )}
          </Button>

          {/* Next Step button - enabled when paused */}
          <Button
            onClick={onNextStep}
            variant="secondary"
            size="lg"
            disabled={!canNextStep && !isIdle}
            className="gap-2"
            title={isPlaying ? t('simulator.controls.pauseFirst') : t('simulator.controls.advanceOneStep')}
          >
            <SkipForward className="size-5" />
            <span className="hidden sm:inline">{t('simulator.controls.nextStep')}</span>
          </Button>

          {/* Reset button */}
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="size-10"
            title={t('simulator.controls.resetSimulation')}
          >
            <RotateCcw className="size-5" />
          </Button>
        </div>

        {/* Right side - Speed control */}
        <div className="flex items-center gap-3">
          <Gauge className="size-4 text-muted-foreground" />
          <div className="hidden w-32 sm:block">
            <Slider
              value={[3000 - speed]}
              onValueChange={([val]) => onSetSpeed(3000 - val)}
              min={500}
              max={2500}
              step={100}
              className="w-full"
            />
          </div>
          <span className="w-12 text-xs text-muted-foreground">
            {speed >= 2000 ? t('simulator.controls.slow') : speed >= 1000 ? t('simulator.controls.normal') : t('simulator.controls.fast')}
          </span>
        </div>
      </div>
    </div>
  );
}
