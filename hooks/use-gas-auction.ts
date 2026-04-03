'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PendingTransaction {
  id: string;
  from: string;
  to: string;
  value: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  gasLimit: number;
  timestamp: number;
  position: number;
}

const GAS_LIMIT = 30000000; // 30M gas
const BASE_FEE_MAX_CHANGE = 0.125; // 12.5% max change per block

export function useGasAuctionSimulation() {
  const [baseFee, setBaseFee] = useState(20); // Gwei
  const [pendingTxs, setPendingTxs] = useState<PendingTransaction[]>([]);
  const [userTx, setUserTx] = useState<{
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;
    gasLimit: number;
  }>({
    maxFeePerGas: 30,
    maxPriorityFeePerGas: 2,
    gasLimit: 21000,
  });
  const [inclusionTime, setInclusionTime] = useState<number | null>(null);
  const [blockNumber, setBlockNumber] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [congestionLevel, setCongestionLevel] = useState(50); // 0-100
  const [history, setHistory] = useState<{ block: number; baseFee: number }[]>([
    { block: 0, baseFee: 20 },
  ]);

  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random pending transactions based on congestion
  const generatePendingTxs = useCallback(() => {
    const count = Math.floor((congestionLevel / 100) * 50) + 10; // 10-60 txs
    const txs: PendingTransaction[] = [];
    
    for (let i = 0; i < count; i++) {
      const priorityFee = Math.random() * 10 + 1; // 1-11 Gwei
      const maxFee = baseFee + priorityFee + Math.random() * 20; // Always covers base fee + priority
      
      txs.push({
        id: `tx-${Date.now()}-${i}`,
        from: `0x${Math.random().toString(16).slice(2, 42)}`,
        to: `0x${Math.random().toString(16).slice(2, 42)}`,
        value: Math.random() * 10,
        maxFeePerGas: maxFee,
        maxPriorityFeePerGas: priorityFee,
        gasLimit: Math.random() > 0.7 ? 150000 : 21000, // 30% contract txs
        timestamp: Date.now() - Math.random() * 300000, // Up to 5 min old
        position: 0,
      });
    }
    
    // Sort by effective priority fee (highest first)
    txs.sort((a, b) => b.maxPriorityFeePerGas - a.maxPriorityFeePerGas);
    
    // Assign positions
    txs.forEach((tx, idx) => {
      tx.position = idx + 1;
    });
    
    return txs;
  }, [baseFee, congestionLevel]);

  // Calculate user's position in mempool - returns position without setting state
  const calculateUserPosition = useCallback(() => {
    const allTxs = [...pendingTxs];
    
    // Add user tx
    const userTxData: PendingTransaction = {
      id: 'user-tx',
      from: '0xUser',
      to: '0xRecipient',
      value: 1,
      maxFeePerGas: userTx.maxFeePerGas,
      maxPriorityFeePerGas: userTx.maxPriorityFeePerGas,
      gasLimit: userTx.gasLimit,
      timestamp: Date.now(),
      position: 0,
    };
    
    allTxs.push(userTxData);
    
    // Sort by effective tip (priority fee)
    allTxs.sort((a, b) => b.maxPriorityFeePerGas - a.maxPriorityFeePerGas);
    
    // Find user position
    const userIndex = allTxs.findIndex(tx => tx.id === 'user-tx');
    const position = userIndex + 1;
    
    // Calculate inclusion time estimate
    // Each block fits ~1000 simple transfers or ~200 contract calls
    const avgGasPerTx = 50000;
    const txsPerBlock = Math.floor(GAS_LIMIT / avgGasPerTx);
    const estimatedBlocks = Math.ceil(position / txsPerBlock);
    const estimatedSeconds = estimatedBlocks * 12; // 12 seconds per block
    
    return { position, estimatedSeconds };
  }, [pendingTxs, userTx]);

  // Simulate block mining
  const mineBlock = useCallback(() => {
    setBlockNumber(prev => {
      const newBlock = prev + 1;
      
      // Calculate gas used in this block
      const gasUsed = Math.min(
        GAS_LIMIT,
        pendingTxs.reduce((sum, tx) => sum + tx.gasLimit, 0) * 0.8
      );
      
      // Update base fee based on gas usage (EIP-1559 formula)
      const gasUtilization = gasUsed / GAS_LIMIT;
      let newBaseFee = baseFee;
      
      if (gasUtilization > 0.5) {
        // Increase base fee (max 12.5%)
        const increaseFactor = 1 + Math.min(BASE_FEE_MAX_CHANGE, (gasUtilization - 0.5) * 2);
        newBaseFee = baseFee * increaseFactor;
      } else if (gasUtilization < 0.5) {
        // Decrease base fee (max 12.5%)
        const decreaseFactor = 1 - Math.min(BASE_FEE_MAX_CHANGE, (0.5 - gasUtilization) * 2);
        newBaseFee = baseFee * decreaseFactor;
      }
      
      setBaseFee(Math.round(newBaseFee * 100) / 100);
      setHistory(h => [...h, { block: newBlock, baseFee: newBaseFee }]);
      
      // Remove included transactions and add new ones
      setPendingTxs(generatePendingTxs());
      
      return newBlock;
    });
  }, [baseFee, pendingTxs, generatePendingTxs]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setPendingTxs(generatePendingTxs());
    
    if (simulationRef.current) clearInterval(simulationRef.current);
    simulationRef.current = setInterval(() => {
      mineBlock();
    }, 3000); // New block every 3 seconds (sped up for demo)
  }, [generatePendingTxs, mineBlock]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simulationRef.current) clearInterval(simulationRef.current);
  }, []);

  // Update user transaction settings
  const updateUserTx = useCallback((updates: Partial<typeof userTx>) => {
    setUserTx(prev => ({ ...prev, ...updates }));
  }, []);

  // Update congestion level
  const updateCongestion = useCallback((level: number) => {
    setCongestionLevel(level);
    if (!isSimulating) {
      setPendingTxs(generatePendingTxs());
    }
  }, [generatePendingTxs, isSimulating]);

  // Initialize
  useEffect(() => {
    setPendingTxs(generatePendingTxs());
  }, []);

  // Recalculate position when user tx changes or pending txs change
  useEffect(() => {
    const { position, estimatedSeconds } = calculateUserPosition();
    setInclusionTime(estimatedSeconds);
  }, [calculateUserPosition]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  const { position: userPosition } = calculateUserPosition();
  const effectiveGasPrice = Math.min(
    userTx.maxFeePerGas,
    baseFee + userTx.maxPriorityFeePerGas
  );

  return {
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
  };
}
