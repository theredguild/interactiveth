'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface MempoolTransaction {
  id: string;
  from: string;
  to: string;
  value: number;
  gasLimit: number;
  gasPrice: number;
  priorityFee: number;
  type: 'transfer' | 'contract' | 'defi';
  timestamp: number;
}

export interface SelectedTransaction extends MempoolTransaction {
  order: number;
}

const TX_TYPES = ['transfer', 'contract', 'defi'] as const;
const WALLET_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];

function generateAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

function createRandomTransaction(index: number): MempoolTransaction {
  const type = TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)];
  const gasLimit = type === 'contract' ? 150000 : type === 'defi' ? 200000 : 21000;
  const baseGasPrice = Math.floor(Math.random() * 50) + 10;
  const priorityFee = Math.floor(Math.random() * 30) + 1;
  
  return {
    id: `tx-${Date.now()}-${index}`,
    from: generateAddress(),
    to: generateAddress(),
    value: Math.floor(Math.random() * 5 * 100) / 100 + 0.1,
    gasLimit,
    gasPrice: baseGasPrice + priorityFee,
    priorityFee,
    type,
    timestamp: Date.now() - Math.floor(Math.random() * 60000),
  };
}

const GAS_LIMIT = 30000000; // 30M gas
const BLOCK_TIME = 12000; // 12 seconds in ms
const OPTIMAL_TX_COUNT = 150; // Target for a full block

export function useValidatorSimulation() {
  const [mempool, setMempool] = useState<MempoolTransaction[]>([]);
  const [selectedTxs, setSelectedTxs] = useState<SelectedTransaction[]>([]);
  const [gasUsed, setGasUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(BLOCK_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [blockNumber, setBlockNumber] = useState(1);
  const [totalRewards, setTotalRewards] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mempoolRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize mempool with random transactions
  const initializeMempool = useCallback(() => {
    const initialTxs = Array.from({ length: 20 }, (_, i) => createRandomTransaction(i));
    // Sort by gas price (highest first)
    initialTxs.sort((a, b) => b.gasPrice - a.gasPrice);
    setMempool(initialTxs);
  }, []);

  // Add new transactions to mempool periodically
  const startMempoolFeed = useCallback(() => {
    if (mempoolRef.current) clearInterval(mempoolRef.current);
    
    mempoolRef.current = setInterval(() => {
      setMempool(prev => {
        if (prev.length >= 50) return prev; // Cap at 50 txs
        const newTx = createRandomTransaction(prev.length);
        const updated = [...prev, newTx].sort((a, b) => b.gasPrice - a.gasPrice);
        return updated;
      });
    }, 2000);
  }, []);

  // Start the block building round
  const startRound = useCallback(() => {
    setIsPlaying(true);
    setIsCompleted(false);
    setTimeRemaining(BLOCK_TIME);
    setSelectedTxs([]);
    setGasUsed(0);
    setScore(0);
    initializeMempool();
    startMempoolFeed();

    // Start countdown timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          // Time's up - auto-complete
          completeBlock();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }, [initializeMempool, startMempoolFeed]);

  // Complete the block and calculate score
  const completeBlock = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mempoolRef.current) clearInterval(mempoolRef.current);
    
    setIsPlaying(false);
    setIsCompleted(true);
    
    // Calculate rewards (simplified)
    const baseReward = 2; // 2 ETH base
    const feeReward = selectedTxs.reduce((sum, tx) => 
      sum + (tx.gasLimit * tx.priorityFee) / 1e9, 0
    );
    const totalReward = baseReward + feeReward;
    
    setTotalRewards(prev => prev + totalReward);
    
    // Calculate score based on:
    // - Gas utilization (target 80-100%)
    // - Number of transactions
    // - Average priority fee
    const gasUtilization = gasUsed / GAS_LIMIT;
    const txCount = selectedTxs.length;
    const avgPriorityFee = txCount > 0 
      ? selectedTxs.reduce((sum, tx) => sum + tx.priorityFee, 0) / txCount 
      : 0;
    
    let roundScore = 0;
    if (gasUtilization >= 0.8) roundScore += 500;
    else if (gasUtilization >= 0.5) roundScore += 300;
    else roundScore += 100;
    
    roundScore += txCount * 10;
    roundScore += avgPriorityFee * 5;
    
    setScore(Math.round(roundScore));
    setBlockNumber(prev => prev + 1);
  }, [gasUsed, selectedTxs]);

  // Add transaction to block
  const addTransaction = useCallback((tx: MempoolTransaction) => {
    if (!isPlaying || isCompleted) return;
    if (gasUsed + tx.gasLimit > GAS_LIMIT) return; // Would exceed gas limit
    
    setSelectedTxs(prev => [...prev, { ...tx, order: prev.length + 1 }]);
    setGasUsed(prev => prev + tx.gasLimit);
    setMempool(prev => prev.filter(t => t.id !== tx.id));
  }, [isPlaying, isCompleted, gasUsed]);

  // Remove transaction from block
  const removeTransaction = useCallback((txId: string) => {
    if (!isPlaying || isCompleted) return;
    
    const tx = selectedTxs.find(t => t.id === txId);
    if (!tx) return;
    
    setSelectedTxs(prev => prev.filter(t => t.id !== txId).map((t, idx) => ({ ...t, order: idx + 1 })));
    setGasUsed(prev => prev - tx.gasLimit);
    setMempool(prev => [...prev, tx].sort((a, b) => b.gasPrice - a.gasPrice));
  }, [isPlaying, isCompleted, selectedTxs]);

  // Reset everything
  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mempoolRef.current) clearInterval(mempoolRef.current);
    
    setIsPlaying(false);
    setIsCompleted(false);
    setTimeRemaining(BLOCK_TIME);
    setSelectedTxs([]);
    setGasUsed(0);
    setScore(0);
    setBlockNumber(1);
    setTotalRewards(0);
    initializeMempool();
  }, [initializeMempool]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mempoolRef.current) clearInterval(mempoolRef.current);
    };
  }, []);

  // Initialize on first mount
  useEffect(() => {
    initializeMempool();
  }, [initializeMempool]);

  const gasUtilization = gasUsed / GAS_LIMIT;
  const canAddMore = gasUsed < GAS_LIMIT;
  const timeSeconds = Math.ceil(timeRemaining / 1000);

  return {
    mempool,
    selectedTxs,
    gasUsed,
    gasLimit: GAS_LIMIT,
    gasUtilization,
    timeRemaining,
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
  };
}
