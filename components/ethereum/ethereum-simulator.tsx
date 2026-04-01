'use client';

import React, { useState, useCallback, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEthereumSimulation } from '@/hooks/use-ethereum-simulation';
import { TransactionCard } from './transaction-card';
import { MempoolVisualization } from './mempool-visualization';
import { BlockVisualization } from './block-visualization';
import { ValidatorsVisualization } from './validators-visualization';
import { BlockchainVisualization } from './blockchain-visualization';
import { StepDisplay } from './step-display';
import { TopControlBar } from './top-control-bar';
import { NetworkAnimation } from './network-animation';
import { ParticipantVisualization } from './participant-visualization';
import {
  User, Server, Shield, Wallet, Inbox, Radio,
  FileText, Box, Network, Users, Database,
  GripVertical, Minimize2, Maximize2, GripHorizontal,
} from 'lucide-react';

const PANEL_IDS = ['transaction', 'participants', 'block', 'validators', 'mempool'] as const;
type PanelId = typeof PANEL_IDS[number];
type ColumnsState = Record<number, PanelId[]>;

const PANEL_META: Record<PanelId, { title: string; icon: React.ReactNode }> = {
  transaction: { title: 'Transaction', icon: <FileText className="size-4 text-primary" /> },
  participants: { title: 'Network Participants', icon: <Network className="size-4 text-accent" /> },
  block: { title: 'Block', icon: <Box className="size-4 text-chart-1" /> },
  validators: { title: 'Validators', icon: <Users className="size-4 text-chart-3" /> },
  mempool: { title: 'Mempool', icon: <Database className="size-4 text-chart-2" /> },
};

function getActivePanel(step: string): PanelId | null {
  switch (step) {
    case 'creating-tx':
    case 'signing-tx':
      return 'transaction';
    case 'broadcasting':
      return 'participants';
    case 'mempool':
      return 'mempool';
    case 'selecting-validator':
    case 'attesting':
    case 'finalizing':
      return 'validators';
    case 'building-block':
    case 'proposing-block':
      return 'block';
    default:
      return null;
  }
}

function getColumnFromX(x: number): number {
  const cw = window.innerWidth / 3;
  return Math.min(2, Math.max(0, Math.floor(x / cw)));
}

export function EthereumSimulator() {
  const {
    state, nextStep, startTransaction, togglePlayPause,
    setSpeed, reset, progress, canAdvance, isPlaying, isInitialized,
  } = useEthereumSimulation();

  const [columns, setColumns] = useState<ColumnsState>({
    0: ['transaction', 'participants'],
    1: ['block', 'validators'],
    2: ['mempool'],
  });
  const [minimized, setMinimized] = useState<Record<PanelId, boolean>>({
    transaction: false, participants: false, block: false,
    validators: false, mempool: false,
  });
  const [customHeights, setCustomHeights] = useState<Record<string, number>>({});

  // Cross-column drag state
  const [crossDrag, setCrossDrag] = useState<{
    panelId: PanelId;
    sourceCol: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ col: number; index: number } | null>(null);

  const activePanel = getActivePanel(state.step);

  const renderPanelContent = useCallback((id: PanelId) => {
    switch (id) {
      case 'transaction':
        return <TransactionCard transaction={state.currentTransaction} step={state.step} activeWallet={state.activeWallet} wallets={state.wallets} />;
      case 'participants':
        return <ParticipantVisualization step={state.step} wallets={state.wallets} activeWallet={state.activeWallet} nodes={state.nodes} />;
      case 'block':
        return <BlockVisualization block={state.currentBlock} step={state.step} />;
      case 'validators':
        return <ValidatorsVisualization validators={state.validators} step={state.step} />;
      case 'mempool':
        return <MempoolVisualization transactions={state.mempool} step={state.step} nodes={state.nodes} />;
    }
  }, [state]);

  // Calculate drop index based on Y position in a column
  const calculateDropIndex = useCallback((targetCol: number, y: number, excludeId?: PanelId) => {
    const panelIds = columns[targetCol].filter(id => id !== excludeId);
    if (panelIds.length === 0) return 0;

    // Get column container bounds
    const colEl = document.getElementById(`column-${targetCol}`);
    if (!colEl) return 0;
    const colRect = colEl.getBoundingClientRect();

    // Find insertion index based on Y position relative to column
    const relativeY = y - colRect.top;
    let insertIndex = 0;

    for (const id of panelIds) {
      const el = document.getElementById(`panel-${id}`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const panelTop = rect.top - colRect.top;
      const panelMid = panelTop + rect.height / 2;
      if (relativeY < panelMid) break;
      insertIndex++;
    }

    return insertIndex;
  }, [columns]);

  // Start cross-column drag
  const handlePanelDragStart = useCallback((panelId: PanelId, e: React.PointerEvent) => {
    // Only start cross-column drag if not clicking buttons
    if ((e.target as HTMLElement).closest('button, input, a')) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const colEntry = Object.entries(columns).find(([_, panels]) => panels.includes(panelId));
    const sourceCol = colEntry ? Number(colEntry[0]) : 0;

    setCrossDrag({
      panelId,
      sourceCol,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
    setDropTarget(null);
  }, [columns]);

  // Update cross-column drag position
  const handlePanelDragMove = useCallback((e: PointerEvent) => {
    if (!crossDrag) return;

    const targetCol = getColumnFromX(e.clientX);
    const dropIdx = calculateDropIndex(targetCol, e.clientY, crossDrag.panelId);

    setCrossDrag(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    setDropTarget({ col: targetCol, index: dropIdx });
  }, [crossDrag, calculateDropIndex]);

  // End cross-column drag
  const handlePanelDragEnd = useCallback(() => {
    if (!crossDrag || !dropTarget) {
      setCrossDrag(null);
      setDropTarget(null);
      return;
    }

    const { panelId, sourceCol } = crossDrag;
    const { col: targetCol, index: insertIdx } = dropTarget;

    // Don't do anything if dropped in same position
    if (sourceCol === targetCol) {
      const currentIdx = columns[sourceCol].indexOf(panelId);
      if (currentIdx === insertIdx || currentIdx === insertIdx - 1) {
        setCrossDrag(null);
        setDropTarget(null);
        return;
      }
    }

    setColumns(prev => {
      const newCols = { ...prev };
      // Remove from source
      newCols[sourceCol] = newCols[sourceCol].filter(id => id !== panelId);
      // Insert at target
      const targetList = [...newCols[targetCol]];
      targetList.splice(insertIdx, 0, panelId);
      newCols[targetCol] = targetList;
      return newCols;
    });

    setCrossDrag(null);
    setDropTarget(null);
  }, [crossDrag, dropTarget, columns]);

  // Attach global listeners for cross-column drag
  const handleGlobalPointerMove = useCallback((e: React.PointerEvent) => {
    if (crossDrag) {
      handlePanelDragMove(e.nativeEvent);
    }
  }, [crossDrag, handlePanelDragMove]);

  const handleGlobalPointerUp = useCallback(() => {
    if (crossDrag) {
      handlePanelDragEnd();
    }
  }, [crossDrag, handlePanelDragEnd]);

  // Reorder within a column
  const handleColumnReorder = useCallback((colIdx: number, newOrder: PanelId[]) => {
    // Check if this is actually a cross-column drag that we should handle differently
    if (crossDrag && crossDrag.sourceCol !== colIdx) {
      // This is a cross-column drag ending - let handlePanelDragEnd handle it
      return;
    }
    setColumns(prev => ({ ...prev, [colIdx]: newOrder }));
  }, [crossDrag]);

  const handleResizeDown = useCallback((panelId: PanelId, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(`panel-${panelId}`);
    const startH = el?.offsetHeight ?? 300;

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientY - e.clientY;
      setCustomHeights(prev => ({
        ...prev,
        [panelId]: Math.max(80, Math.min(800, startH + delta)),
      }));
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, []);

  const Panel = memo(({ panelId, colIdx }: { panelId: PanelId; colIdx: number }) => {
    const isActive = activePanel === panelId;
    const isMin = minimized[panelId];
    const meta = PANEL_META[panelId];
    const isDragging = crossDrag?.panelId === panelId;

    // Don't render panel at original position while cross-dragging
    if (crossDrag && crossDrag.panelId === panelId && crossDrag.sourceCol !== colIdx) {
      return null;
    }

    return (
      <motion.div
        id={`panel-${panelId}`}
        layout
        className={`group relative flex flex-col overflow-hidden rounded-xl border transition-colors ${
          isActive ? 'border-primary bg-card shadow-lg shadow-primary/10' : 'border-border bg-card'
        } ${isDragging ? 'opacity-50' : ''}`}
        style={isMin ? {} : { minHeight: 80, ...(customHeights[panelId] ? { height: customHeights[panelId] } : {}) }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button, input, a, .resize-handle')) return;
          // Start tracking for potential cross-column drag
          handlePanelDragStart(panelId, e);
        }}
      >
        <div className="flex shrink-0 cursor-grab items-center justify-between border-b border-border bg-secondary/30 px-4 py-2 active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-muted-foreground" />
            {meta.icon}
            <span className="text-sm font-medium text-foreground">{meta.title}</span>
          </div>
          <button
            onClick={() => setMinimized(p => ({ ...p, [panelId]: !p[panelId] }))}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {isMin ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMin ? 0 : 'auto', opacity: isMin ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-hidden"
        >
          <div className="p-4">{renderPanelContent(panelId)}</div>
        </motion.div>

        {isActive && (
          <motion.div
            className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {!isMin && (
          <div
            className="resize-handle absolute inset-x-0 bottom-0 z-20 flex h-3 cursor-s-resize items-end justify-center"
            onPointerDown={(e) => handleResizeDown(panelId, e)}
          >
            <GripHorizontal className="mb-0.5 size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </div>
        )}
      </motion.div>
    );
  });
  Panel.displayName = 'Panel';

  // Drop indicator component
  const DropIndicator = ({ index }: { index: number }) => (
    <div
      className="pointer-events-none rounded-xl border-2 border-dashed border-primary/60 bg-primary/5"
      style={{ height: 80 }}
    />
  );

  if (!isInitialized) {
    return (
      <div className="relative min-h-screen bg-background">
        <div 
          className="relative z-10 mx-auto max-w-7xl px-4 py-8"
          onPointerMove={handleGlobalPointerMove}
          onPointerUp={handleGlobalPointerUp}
          onPointerLeave={handleGlobalPointerUp}
        >
          <header className="mb-8 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Ethereum Protocol Visualizer
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground">
              Watch how transactions flow through the Ethereum network - from your wallet to blockchain finality
            </p>
          </header>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Initializing simulation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen bg-background"
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerLeave={handleGlobalPointerUp}
    >
      <NetworkAnimation step={state.step} />

      <TopControlBar
        step={state.step}
        isPlaying={isPlaying}
        isPaused={state.isPaused}
        speed={state.speed}
        totalTransactions={state.totalTransactions}
        onTogglePlayPause={togglePlayPause}
        onNextStep={nextStep}
        onSetSpeed={setSpeed}
        onReset={reset}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ethereum Protocol Visualizer
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">
            Watch how transactions flow through the Ethereum network - from your wallet to blockchain finality
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag panels between columns &middot; Drag bottom edge to resize
          </p>
        </header>

        <div className="mb-8">
          <h2 className="mb-6 text-center text-xl font-bold text-foreground sm:text-2xl">
            Who Participates in the Ethereum Network?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12">
                <User className="size-5 text-primary sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">User</h3>
              <p className="text-xs text-muted-foreground">You! Initiates transactions using wallet software</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-accent/10 sm:size-12">
                <Wallet className="size-5 text-accent sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Wallet</h3>
              <p className="text-xs text-muted-foreground">Software that creates & signs transactions with your keys</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-1/10 sm:size-12">
                <Server className="size-5 text-chart-1 sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Node</h3>
              <p className="text-xs text-muted-foreground">Computers that validate, store, and relay blockchain data</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-2/10 sm:size-12">
                <Inbox className="size-5 text-chart-2 sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Mempool</h3>
              <p className="text-xs text-muted-foreground">Each node's local queue of pending transactions</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-3/10 sm:size-12">
                <Shield className="size-5 text-chart-3 sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Validator</h3>
              <p className="text-xs text-muted-foreground">Staked nodes that propose & attest to new blocks</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-4/10 sm:size-12">
                <Radio className="size-5 text-chart-4 sm:size-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">Beacon Chain</h3>
              <p className="text-xs text-muted-foreground">Consensus layer coordinating validator duties</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <StepDisplay currentStep={state.step} progress={progress} />
        </div>

        <div className="mb-6">
          <BlockchainVisualization blocks={state.blocks} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map(colIdx => {
            const colPanels = columns[colIdx];
            const isDropTarget = dropTarget?.col === colIdx;
            const dropIndex = dropTarget?.index ?? 0;

            return (
              <div
                id={`column-${colIdx}`}
                key={colIdx}
                className="relative flex min-h-[200px] flex-col gap-4 rounded-xl p-2"
              >
                {colPanels.map((panelId, idx) => (
                  <React.Fragment key={panelId}>
                    {isDropTarget && idx === dropIndex && <DropIndicator index={idx} />}
                    <Panel panelId={panelId} colIdx={colIdx} />
                  </React.Fragment>
                ))}
                {isDropTarget && dropIndex >= colPanels.length && <DropIndicator index={colPanels.length} />}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">Proof of Stake (PoS)</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Validators stake 32+ ETH as collateral. They're randomly selected to propose blocks and attest to others' blocks. Dishonest behavior results in slashing (losing staked ETH).
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">Finality</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              When 2/3+ of validators attest to a block, it becomes "justified." After two such epochs (~13 min), blocks become "finalized" - cryptoeconomically irreversible.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">Transaction Lifecycle</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Created in wallet, signed locally, broadcast to nodes, sits in mempool, validator includes in block, committee attests, block finalized.
            </p>
          </div>
        </div>

        <footer className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground sm:text-sm">
            Educational simulation demonstrating Ethereum protocol concepts. Not connected to actual blockchain.
          </p>
        </footer>
      </div>
    </div>
  );
}