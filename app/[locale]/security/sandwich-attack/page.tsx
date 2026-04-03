'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  ArrowRight,
  Shield,
  Info,
  RotateCcw,
  Lock,
  History,
  Zap,
  AlertCircle,
  Database,
  User,
  Target,
  Wallet,
  CheckCircle,
  Code2,
} from 'lucide-react';
import { TutorialLayout } from '@/components/layout/tutorial-layout';
import { CodeBlock } from '@/components/ui/code-block';

// Types
interface MempoolTx {
  id: string;
  from: string;
  to: string;
  amount: number;
  gasPrice: number;
  type: 'swap' | 'transfer';
  isUserTx?: boolean;
}

interface SwapStep {
  actor: 'attacker_front' | 'victim' | 'attacker_back';
  type: 'buy' | 'sell';
  amountDAI: number;
  amountETH: number;
  priceImpact: number;
  ethPrice: number;
  gasPrice: number;
}

interface CaseStudy {
  protocol: string;
  date: string;
  loss: string;
  description: string;
  link: string;
}

// Constants
const CASE_STUDIES: CaseStudy[] = [
  {
    protocol: 'Cream Finance',
    date: 'August 2021',
    loss: '$130M',
    description: 'Multiple sandwich attacks on large swaps during liquidity crisis',
    link: 'https://rekt.news/cream-rekt/',
  },
  {
    protocol: 'Sushiswap',
    date: '2020-2023',
    loss: '$100M+ (cumulative)',
    description: 'Ongoing MEV extraction through sandwich bots',
    link: 'https://eigenphi.io/',
  },
];

// Initial pool state
const INITIAL_ETH_RESERVE = 1000;
const INITIAL_DAI_RESERVE = 2500000; // 1000 ETH * $2500 = $2.5M
const INITIAL_ETH_PRICE = INITIAL_DAI_RESERVE / INITIAL_ETH_RESERVE; // $2500

// AMM Pricing Formula: x * y = k (Constant Product)
// Returns: how much ETH received for DAI input, and new pool state
function calculateSwap(daiAmount: number, ethReserve: number, daiReserve: number): {
  ethReceived: number;
  newEthReserve: number;
  newDaiReserve: number;
  newEthPrice: number;
  priceImpact: number;
} {
  const k = ethReserve * daiReserve;
  const newDaiReserve = daiReserve + daiAmount;
  const newEthReserve = k / newDaiReserve;
  const ethReceived = ethReserve - newEthReserve;
  const newEthPrice = newDaiReserve / newEthReserve;
  const oldEthPrice = daiReserve / ethReserve;
  const priceImpact = ((newEthPrice - oldEthPrice) / oldEthPrice) * 100;
  
  return { ethReceived, newEthReserve, newDaiReserve, newEthPrice, priceImpact };
}

// Generate mempool transactions (without user's tx - that appears on send)
function generateMempoolTransactions(): MempoolTx[] {
  const baseGasPrice = 20;
  return [
    { id: '0x1a2b', from: '0x742d...8fA1', to: 'Uniswap', amount: 500, gasPrice: baseGasPrice + 2, type: 'swap' },
    { id: '0x3c4d', from: '0x1234...5678', to: 'SushiSwap', amount: 1200, gasPrice: baseGasPrice + 4, type: 'swap' },
    { id: '0x5e6f', from: '0x9876...5432', to: '0xabcd...ef01', amount: 300, gasPrice: baseGasPrice + 6, type: 'transfer' },
    { id: '0x7g8h', from: '0x2468...1357', to: 'Curve', amount: 2500, gasPrice: baseGasPrice + 3, type: 'swap' },
    { id: '0x9i0j', from: '0x5555...9999', to: 'Balancer', amount: 800, gasPrice: baseGasPrice + 1, type: 'swap' },
    { id: '0xk1l2', from: '0xaaaa...bbbb', to: 'Uniswap', amount: 1500, gasPrice: baseGasPrice + 5, type: 'swap' },
  ];
}

export default function SandwichAttackSimulator() {
  // Mode state
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [perspective, setPerspective] = useState<'victim' | 'attacker'>('victim');
  
  // Simulation state - all tracked internally in ETH/DAI units
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [logs, setLogs] = useState<SwapStep[]>([]);
  const [ethReserve, setEthReserve] = useState<number>(INITIAL_ETH_RESERVE);
  const [daiReserve, setDaiReserve] = useState<number>(INITIAL_DAI_RESERVE);
  
  // Results
  const [attackerProfitETH, setAttackerProfitETH] = useState<number>(0);
  const [victimLossETH, setVictimLossETH] = useState<number>(0);
  
  // External state
  const [mempool, setMempool] = useState<MempoolTx[]>([]);
  const [userTxInMempool, setUserTxInMempool] = useState(false);
  
  // Settings
  const [tradeSize, setTradeSize] = useState<number>(10000);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [attackerGasPrice, setAttackerGasPrice] = useState<number>(25); // Default: attacker has higher gas
  const [victimGasPrice, setVictimGasPrice] = useState<number>(20); // Default: victim has lower gas
  const [useFlashbots, setUseFlashbots] = useState(false);
  const [hasSentTx, setHasSentTx] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [wasSandwiched, setWasSandwiched] = useState(false);

  // Use refs to track current values in callbacks (avoids stale closures)
  const stateRef = useRef({ ethReserve, daiReserve, step, logs, tradeSize, attackerGasPrice, victimGasPrice, useFlashbots, perspective, selectedTarget, mempool, wasSandwiched });
  useEffect(() => {
    stateRef.current = { ethReserve, daiReserve, step, logs, tradeSize, attackerGasPrice, victimGasPrice, useFlashbots, perspective, selectedTarget, mempool, wasSandwiched };
  }, [ethReserve, daiReserve, step, logs, tradeSize, attackerGasPrice, victimGasPrice, useFlashbots, perspective, selectedTarget, mempool, wasSandwiched]);

  // Initialize mempool (without user tx)
  useEffect(() => {
    if (!isRunning && step === 0 && !userTxInMempool) {
      setMempool(generateMempoolTransactions());
    }
  }, [perspective, isRunning, step, userTxInMempool]);

  // Reset simulation completely
  const reset = useCallback(() => {
    setIsRunning(false);
    setStep(0);
    setLogs([]);
    setEthReserve(INITIAL_ETH_RESERVE);
    setDaiReserve(INITIAL_DAI_RESERVE);
    setAttackerProfitETH(0);
    setVictimLossETH(0);
    setWasSandwiched(false);
    setMempool(generateMempoolTransactions());
    setUserTxInMempool(false);
    setUseFlashbots(false);
    setHasSentTx(false);
    setSelectedTarget(null);
  }, []);

  // Get current ETH price
  const getEthPrice = () => daiReserve / ethReserve;

  // Execute single step with fresh state
  const executeStep = useCallback(() => {
    const state = stateRef.current;
    const currentEthPrice = state.daiReserve / state.ethReserve;
    
    // VICTIM PERSPECTIVE
    if (state.perspective === 'victim') {
      // Flashbots protection - transaction goes through private mempool
      if (state.useFlashbots && state.step === 0) {
        const result = calculateSwap(state.tradeSize, state.ethReserve, state.daiReserve);
        
        setEthReserve(result.newEthReserve);
        setDaiReserve(result.newDaiReserve);
        
        // With Flashbots, no sandwich attack happens - victim just gets normal slippage
        // We consider "loss" as the extra slippage beyond ideal (but it's minimal with Flashbots)
        const idealEth = state.tradeSize / INITIAL_ETH_PRICE;
        const actualSlippageLoss = idealEth - result.ethReceived;
        setVictimLossETH(Math.max(0, actualSlippageLoss));
        setWasSandwiched(false);
        
        setLogs([{
          actor: 'victim',
          type: 'buy',
          amountDAI: state.tradeSize,
          amountETH: result.ethReceived,
          priceImpact: result.priceImpact,
          ethPrice: result.newEthPrice,
          gasPrice: state.victimGasPrice,
        }]);
        setStep(3);
        setIsRunning(false);
        return;
      }

      // PUBLIC MEMPOOL - Sandwich attack possible
      if (state.step === 0) {
        // If victim has strictly higher gas price, they go first and no sandwich possible
        if (state.victimGasPrice > state.attackerGasPrice) {
          const result = calculateSwap(state.tradeSize, state.ethReserve, state.daiReserve);
          
          setEthReserve(result.newEthReserve);
          setDaiReserve(result.newDaiReserve);
          
          // Calculate loss from slippage only (no sandwich since went first)
          const idealEth = state.tradeSize / INITIAL_ETH_PRICE;
          const slippageLoss = idealEth - result.ethReceived;
          setVictimLossETH(Math.max(0, slippageLoss));
          setWasSandwiched(false);
          
          setLogs([{
            actor: 'victim',
            type: 'buy',
            amountDAI: state.tradeSize,
            amountETH: result.ethReceived,
            priceImpact: result.priceImpact,
            ethPrice: result.newEthPrice,
            gasPrice: state.victimGasPrice,
          }]);
          setStep(3);
          setIsRunning(false);
          return;
        }

        // Attacker front-runs with 30% of victim's DAI amount
        const frontRunDai = state.tradeSize * 0.3;
        const frontRunResult = calculateSwap(frontRunDai, state.ethReserve, state.daiReserve);
        
        setEthReserve(frontRunResult.newEthReserve);
        setDaiReserve(frontRunResult.newDaiReserve);
        setWasSandwiched(true);
        
        setLogs([{
          actor: 'attacker_front',
          type: 'buy',
          amountDAI: frontRunDai,
          amountETH: frontRunResult.ethReceived,
          priceImpact: frontRunResult.priceImpact,
          ethPrice: frontRunResult.newEthPrice,
          gasPrice: state.attackerGasPrice,
        }]);
        setStep(1);
        
      } else if (state.step === 1) {
        // Victim executes (sandwiched) - after front-run pumped the price
        const result = calculateSwap(state.tradeSize, state.ethReserve, state.daiReserve);
        
        setEthReserve(result.newEthReserve);
        setDaiReserve(result.newDaiReserve);
        
        // Calculate loss: what victim SHOULD have gotten vs what they ACTUALLY got
        const idealEth = state.tradeSize / INITIAL_ETH_PRICE; // ETH at original price
        const sandwichLoss = idealEth - result.ethReceived; // Extra ETH they lost due to sandwich
        setVictimLossETH(Math.max(0, sandwichLoss));
        
        setLogs(prev => [...prev, {
          actor: 'victim',
          type: 'buy',
          amountDAI: state.tradeSize,
          amountETH: result.ethReceived,
          priceImpact: result.priceImpact,
          ethPrice: result.newEthPrice,
          gasPrice: state.victimGasPrice,
        }]);
        setStep(2);
        
      } else if (state.step === 2) {
        // Attacker back-runs - sells ETH at pumped price
        const backRunDai = state.tradeSize * 0.3;
        const backRunResult = calculateSwap(backRunDai, state.ethReserve, state.daiReserve);
        
        // Find attacker's front-run ETH amount from logs
        const frontRunLog = state.logs.find(l => l.actor === 'attacker_front');
        const ethBought = frontRunLog?.amountETH || 0;
        const ethSold = backRunResult.ethReceived;
        
        // Profit in ETH = ETH received from selling - ETH paid for buying
        // Actually, we need to calculate differently:
        // Attacker spent frontRunDai DAI to get ethBought ETH
        // Then sells ethBought ETH to get back DAI
        const backRunForSameEth = calculateSwap(ethBought * currentEthPrice, state.ethReserve, state.daiReserve);
        
        setEthReserve(backRunResult.newEthReserve);
        setDaiReserve(backRunResult.newDaiReserve);
        
        // Attacker's profit: (DAI received from sell - DAI spent on buy) / ETH price
        const profitETH = (backRunResult.ethReceived - ethBought);
        setAttackerProfitETH(Math.max(0, -profitETH)); // Profit is positive
        
        setLogs(prev => [...prev, {
          actor: 'attacker_back',
          type: 'sell',
          amountDAI: backRunDai,
          amountETH: backRunResult.ethReceived,
          priceImpact: backRunResult.priceImpact,
          ethPrice: backRunResult.newEthPrice,
          gasPrice: state.attackerGasPrice - 1,
        }]);
        setStep(3);
        setIsRunning(false);
      }
    }
    
    // ATTACKER PERSPECTIVE
    else if (state.perspective === 'attacker') {
      const targetTx = state.mempool.find(tx => tx.id === state.selectedTarget);
      const targetDaiAmount = targetTx?.amount || 10000;
      const targetGasPrice = targetTx?.gasPrice || 20;
      
      if (state.step === 0) {
        // Check if attacker can actually front-run (needs strictly higher gas)
        if (state.attackerGasPrice <= targetGasPrice) {
          // Attack fails - victim has higher or equal gas
          const result = calculateSwap(targetDaiAmount, state.ethReserve, state.daiReserve);
          
          setEthReserve(result.newEthReserve);
          setDaiReserve(result.newDaiReserve);
          
          // No profit - victim got mined first
          setAttackerProfitETH(0);
          setWasSandwiched(false);
          
          setLogs([{
            actor: 'victim',
            type: 'buy',
            amountDAI: targetDaiAmount,
            amountETH: result.ethReceived,
            priceImpact: result.priceImpact,
            ethPrice: result.newEthPrice,
            gasPrice: targetGasPrice,
          }]);
          setStep(3);
          setIsRunning(false);
          return;
        }
        
        // Attacker front-runs with strictly higher gas
        const frontRunDai = targetDaiAmount * 0.3;
        const result = calculateSwap(frontRunDai, state.ethReserve, state.daiReserve);
        
        setEthReserve(result.newEthReserve);
        setDaiReserve(result.newDaiReserve);
        setWasSandwiched(true);
        
        setLogs([{
          actor: 'attacker_front',
          type: 'buy',
          amountDAI: frontRunDai,
          amountETH: result.ethReceived,
          priceImpact: result.priceImpact,
          ethPrice: result.newEthPrice,
          gasPrice: state.attackerGasPrice,
        }]);
        setStep(1);
        
      } else if (state.step === 1) {
        // Victim executes (sandwiched)
        const result = calculateSwap(targetDaiAmount, state.ethReserve, state.daiReserve);
        
        setEthReserve(result.newEthReserve);
        setDaiReserve(result.newDaiReserve);
        
        setLogs(prev => [...prev, {
          actor: 'victim',
          type: 'buy',
          amountDAI: targetDaiAmount,
          amountETH: result.ethReceived,
          priceImpact: result.priceImpact,
          ethPrice: result.newEthPrice,
          gasPrice: targetGasPrice,
        }]);
        setStep(2);
        
      } else if (state.step === 2) {
        // Attacker closes position
        const backRunDai = targetDaiAmount * 0.3;
        const result = calculateSwap(backRunDai, state.ethReserve, state.daiReserve);
        
        const frontRunLog = state.logs.find(l => l.actor === 'attacker_front');
        const ethBought = frontRunLog?.amountETH || 0;
        
        setEthReserve(result.newEthReserve);
        setDaiReserve(result.newDaiReserve);
        
        // Profit = ETH sold - ETH bought
        const profitETH = result.ethReceived - ethBought;
        setAttackerProfitETH(Math.max(0, -profitETH));
        
        setLogs(prev => [...prev, {
          actor: 'attacker_back',
          type: 'sell',
          amountDAI: backRunDai,
          amountETH: result.ethReceived,
          priceImpact: result.priceImpact,
          ethPrice: result.newEthPrice,
          gasPrice: state.attackerGasPrice - 1,
        }]);
        setStep(3);
        setIsRunning(false);
      }
    }
  }, []);

  // Auto-run effect
  useEffect(() => {
    if (isRunning && step < 3) {
      const timer = setTimeout(() => {
        executeStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isRunning, step, executeStep]);

  // Send transaction (victim perspective)
  const sendTransaction = () => {
    setHasSentTx(true);
    setUserTxInMempool(true);
    // Add user tx to mempool
    setMempool(prev => [{
      id: 'USER-TX',
      from: 'YOU',
      to: 'Uniswap V3',
      amount: tradeSize,
      gasPrice: victimGasPrice,
      type: 'swap',
      isUserTx: true,
    }, ...prev]);
    setIsRunning(true);
  };

  // Execute attack (attacker perspective)
  const executeAttack = () => {
    if (!selectedTarget) return;
    setIsRunning(true);
  };

  // Get current ETH price for display
  const currentEthPrice = getEthPrice();

  // Get status message
  const getStatusMessage = () => {
    if (step === 0 && !isRunning) {
      if (perspective === 'attacker' && !selectedTarget) {
        return '👆 Select a target transaction from the mempool';
      }
      return perspective === 'victim' 
        ? 'Ready - Configure your swap and send it' 
        : 'Ready - Select a target to attack';
    }
    if (step === 0 && isRunning) return perspective === 'victim' ? 'Sending to mempool...' : 'Executing attack...';
    if (step === 1) return '🔴 Attacker front-running...';
    if (step === 2) return '🟠 Your transaction executing...';
    if (step === 3) {
      if (!wasSandwiched) {
        return useFlashbots 
          ? '✅ Protected! Transaction sent privately via Flashbots.'
          : '✅ Safe! High gas price prevented the attack.';
      }
      if (perspective === 'attacker') return `💰 Profit: ${attackerProfitETH.toFixed(4)} ETH ($${(attackerProfitETH * currentEthPrice).toFixed(2)})`;
      return `⚠️ Sandwiched! Lost ${victimLossETH.toFixed(4)} ETH ($${(victimLossETH * currentEthPrice).toFixed(2)})`;
    }
    return '';
  };

  // Calculate attacker profit estimate for mempool display
  const getProfitEstimate = (txAmount: number, txGasPrice: number) => {
    const frontRunDai = txAmount * 0.3;
    const frontRunResult = calculateSwap(frontRunDai, INITIAL_ETH_RESERVE, INITIAL_DAI_RESERVE);
    
    // Simulate victim trade
    const victimResult = calculateSwap(txAmount, frontRunResult.newEthReserve, frontRunResult.newDaiReserve);
    
    // Simulate attacker sell
    const backRunResult = calculateSwap(frontRunDai, victimResult.newEthReserve, victimResult.newDaiReserve);
    
    const ethBought = frontRunResult.ethReceived;
    const ethSold = backRunResult.ethReceived;
    const profitETH = ethSold - ethBought;
    const profitUSD = profitETH * victimResult.newEthPrice;
    
    // Gas cost estimate (2 transactions at 150k gas each)
    const gasCostETH = (2 * 150000 * txGasPrice) / 1e9;
    const gasCostUSD = gasCostETH * victimResult.newEthPrice;
    
    const netProfitUSD = profitUSD - gasCostUSD;
    
    return { profitUSD, gasCostUSD, netProfitUSD, isProfitable: netProfitUSD > 0 };
  };

  return (
    <TutorialLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Sandwich Attack Simulator</h1>
                  <p className="text-sm text-muted-foreground">
                    {perspective === 'victim' ? 'Experience getting sandwiched on a DEX trade' : 'Learn how MEV bots profit from your trades'}
                  </p>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-1">
                  <button
                    onClick={() => { setMode('beginner'); setPerspective('victim'); reset(); }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mode === 'beginner' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    onClick={() => setMode('advanced')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mode === 'advanced' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
                
                {/* Perspective Toggle (Advanced only) */}
                {mode === 'advanced' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-1"
                  >
                    <button
                      onClick={() => { setPerspective('victim'); reset(); }}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        perspective === 'victim' 
                          ? 'bg-blue-500 text-white' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <User className="size-3" />
                      Victim
                    </button>
                    <button
                      onClick={() => { setPerspective('attacker'); reset(); }}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        perspective === 'attacker' 
                          ? 'bg-red-500 text-white' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Target className="size-3" />
                      Attacker
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Controls & Settings */}
            <div className="space-y-4">
              {/* Your Transaction */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 font-semibold flex items-center gap-2">
                  <Wallet className="size-4 text-primary" />
                  {perspective === 'victim' ? 'Your Swap' : 'Attack Parameters'}
                </h2>
                
                <div className="space-y-4">
                  {perspective === 'victim' && (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-mono">Your Wallet</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">To</span>
                        <span className="font-mono">Uniswap V3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Action</span>
                        <span>DAI → ETH</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Trade Size - Only for Victim Perspective */}
                  {perspective === 'victim' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Amount to Swap (DAI)
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={tradeSize}
                        onChange={(e) => setTradeSize(Number(e.target.value))}
                        disabled={isRunning}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>1K</span>
                        <span className="font-medium text-foreground">{tradeSize.toLocaleString()} DAI</span>
                        <span>50K</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Attacker Hint - Only for Attacker Perspective */}
                  {perspective === 'attacker' && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-sm text-red-700 font-medium mb-1">
                        Select a Target
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click on a transaction in the mempool to attack. Larger trades = more profit potential.
                      </p>
                    </div>
                  )}

                  {/* Gas Price Controls */}
                  {mode === 'advanced' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2 border-t border-border"
                    >
                      {perspective === 'victim' && (
                        <div>
                          <label className="mb-2 block text-sm font-medium flex items-center gap-2">
                            <Zap className="size-3 text-blue-500" />
                            Your Gas Price (Gwei)
                          </label>
                          <input
                            type="range"
                            min="15"
                            max="50"
                            step="1"
                            value={victimGasPrice}
                            onChange={(e) => setVictimGasPrice(Number(e.target.value))}
                            disabled={isRunning}
                            className="w-full accent-blue-500"
                          />
                          <div className="mt-1 flex justify-between text-xs">
                            <span className="text-muted-foreground">15</span>
                            <span className="font-medium text-blue-500">{victimGasPrice} Gwei</span>
                            <span className="text-muted-foreground">50</span>
                          </div>
                          {victimGasPrice > attackerGasPrice && (
                            <p className="text-xs text-green-600 mt-1">
                              ✅ Your gas is higher - you&apos;ll be mined first!
                            </p>
                          )}
                          {victimGasPrice < attackerGasPrice && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Attacker has higher gas - you may get sandwiched!
                            </p>
                          )}
                          {victimGasPrice === attackerGasPrice && (
                            <p className="text-xs text-yellow-600 mt-1">
                              ⚡ Same gas price - attacker wins ties!
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="mb-2 block text-sm font-medium text-red-500 flex items-center gap-2">
                          <Target className="size-3" />
                          Attacker Gas Price (Gwei)
                        </label>
                        <input
                          type="range"
                          min="15"
                          max="50"
                          step="1"
                          value={attackerGasPrice}
                          onChange={(e) => setAttackerGasPrice(Number(e.target.value))}
                          disabled={isRunning}
                          className="w-full accent-red-500"
                        />
                        <div className="mt-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">15</span>
                          <span className="font-medium text-red-500">{attackerGasPrice} Gwei</span>
                          <span className="text-muted-foreground">50</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Button */}
                  <div className="flex gap-2 pt-2">
                    {perspective === 'victim' ? (
                      <button
                        onClick={sendTransaction}
                        disabled={isRunning || userTxInMempool}
                        className="flex-1 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                      >
                        <ArrowRight className="size-4" />
                        {userTxInMempool ? 'Transaction Sent' : isRunning ? 'Processing...' : 'Send Transaction'}
                      </button>
                    ) : (
                      <button
                        onClick={executeAttack}
                        disabled={isRunning || !selectedTarget}
                        className="flex-1 rounded-lg bg-red-500 px-4 py-3 font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                      >
                        <Target className="size-4" />
                        {isRunning ? 'Attacking...' : selectedTarget ? 'Execute Attack' : 'Select Target First'}
                      </button>
                    )}
                    <button
                      onClick={reset}
                      className="rounded-lg border border-border px-4 py-3 text-muted-foreground hover:bg-secondary"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Flashbots Protection (Advanced + Victim only) */}
              {mode === 'advanced' && perspective === 'victim' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border p-5 transition-colors ${
                    useFlashbots 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : 'border-border bg-card'
                  }`}
                >
                  <button
                    onClick={() => !isRunning && setUseFlashbots(!useFlashbots)}
                    disabled={isRunning}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className={`size-5 ${useFlashbots ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Flashbots Protect</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      useFlashbots 
                        ? 'bg-green-500 text-white' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {useFlashbots ? 'ON' : 'OFF'}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {useFlashbots && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden"
                      >
                        <div className="flex items-start gap-2 text-sm">
                          <Lock className="size-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Private mempool - attackers cannot see your tx</span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Slippage Limit: {slippage}%
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={slippage}
                            onChange={(e) => setSlippage(Number(e.target.value))}
                            disabled={isRunning}
                            className="w-full"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Live Stats */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 font-semibold">Pool Status</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ETH Price</span>
                    <span className="font-mono font-medium">${currentEthPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">ETH in Pool</span>
                    <span className="font-mono">{ethReserve.toFixed(2)} ETH</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">DAI in Pool</span>
                    <span className="font-mono">{daiReserve.toLocaleString()} DAI</span>
                  </div>
                  
                  {wasSandwiched && perspective === 'victim' && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex justify-between items-center text-red-500">
                        <span className="text-sm font-medium">Your Loss</span>
                        <span className="font-mono font-bold">{victimLossETH.toFixed(4)} ETH</span>
                      </div>
                      <p className="text-xs text-red-600 text-right">
                        (${(victimLossETH * currentEthPrice).toFixed(2)})
                      </p>
                    </div>
                  )}
                  
                  {!wasSandwiched && perspective === 'victim' && (
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex justify-between items-center text-green-500">
                        <span className="text-sm font-medium">Status</span>
                        <span className="font-mono font-bold text-sm">Protected</span>
                      </div>
                    </div>
                  )}
                  
                  {perspective === 'attacker' && attackerProfitETH > 0 && (
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex justify-between items-center text-green-500">
                        <span className="text-sm font-medium">Your Profit</span>
                        <span className="font-mono font-bold">{attackerProfitETH.toFixed(4)} ETH</span>
                      </div>
                      <p className="text-xs text-green-600 text-right">
                        (${(attackerProfitETH * currentEthPrice).toFixed(2)})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Visualization */}
            <div className="space-y-4">
              {/* Mempool Visualization */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 font-semibold flex items-center gap-2">
                  <Database className="size-4 text-primary" />
                  {useFlashbots && userTxInMempool ? 'Private Mempool (Flashbots)' : 'Public Mempool'}
                </h2>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {/* User's Transaction (only after sending) */}
                  {perspective === 'victim' && userTxInMempool && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg border-2 p-3 text-sm ${
                        useFlashbots
                          ? 'bg-green-500/10 border-green-500'
                          : 'bg-blue-500/10 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className={`size-4 ${useFlashbots ? 'text-green-500' : 'text-blue-500'}`} />
                          <span className="font-bold text-xs">YOUR TX</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          useFlashbots
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {useFlashbots ? '🔒 PRIVATE' : '🔓 PUBLIC'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">{tradeSize.toLocaleString()} DAI → ETH</span>
                        <span className="text-sm font-bold text-muted-foreground">
                          {victimGasPrice} Gwei
                        </span>
                      </div>
                      {!useFlashbots && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Visible to MEV bots!
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Other Mempool Txs */}
                  {mempool.filter(tx => !tx.isUserTx).map((tx) => {
                    const isSelected = selectedTarget === tx.id;
                    const estimate = getProfitEstimate(tx.amount, tx.gasPrice);
                    
                    return (
                      <motion.div
                        key={tx.id}
                        onClick={() => perspective === 'attacker' && step === 0 && setSelectedTarget(tx.id)}
                        className={`rounded-lg border p-2 text-sm cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500/50'
                            : perspective === 'attacker' && step === 0
                              ? 'bg-secondary/20 border-border hover:bg-secondary/40'
                              : 'bg-secondary/20 border-border'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs text-muted-foreground">{tx.from}</span>
                          <div className="flex items-center gap-1">
                            {perspective === 'attacker' && step === 0 && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                estimate.isProfitable ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'
                              }`}>
                                {estimate.isProfitable ? '💰 +' + estimate.netProfitUSD.toFixed(1) : '❌ ' + estimate.netProfitUSD.toFixed(1)}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">{tx.to}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-medium">{tx.amount.toLocaleString()} DAI</span>
                          <span className="text-xs text-muted-foreground">{tx.gasPrice} Gwei</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {perspective === 'victim' && !userTxInMempool && (
                  <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-dashed border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Your transaction will appear here after you click &quot;Send Transaction&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Block Builder Visualization */}
              <div className="rounded-xl border-2 border-border bg-card p-5">
                <h2 className="mb-4 font-semibold flex items-center gap-2">
                  <div className="size-6 rounded bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">B</span>
                  </div>
                  Block #{step > 0 ? '18,420,691' : 'Pending...'}
                </h2>
                
                <div className="relative">
                  {/* Block container */}
                  <div className={`rounded-lg border-2 p-4 ${
                    logs.length > 0 
                      ? 'bg-secondary border-border' 
                      : 'bg-secondary/20 border-dashed border-border'
                  }`}>
                    {/* Block header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                      <span className="text-xs text-muted-foreground">Transactions by gas price</span>
                      <span className="text-xs text-muted-foreground">
                        {logs.length > 0 ? `${logs.length} txns` : 'Empty'}
                      </span>
                    </div>
                    
                    {/* Transactions in block order */}
                    <div className="space-y-2">
                      {logs.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                          <p>Block is empty</p>
                          <p className="text-xs mt-1">Transactions will be ordered here</p>
                        </div>
                      ) : (
                        logs.map((log, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className={`rounded p-2.5 border-l-4 ${
                              log.actor === 'attacker_front' 
                                ? 'bg-red-500/10 border-l-red-500' 
                                : log.actor === 'victim'
                                ? 'bg-orange-500/10 border-l-orange-500'
                                : 'bg-red-400/10 border-l-red-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                  {index + 1}
                                </span>
                                <span className={`text-xs font-medium ${
                                  log.actor === 'attacker_front' 
                                    ? 'text-red-500' 
                                    : log.actor === 'victim'
                                    ? 'text-orange-500'
                                    : 'text-red-400'
                                }`}>
                                  {log.actor === 'attacker_front' && '🔴 Attacker (Front)'}
                                  {log.actor === 'victim' && (perspective === 'victim' ? '🟠 You' : '🟠 Victim')}
                                  {log.actor === 'attacker_back' && '🔴 Attacker (Back)'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-medium">{log.gasPrice} Gwei</span>
                              </div>
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                              <span>{log.amountDAI.toLocaleString()} DAI → {log.amountETH.toFixed(4)} ETH</span>
                              <span>+{(log.priceImpact).toFixed(2)}% price</span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    
                    {/* Block footer with result */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-3 pt-3 border-t text-center text-xs ${
                          !wasSandwiched
                            ? 'border-green-400 text-green-600'
                            : 'border-red-400 text-red-600'
                        }`}
                      >
                        {!wasSandwiched
                          ? '✅ Block sealed safely - no attack occurred'
                          : '⚠️ Sandwich attack confirmed in block'}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Gas price indicator arrow */}
                  {logs.length > 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="text-[10px] text-muted-foreground rotate-90 whitespace-nowrap">
                        High gas →
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Education */}
            <div className="space-y-4">
              {/* Attack Result - Prominent display at top of right column */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-xl border-2 p-5 ${
                    !wasSandwiched
                      ? 'bg-green-500/10 border-green-500' 
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {!wasSandwiched ? (
                      <>
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-500/20">
                          <CheckCircle className="size-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-bold text-green-700">
                            {perspective === 'attacker'
                              ? 'Attack Failed'
                              : useFlashbots ? 'Protected by Flashbots!' : 'High Gas Saved You!'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {perspective === 'attacker'
                              ? 'Victim had higher gas — no front-run possible'
                              : 'No sandwich attack occurred'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-500/20">
                          <AlertTriangle className="size-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-bold text-red-700">
                            You Got Sandwiched!
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MEV bot extracted value from your trade
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {wasSandwiched && perspective === 'victim' && (
                      <div className="flex justify-between items-center p-2 rounded bg-red-500/10">
                        <span className="text-sm text-red-700 font-medium">Your Loss</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-red-700 block">{victimLossETH.toFixed(4)} ETH</span>
                          <span className="text-xs text-red-600">(${ (victimLossETH * currentEthPrice).toFixed(2) })</span>
                        </div>
                      </div>
                    )}
                    
                    {!wasSandwiched && perspective === 'victim' && (
                      <div className="flex justify-between items-center p-2 rounded bg-green-500/10">
                        <span className="text-sm text-green-700 font-medium">Amount Saved</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-green-700 block">Protected</span>
                          <span className="text-xs text-green-600">{useFlashbots ? 'Private mempool' : 'Gas priority'}</span>
                        </div>
                      </div>
                    )}
                    
                    {wasSandwiched && perspective === 'attacker' && (
                      <div className="flex justify-between items-center p-2 rounded bg-green-500/10">
                        <span className="text-sm text-green-700 font-medium">Your Profit</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-green-700 block">{attackerProfitETH.toFixed(4)} ETH</span>
                          <span className="text-xs text-green-600">(${ (attackerProfitETH * currentEthPrice).toFixed(2) })</span>
                        </div>
                      </div>
                    )}
                    
                    {!wasSandwiched && perspective === 'attacker' && (
                      <div className="flex justify-between items-center p-2 rounded bg-yellow-500/10">
                        <span className="text-sm text-yellow-700 font-medium">Result</span>
                        <span className="font-mono font-bold text-yellow-700">No profit — victim went first</span>
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs mt-3 ${
                    !wasSandwiched
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    {perspective === 'victim' && !wasSandwiched && useFlashbots
                      ? "Your transaction was sent privately via Flashbots, bypassing the public mempool entirely. No attacker could see or front-run your trade."
                      : perspective === 'victim' && !wasSandwiched && !useFlashbots
                        ? "Your gas bid was higher than the attacker's, so your transaction was mined first. The sandwich attack was prevented — you only paid normal DEX slippage."
                        : perspective === 'victim' && wasSandwiched
                          ? "The attacker bought ETH before you (pushing the price up), forcing you to pay more. Then they sold at your inflated price, extracting value from your trade."
                          : perspective === 'attacker' && wasSandwiched
                            ? "You front-ran the victim to pump the ETH price, then sold after them to capture the spread. This is how MEV bots profit from public DEX trades."
                            : "The victim's gas price was higher than yours, so they were mined first. Without front-running, you couldn't manipulate the price — no profit possible."}
                  </p>
                </motion.div>
              )}

              {/* What is Sandwich Attack */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-3 font-semibold flex items-center gap-2">
                  <Info className="size-4 text-primary" />
                  How It Works
                </h2>
                
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    A sandwich attack exploits DEX price slippage. The attacker &quot;sandwiches&quot; 
                    your trade between two of their own:
                  </p>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-bold text-red-500">1.</span>
                      <span><strong>Attacker buys</strong> ETH first, pushing the price up</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">2.</span>
                      <span><strong>You buy</strong> ETH at the inflated price (paying more)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-700">3.</span>
                      <span><strong>Attacker sells</strong> ETH at the pumped price (profit!)</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Protection Strategies */}
              {perspective === 'victim' && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
                  <h2 className="mb-3 font-semibold flex items-center gap-2 text-green-700">
                    <Shield className="size-4" />
                    How to Protect Yourself
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Lock className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Flashbots:</strong> Send privately, skip public mempool</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Higher gas:</strong> Outbid attackers to go first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Low slippage:</strong> Reject if price moves too much</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Below Simulator: Reference Sections */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Deep Dive</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* AMM Formula Code Block */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-3 font-semibold flex items-center gap-2">
                  <Code2 className="size-4 text-primary" />
                  AMM Math: x * y = k
                </h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  Uniswap V2 uses a constant product formula. The attacker exploits this:
                </p>
                <CodeBlock
                  code={`// Constant Product AMM: x * y = k
// x = ETH reserve, y = DAI reserve

k = ethReserve * daiReserve;  // k is constant
newDaiReserve = daiReserve + daiInput;
newEthReserve = k / newDaiReserve;
ethReceived = ethReserve - newEthReserve;

// Price impact calculation
oldPrice = daiReserve / ethReserve;
newPrice = newDaiReserve / newEthReserve;
priceImpact = (newPrice - oldPrice) / oldPrice * 100;

// Example: 1000 ETH, 2,500,000 DAI pool
// k = 2,500,000,000
// Buy 10,000 DAI → get 3.984 ETH (price: $2,510/ETH)
// Without attack: 4.000 ETH (price: $2,500/ETH)
// Loss: 0.016 ETH ($40) from slippage manipulation`}
                  language="javascript"
                  title="Uniswap V2 AMM Formula"
                />
              </div>

              {/* Real Cases */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-3 font-semibold flex items-center gap-2">
                  <History className="size-4 text-primary" />
                  Real Attacks
                </h2>
                <div className="space-y-3">
                  {CASE_STUDIES.map((study, index) => (
                    <div key={index} className="rounded-lg border border-border p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{study.protocol}</span>
                        <span className="text-xs text-red-500 font-bold">{study.loss}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{study.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TutorialLayout>
  );
}
