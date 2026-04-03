'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useGasAuctionSimulation } from '@/hooks/use-gas-auction';
import { MempoolQueue } from './mempool-queue';
import { GasPriceControls } from './gas-price-controls';
import { InclusionEstimator } from './inclusion-estimator';
import { Play, Pause, RotateCcw, TrendingUp, Activity, Flame, Coins, Zap, Info } from 'lucide-react';

export function GasAuctionSimulator() {
  const t = useTranslations();
  const hasMounted = useRef(false);
  
  const {
    baseFee,
    pendingTxs,
    userTx,
    userPosition,
    inclusionTime,
    blockNumber,
    isSimulating,
    congestionLevel,
    history,
    effectiveGasPrice,
    startSimulation,
    stopSimulation,
    updateUserTx,
    updateCongestion,
    mineBlock,
  } = useGasAuctionSimulation();

  // Stop simulation when component unmounts or tab becomes hidden
  useEffect(() => {
    // Track mounted state
    hasMounted.current = true;
    
    const handleVisibilityChange = () => {
      if (document.hidden && isSimulating) {
        stopSimulation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Only stop on actual unmount, not on effect re-run
      if (hasMounted.current) {
        stopSimulation();
        hasMounted.current = false;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t('simulator.gas.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('simulator.gas.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('simulator.gas.baseFee')}</p>
                <p className="text-2xl font-bold text-primary">{baseFee.toFixed(2)} Gwei</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('simulator.gas.block')}</p>
                <p className="text-2xl font-bold text-foreground">#{blockNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Educational Intro Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Info className="size-5 text-primary" />
              <h3 className="font-semibold">What is Gas?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Gas is the computational fuel for Ethereum. Every operation (storing data, executing code, transferring ETH) consumes gas. It prevents spam and ensures fair resource allocation.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Flame className="size-5 text-orange-500" />
              <h3 className="font-semibold">Why Burn ETH?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              EIP-1559 introduced the base fee burn. This removes ETH from circulation permanently, making it potentially deflationary during high network usage.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Coins className="size-5 text-green-500" />
              <h3 className="font-semibold">Who Gets Paid?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Base fee → BURNED (nobody gets it). Priority fee → Validator (tip for faster inclusion). Block rewards → Validator.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Zap className="size-5 text-yellow-500" />
              <h3 className="font-semibold">Why Pay More?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Each block has a 30M gas limit. When demand exceeds supply, users compete via priority fees. Higher tips = faster inclusion.
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={isSimulating ? stopSimulation : startSimulation}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
                isSimulating
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {isSimulating ? (
                <><Pause className="size-4" /> {t('common.pause')}</>
              ) : (
                <><Play className="size-4" /> {t('simulator.gas.start')}</>
              )}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-muted-foreground hover:bg-secondary"
            >
              <RotateCcw className="size-4" />
              {t('common.reset')}
            </button>
          </div>

          {/* Congestion Slider */}
          <div className="flex items-center gap-4">
            <Activity className="size-5 text-muted-foreground" />
            <div className="w-48">
              <label className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('simulator.gas.congestion')}</span>
                <span className="font-medium">{congestionLevel}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={congestionLevel}
                onChange={(e) => updateCongestion(Number(e.target.value))}
                className="w-full"
                disabled={isSimulating}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Gas Controls */}
          <div className="space-y-6">
            <GasPriceControls
              maxFee={userTx.maxFeePerGas}
              priorityFee={userTx.maxPriorityFeePerGas}
              gasLimit={userTx.gasLimit}
              baseFee={baseFee}
              effectiveGasPrice={effectiveGasPrice}
              onUpdate={updateUserTx}
            />
          </div>

          {/* Center: Mempool */}
          <MempoolQueue
            transactions={pendingTxs}
            userPosition={userPosition}
            userPriorityFee={userTx.maxPriorityFeePerGas}
          />

          {/* Right: Inclusion Estimator */}
          <InclusionEstimator
            position={userPosition}
            estimatedTime={inclusionTime}
            pendingCount={pendingTxs.length}
          />
        </div>

        {/* Education Section */}
        <div className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="size-5 text-primary" />
            {t('simulator.gas.education.title')}
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary/50 p-4">
              <h3 className="mb-2 font-medium text-foreground">{t('simulator.gas.education.baseFee.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('simulator.gas.education.baseFee.description')}
              </p>
            </div>
            
            <div className="rounded-lg bg-secondary/50 p-4">
              <h3 className="mb-2 font-medium text-foreground">{t('simulator.gas.education.priorityFee.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('simulator.gas.education.priorityFee.description')}
              </p>
            </div>
            
            <div className="rounded-lg bg-secondary/50 p-4">
              <h3 className="mb-2 font-medium text-foreground">{t('simulator.gas.education.congestion.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('simulator.gas.education.congestion.description')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
