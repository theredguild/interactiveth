'use client';

import { useTranslations } from 'next-intl';
import { Flame, AlertCircle } from 'lucide-react';

interface GasPriceControlsProps {
  maxFee: number;
  priorityFee: number;
  gasLimit: number;
  baseFee: number;
  effectiveGasPrice: number;
  onUpdate: (updates: { maxFeePerGas?: number; maxPriorityFeePerGas?: number; gasLimit?: number }) => void;
}

export function GasPriceControls({
  maxFee,
  priorityFee,
  gasLimit,
  baseFee,
  effectiveGasPrice,
  onUpdate,
}: GasPriceControlsProps) {
  const t = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{t('simulator.gas.controls.title')}</h2>
      
      <div className="space-y-4">
        {/* Max Fee Per Gas */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('simulator.gas.controls.maxFee')}</span>
            <span className="font-medium">{maxFee.toFixed(2)} Gwei</span>
          </label>
          <input
            type="range"
            min={5}
            max={100}
            step={0.5}
            value={maxFee}
            onChange={(e) => onUpdate({ maxFeePerGas: Number(e.target.value) })}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {t('simulator.gas.controls.maxFeeHint')}
          </p>
          {maxFee < baseFee && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="size-3" />
              <span>Max fee below base fee - tx may not execute</span>
            </div>
          )}
        </div>

        {/* Priority Fee */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('simulator.gas.controls.priorityFee')}</span>
            <span className="font-medium">{priorityFee.toFixed(2)} Gwei</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={20}
            step={0.1}
            value={priorityFee}
            onChange={(e) => onUpdate({ maxPriorityFeePerGas: Number(e.target.value) })}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {t('simulator.gas.controls.priorityFeeHint')}
          </p>
        </div>

        {/* Gas Limit */}
        <div>
          <label className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('simulator.gas.controls.gasLimit')}</span>
            <span className="font-medium">{gasLimit.toLocaleString()}</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ gasLimit: 21000 })}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                gasLimit === 21000 ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {t('simulator.gas.controls.transfer')}
            </button>
            <button
              onClick={() => onUpdate({ gasLimit: 150000 })}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                gasLimit === 150000 ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {t('simulator.gas.controls.contract')}
            </button>
          </div>
        </div>

        {/* Effective Price Summary */}
        <div className="mt-4 rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Flame className="size-4 text-orange-500" />
            <span className="text-muted-foreground">{t('simulator.gas.controls.effectivePrice')}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {effectiveGasPrice.toFixed(2)} Gwei
          </p>
          <p className="text-xs text-muted-foreground">
            {t('simulator.gas.controls.totalCost', { cost: ((effectiveGasPrice * gasLimit) / 1e9).toFixed(6) })}
          </p>
        </div>
      </div>
    </div>
  );
}
