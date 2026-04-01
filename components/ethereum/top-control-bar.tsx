'use client';

import { motion } from 'framer-motion';
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
  const isIdle = step === 'idle';
  const isComplete = step === 'complete';
  
  // Determine status text
  const getStatusText = () => {
    if (isPlaying) return 'Playing';
    if (isPaused) return 'Paused';
    if (isComplete) return 'Completed';
    if (isIdle) return 'Ready';
    return 'Manual Mode';
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
              {totalTransactions > 0 && `${totalTransactions} tx processed`}
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
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="size-5" />
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Play'}</span>
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
            title={isPlaying ? 'Pause first to step manually' : 'Advance one step'}
          >
            <SkipForward className="size-5" />
            <span className="hidden sm:inline">Next Step</span>
          </Button>

          {/* Reset button */}
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="size-10"
            title="Reset simulation"
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
            {speed >= 2000 ? 'Slow' : speed >= 1000 ? 'Normal' : 'Fast'}
          </span>
        </div>
      </div>
    </div>
  );
}
