'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SimulationState, SimulationStep, Transaction, Wallet } from '@/lib/ethereum-types';
import { createTransaction, createBlock, createValidators, createNodes, createWallets, generateHash, generateSignature } from '@/lib/ethereum-utils';

const STEP_ORDER: SimulationStep[] = [
  'idle',
  'creating-tx',
  'signing-tx',
  'broadcasting',
  'mempool',
  'selecting-validator',
  'building-block',
  'proposing-block',
  'attesting',
  'finalizing',
  'complete',
];

function createInitialState(): SimulationState {
  return {
    step: 'idle',
    currentTransaction: null,
    mempool: [],
    currentBlock: null,
    validators: [],
    nodes: [],
    wallets: [],
    activeWallet: null,
    blocks: [],
    isAutoMode: false,
    isFullAuto: false,
    isPaused: false,
    speed: 1500,
    totalTransactions: 0,
  };
}

function createNewTransaction(wallets: Wallet[]): { transaction: Transaction; sender: Wallet; receiver: Wallet } | null {
  if (wallets.length === 0) return null;
  
  const senderIdx = Math.floor(Math.random() * wallets.length);
  let receiverIdx = Math.floor(Math.random() * wallets.length);
  while (receiverIdx === senderIdx && wallets.length > 1) {
    receiverIdx = Math.floor(Math.random() * wallets.length);
  }
  
  const sender = wallets[senderIdx];
  const receiver = wallets[receiverIdx] ?? wallets[0];
  if (!receiver) return null;
  
  return {
    transaction: createTransaction(sender, receiver),
    sender,
    receiver,
  };
}

export function useEthereumSimulation() {
  const [state, setState] = useState<SimulationState>(createInitialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      const wallets = createWallets(4);
      setState({
        step: 'idle',
        currentTransaction: null,
        mempool: [],
        currentBlock: null,
        validators: createValidators(8),
        nodes: createNodes(6),
        wallets: wallets,
        activeWallet: wallets[0],
        blocks: [],
        isAutoMode: false,
        isFullAuto: false,
        isPaused: false,
        speed: 1500,
        totalTransactions: 0,
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const processStep = useCallback((currentState: SimulationState): SimulationState => {
    const { step, currentTransaction, mempool, validators, blocks, currentBlock, wallets, nodes } = currentState;

    switch (step) {
      case 'idle': {
        const result = createNewTransaction(wallets);
        if (!result) return currentState;
        return { 
          ...currentState, 
          step: 'creating-tx', 
          currentTransaction: result.transaction,
          activeWallet: result.sender,
        };
      }

      case 'creating-tx': {
        if (!currentTransaction) return currentState;
        return {
          ...currentState,
          step: 'signing-tx',
          currentTransaction: { 
            ...currentTransaction, 
            hash: generateHash(),
            status: 'pending',
          },
        };
      }

      case 'signing-tx': {
        if (!currentTransaction) return currentState;
        return { 
          ...currentState, 
          step: 'broadcasting',
          currentTransaction: { 
            ...currentTransaction, 
            signature: generateSignature(),
            status: 'signed',
          },
        };
      }

      case 'broadcasting': {
        if (!currentTransaction) return currentState;
        const updatedNodes = nodes.map(node => ({
          ...node,
          status: 'receiving' as const,
          transactionsReceived: node.transactionsReceived + 1,
        }));
        const txBroadcast: Transaction = { ...currentTransaction, status: 'broadcast' };
        return {
          ...currentState,
          step: 'mempool',
          currentTransaction: txBroadcast,
          nodes: updatedNodes,
        };
      }

      case 'mempool': {
        if (!currentTransaction) return currentState;
        const txInMempool: Transaction = { ...currentTransaction, status: 'in-mempool' };
        const idleNodes = nodes.map(node => ({
          ...node,
          status: 'idle' as const,
        }));
        return {
          ...currentState,
          step: 'selecting-validator',
          currentTransaction: txInMempool,
          mempool: [...mempool, txInMempool],
          nodes: idleNodes,
        };
      }

      case 'selecting-validator': {
        if (validators.length === 0) return currentState;
        const proposerIndex = Math.floor(Math.random() * validators.length);
        const updatedValidators = validators.map((v, i) => ({
          ...v,
          isProposer: i === proposerIndex,
          status: i === proposerIndex ? 'proposing' as const : 'idle' as const,
        }));
        return { ...currentState, step: 'building-block', validators: updatedValidators };
      }

      case 'building-block': {
        const lastBlock = blocks[blocks.length - 1];
        const parentHash = lastBlock ? lastBlock.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
        const blockNumber = lastBlock ? lastBlock.number + 1 : 1;
        const txsForBlock = mempool.map(tx => ({ ...tx, status: 'in-block' as const }));
        const newBlock = createBlock(blockNumber, parentHash, txsForBlock);
        const proposer = validators.find(v => v.isProposer);
        if (proposer) {
          newBlock.miner = proposer.address;
        }
        return {
          ...currentState,
          step: 'proposing-block',
          currentBlock: newBlock,
          mempool: [],
          currentTransaction: currentTransaction ? { ...currentTransaction, status: 'in-block' } : null,
        };
      }

      case 'proposing-block': {
        if (!currentBlock) return currentState;
        return {
          ...currentState,
          step: 'attesting',
          currentBlock: { ...currentBlock, status: 'proposed' },
        };
      }

      case 'attesting': {
        if (!currentBlock) return currentState;
        const attestingValidators = validators.map(v => ({
          ...v,
          status: v.isProposer ? 'proposing' as const : 'attesting' as const,
          hasAttested: !v.isProposer,
        }));
        const attestationCount = attestingValidators.filter(v => v.hasAttested).length;
        return {
          ...currentState,
          step: 'finalizing',
          validators: attestingValidators,
          currentBlock: { ...currentBlock, status: 'attested', attestations: attestationCount },
        };
      }

      case 'finalizing': {
        if (!currentBlock) return currentState;
        const finalBlock = { ...currentBlock, status: 'finalized' as const };
        const resetValidators = validators.map(v => ({
          ...v,
          isProposer: false,
          hasAttested: false,
          status: 'finalized' as const,
        }));
        return {
          ...currentState,
          step: 'complete',
          currentBlock: finalBlock,
          blocks: [...blocks, finalBlock],
          validators: resetValidators,
          currentTransaction: currentTransaction ? { ...currentTransaction, status: 'confirmed' } : null,
          totalTransactions: currentState.totalTransactions + (currentBlock.transactions.length || 1),
        };
      }

      case 'complete': {
        const resetValidators = validators.map(v => ({
          ...v,
          isProposer: false,
          hasAttested: false,
          status: 'idle' as const,
        }));
        return {
          ...currentState,
          step: 'idle',
          currentTransaction: null,
          currentBlock: null,
          validators: resetValidators,
        };
      }

      default:
        return currentState;
    }
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => processStep(prev));
  }, [processStep]);

  const startTransaction = useCallback(() => {
    if (state.step === 'idle' && isInitialized) {
      nextStep();
    }
  }, [state.step, nextStep, isInitialized]);

  const togglePlayPause = useCallback(() => {
    setState(prev => {
      if (prev.step === 'idle') {
        const result = createNewTransaction(prev.wallets);
        if (!result) return prev;
        return {
          ...prev,
          step: 'creating-tx',
          currentTransaction: result.transaction,
          activeWallet: result.sender,
          isAutoMode: true,
          isFullAuto: true,
          isPaused: false,
        };
      }
      
      if (prev.isPaused) {
        return { ...prev, isPaused: false, isAutoMode: true };
      }
      
      return { ...prev, isPaused: true, isAutoMode: false };
    });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const reset = useCallback(() => {
    clearAutoTimer();
    const newWallets = createWallets(4);
    setState({
      step: 'idle',
      currentTransaction: null,
      mempool: [],
      currentBlock: null,
      validators: createValidators(8),
      nodes: createNodes(6),
      wallets: newWallets,
      activeWallet: newWallets[0],
      blocks: [],
      isAutoMode: false,
      isFullAuto: false,
      isPaused: false,
      speed: 1500,
      totalTransactions: 0,
    });
  }, [clearAutoTimer]);

  useEffect(() => {
    clearAutoTimer();
    
    if (!isInitialized) return;

    const shouldAutoAdvance = state.isAutoMode && !state.isPaused && state.step !== 'idle';
    const shouldRestart = state.isFullAuto && !state.isPaused && state.step === 'idle' && state.totalTransactions > 0;

    if (shouldAutoAdvance || shouldRestart) {
      const delay = shouldRestart ? state.speed / 2 : state.speed;
      autoTimerRef.current = setTimeout(() => {
        setState(prev => processStep(prev));
      }, delay);
    }

    return clearAutoTimer;
  }, [state.isAutoMode, state.isFullAuto, state.isPaused, state.step, state.speed, state.totalTransactions, processStep, clearAutoTimer, isInitialized]);

  const currentStepIndex = STEP_ORDER.indexOf(state.step);
  const progress = state.step === 'idle' ? 0 : ((currentStepIndex) / (STEP_ORDER.length - 1)) * 100;
  
  const isPlaying = state.isAutoMode && !state.isPaused;
  const canAdvance = state.step !== 'idle' || state.isPaused;

  return {
    state,
    nextStep,
    startTransaction,
    togglePlayPause,
    setSpeed,
    reset,
    progress,
    canAdvance: state.step !== 'complete' || state.isFullAuto,
    isPlaying,
    isInitialized,
  };
}
