'use client';

import { motion } from 'framer-motion';
import type { SimulationStep } from '@/lib/ethereum-types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, RotateCcw, Zap, Repeat, Activity } from 'lucide-react';

interface ControlPanelProps {
  step: SimulationStep;
  isAutoMode: boolean;
  isFullAuto: boolean;
  speed: number;
  canAdvance: boolean;
  totalTransactions: number;
  onStartTransaction: () => void;
  onNextStep: () => void;
  onToggleAutoMode: () => void;
  onToggleFullAuto: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

export function ControlPanel({
  step,
  isAutoMode,
  isFullAuto,
  speed,
  canAdvance,
  totalTransactions,
  onStartTransaction,
  onNextStep,
  onToggleAutoMode,
  onToggleFullAuto,
  onSetSpeed,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Simulation Controls</h3>
      </div>

      <div className="space-y-4">
        {/* Full Auto Mode - prominent toggle */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Full Auto Mode</span>
            </div>
            <Button
              onClick={onToggleFullAuto}
              variant={isFullAuto ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              {isFullAuto ? (
                <>
                  <Activity className="size-4" />
                  Running
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Enable
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Continuously generates and processes transactions automatically. Watch the full lifecycle repeat endlessly.
          </p>
          {isFullAuto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center gap-2"
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="size-2 rounded-full bg-primary"
              />
              <span className="text-xs text-primary">
                {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''} processed
              </span>
            </motion.div>
          )}
        </div>

        {/* Manual controls */}
        <div className="flex flex-wrap gap-2">
          {step === 'idle' && !isFullAuto ? (
            <Button
              onClick={onStartTransaction}
              className="flex-1 gap-2"
              size="lg"
            >
              <Play className="size-4" />
              Create Transaction
            </Button>
          ) : (
            <>
              <Button
                onClick={onNextStep}
                disabled={!canAdvance || isAutoMode}
                variant="secondary"
                className="flex-1 gap-2"
              >
                <SkipForward className="size-4" />
                Next Step
              </Button>
              <Button
                onClick={onToggleAutoMode}
                variant={isAutoMode ? 'default' : 'outline'}
                className="gap-2"
                disabled={isFullAuto}
              >
                {isAutoMode ? (
                  <>
                    <Pause className="size-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="size-4" />
                    Auto
                  </>
                )}
              </Button>
            </>
          )}
          <Button
            onClick={onReset}
            variant="outline"
            size="icon"
            title="Reset simulation"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        {/* Speed control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Animation Speed</span>
            <span className="text-sm font-medium text-foreground">
              {speed >= 2000 ? 'Slow' : speed >= 1000 ? 'Normal' : 'Fast'}
            </span>
          </div>
          <Slider
            value={[3000 - speed]}
            onValueChange={([val]) => onSetSpeed(3000 - val)}
            min={500}
            max={2500}
            step={100}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={step !== 'idle' && step !== 'complete' ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className={`size-2 rounded-full ${
                step === 'idle'
                  ? 'bg-muted-foreground'
                  : step === 'complete'
                  ? 'bg-primary'
                  : 'bg-accent'
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isFullAuto
                ? 'Full auto mode - continuous simulation'
                : step === 'idle'
                ? 'Ready to simulate'
                : step === 'complete'
                ? 'Transaction confirmed!'
                : isAutoMode
                ? 'Auto-advancing...'
                : 'Click Next Step to continue'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
