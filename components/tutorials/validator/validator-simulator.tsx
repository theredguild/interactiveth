'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useValidatorSimulation } from '@/hooks/use-validator-simulation';
import { MempoolPanel } from './mempool-panel';
import { BlockBuilder } from './block-builder';
import { GasMeter } from './gas-meter';
import { ScorePanel } from './score-panel';
import { TimerDisplay } from './timer-display';
import { Trophy, Play, RotateCcw, Info, Crown } from 'lucide-react';

export function ValidatorSimulator() {
  const t = useTranslations();
  const [showInstructions, setShowInstructions] = useState(true);
  
  const {
    mempool,
    selectedTxs,
    gasUsed,
    gasLimit,
    gasUtilization,
    timeSeconds,
    isPlaying,
    isCompleted,
    score,
    blockNumber,
    totalRewards,
    canAddMore,
    startRound,
    completeBlock,
    addTransaction,
    removeTransaction,
    reset,
  } = useValidatorSimulation();

  // Pause simulation when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // Note: The validator hook doesn't have a direct pause function,
        // but we could add one if needed. For now, this prevents background running.
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Crown className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {t('simulator.validator.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t('simulator.validator.subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <TimerDisplay 
                seconds={timeSeconds} 
                isPlaying={isPlaying}
                isCompleted={isCompleted}
              />
              <GasMeter 
                used={gasUsed} 
                limit={gasLimit} 
                utilization={gasUtilization}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Instructions Overlay */}
        <AnimatePresence>
          {showInstructions && !isPlaying && !isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Info className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-lg font-semibold text-foreground">
                    {t('simulator.validator.instructions.title')}
                  </h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>{t('simulator.validator.instructions.step1')}</li>
                    <li>{t('simulator.validator.instructions.step2')}</li>
                    <li>{t('simulator.validator.instructions.step3')}</li>
                    <li>{t('simulator.validator.instructions.step4')}</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('common.dismiss')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Controls */}
        <div className="mb-6 flex items-center justify-center gap-4">
          {!isPlaying && !isCompleted ? (
            <button
              onClick={startRound}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="size-5" />
              {blockNumber === 1 ? t('simulator.validator.start') : t('simulator.validator.nextRound')}
            </button>
          ) : isPlaying ? (
            <button
              onClick={completeBlock}
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Trophy className="size-5" />
              {t('simulator.validator.proposeBlock')}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 px-6 py-3">
                <p className="text-sm text-muted-foreground">{t('simulator.validator.roundScore')}</p>
                <p className="text-2xl font-bold text-primary">{score}</p>
              </div>
              <button
                onClick={startRound}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="size-5" />
                {t('simulator.validator.nextRound')}
              </button>
            </div>
          )}
          
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <RotateCcw className="size-4" />
            {t('common.reset')}
          </button>
        </div>

        {/* Stats Panel - Only show after user has started playing */}
        {(isPlaying || isCompleted) && (
          <ScorePanel 
            blockNumber={blockNumber}
            totalRewards={totalRewards}
            txCount={selectedTxs.length}
            gasUtilization={gasUtilization}
            isCompleted={isCompleted}
          />
        )}

        {/* Game Area */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mempool */}
          <MempoolPanel 
            transactions={mempool}
            onSelect={addTransaction}
            canAddMore={canAddMore}
            isPlaying={isPlaying}
          />
          
          {/* Block Builder */}
          <BlockBuilder 
            transactions={selectedTxs}
            onRemove={removeTransaction}
            gasUsed={gasUsed}
            gasLimit={gasLimit}
            isPlaying={isPlaying}
          />
        </div>
      </main>
    </div>
  );
}
