'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEthereumSimulation } from '@/hooks/use-ethereum-simulation';
import { usePanelDrag, usePanelLayout, usePanelResize } from '@/hooks/use-panel-layout';
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
  GripVertical, Minimize2, Maximize2, GripHorizontal, RotateCcw,
} from 'lucide-react';

const PANEL_IDS = ['transaction', 'participants', 'block', 'validators', 'mempool'] as const;
type PanelId = typeof PANEL_IDS[number];

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

export function EthereumSimulator() {
  const t = useTranslations();
  
  const {
    state, nextStep, startTransaction, togglePlayPause,
    setSpeed, reset, progress, canAdvance, isPlaying, isInitialized,
  } = useEthereumSimulation();

  const { columns, setColumns, resetLayout, isLoaded } = usePanelLayout();
  const { customHeights, handleResizeDown: handlePanelResize } = usePanelResize();
  const {
    crossDrag,
    dropTarget,
    handlePanelDragStart,
    handleGlobalPointerMove,
    handleGlobalPointerUp,
  } = usePanelDrag({ columns, onColumnsChange: setColumns });

  const [minimized, setMinimized] = useState<Record<PanelId, boolean>>({
    transaction: false, participants: false, block: false,
    validators: false, mempool: false,
  });
  const [focusedPanel, setFocusedPanel] = useState<PanelId | null>(null);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent, panelId: PanelId, colIdx: number, panelIdx: number) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();

    const key = e.key;
    const colLength = columns[colIdx].length;

    if (key === 'ArrowUp' && panelIdx > 0) {
      setColumns(prev => {
        const newCols = { ...prev };
        const newOrder = [...newCols[colIdx]];
        [newOrder[panelIdx - 1], newOrder[panelIdx]] = [newOrder[panelIdx], newOrder[panelIdx - 1]];
        newCols[colIdx] = newOrder;
        return newCols;
      });
    } else if (key === 'ArrowDown' && panelIdx < colLength - 1) {
      setColumns(prev => {
        const newCols = { ...prev };
        const newOrder = [...newCols[colIdx]];
        [newOrder[panelIdx], newOrder[panelIdx + 1]] = [newOrder[panelIdx + 1], newOrder[panelIdx]];
        newCols[colIdx] = newOrder;
        return newCols;
      });
    } else if (key === 'ArrowLeft' && colIdx > 0) {
      setColumns(prev => {
        const newCols = { ...prev };
        newCols[colIdx] = newCols[colIdx].filter(id => id !== panelId);
        newCols[colIdx - 1] = [...newCols[colIdx - 1], panelId];
        return newCols;
      });
    } else if (key === 'ArrowRight' && colIdx < 2) {
      setColumns(prev => {
        const newCols = { ...prev };
        newCols[colIdx] = newCols[colIdx].filter(id => id !== panelId);
        newCols[colIdx + 1] = [...newCols[colIdx + 1], panelId];
        return newCols;
      });
    }
  }, [columns, setColumns]);

  const handleDragStart = useCallback((panelId: PanelId, e: React.PointerEvent) => {
    handlePanelDragStart(panelId, e);
  }, [handlePanelDragStart]);

  const Panel = memo(({ panelId, colIdx, panelIdx }: { panelId: PanelId; colIdx: number; panelIdx: number }) => {
    const isActive = activePanel === panelId;
    const isMin = minimized[panelId];
    const isDragging = crossDrag?.panelId === panelId;
    const isFocused = focusedPanel === panelId;

    const panelMeta = {
      transaction: { 
        title: t('simulator.panels.transaction.title'), 
        icon: <FileText className="size-4 text-primary" />, 
        ariaLabel: t('simulator.panels.transaction.ariaLabel') 
      },
      participants: { 
        title: t('simulator.panels.participants.title'), 
        icon: <Network className="size-4 text-accent" />, 
        ariaLabel: t('simulator.panels.participants.ariaLabel') 
      },
      block: { 
        title: t('simulator.panels.block.title'), 
        icon: <Box className="size-4 text-chart-1" />, 
        ariaLabel: t('simulator.panels.block.ariaLabel') 
      },
      validators: { 
        title: t('simulator.panels.validators.title'), 
        icon: <Users className="size-4 text-chart-3" />, 
        ariaLabel: t('simulator.panels.validators.ariaLabel') 
      },
      mempool: { 
        title: t('simulator.panels.mempool.title'), 
        icon: <Database className="size-4 text-chart-2" />, 
        ariaLabel: t('simulator.panels.mempool.ariaLabel') 
      },
    };

    const meta = panelMeta[panelId];

    if (crossDrag && crossDrag.panelId === panelId && crossDrag.sourceCol !== colIdx) {
      return null;
    }

    return (
      <motion.div
        id={`panel-${panelId}`}
        layout
        tabIndex={0}
        role="listitem"
        aria-label={meta.ariaLabel}
        aria-roledescription="draggable panel"
        aria-pressed={isDragging}
        className={`group relative flex flex-col overflow-hidden rounded-xl border transition-colors ${
          isActive ? 'border-primary bg-card shadow-lg shadow-primary/10' : 'border-border bg-card'
        } ${isDragging ? 'opacity-50 select-none' : ''} ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        style={isMin ? {} : { minHeight: 80, ...(customHeights[panelId] ? { height: customHeights[panelId] } : {}) }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button, input, a, .resize-handle')) return;
          handleDragStart(panelId, e);
        }}
        onFocus={() => setFocusedPanel(panelId)}
        onBlur={() => setFocusedPanel(null)}
        onKeyDown={(e) => handleKeyDown(e, panelId, colIdx, panelIdx)}
      >
        <div className="flex shrink-0 cursor-grab items-center justify-between border-b border-border bg-secondary/30 px-4 py-2 active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-muted-foreground" aria-hidden="true" />
            {meta.icon}
            <span className="text-sm font-medium text-foreground">{meta.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(p => ({ ...p, [panelId]: !p[panelId] }));
            }}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={isMin ? t('common.expand') : t('common.collapse')}
          >
            {isMin ? <Maximize2 className="size-4" aria-hidden="true" /> : <Minimize2 className="size-4" aria-hidden="true" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMin ? 0 : 'auto', opacity: isMin ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={`flex-1 overflow-hidden ${isMin ? 'hidden' : ''}`}
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
            onPointerDown={(e) => handlePanelResize(panelId, e)}
            role="separator"
            aria-orientation="horizontal"
            aria-label={`Resize ${meta.title} panel`}
            tabIndex={0}
          >
            <GripHorizontal className="mb-0.5 size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" aria-hidden="true" />
          </div>
        )}
      </motion.div>
    );
  });
  Panel.displayName = 'Panel';

  const DropIndicator = memo(({ index }: { index: number }) => (
    <div
      className="pointer-events-none rounded-xl border-2 border-dashed border-primary/60 bg-primary/10"
      style={{ height: 80 }}
      role="listitem"
      aria-hidden="true"
    />
  ));
  DropIndicator.displayName = 'DropIndicator';

  if (!isInitialized || !isLoaded) {
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
              {t('simulator.header.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-lg text-muted-foreground">
              {t('simulator.header.subtitle')}
            </p>
          </header>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">{t('simulator.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative min-h-screen bg-background ${crossDrag ? 'select-none' : ''}`}
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
            {t('simulator.header.title')}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">
            {t('simulator.header.subtitle')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('simulator.header.hint')}
          </p>
        </header>

        <div className="mb-4 flex justify-center">
          <button
            onClick={resetLayout}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={t('simulator.controls.resetLayoutAria')}
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            {t('simulator.controls.resetLayout')}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="mb-6 text-center text-xl font-bold text-foreground sm:text-2xl">
            {t('simulator.participants.title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12">
                <User className="size-5 text-primary sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.user.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.user.description')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-accent/10 sm:size-12">
                <Wallet className="size-5 text-accent sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.wallet.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.wallet.description')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-1/10 sm:size-12">
                <Server className="size-5 text-chart-1 sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.node.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.node.description')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-2/10 sm:size-12">
                <Inbox className="size-5 text-chart-2 sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.mempool.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.mempool.description')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-3/10 sm:size-12">
                <Shield className="size-5 text-chart-3 sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.validator.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.validator.description')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-chart-4/10 sm:size-12">
                <Radio className="size-5 text-chart-4 sm:size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t('simulator.participants.beaconChain.name')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulator.participants.beaconChain.description')}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <StepDisplay currentStep={state.step} progress={progress} />
        </div>

        <div className="mb-6">
          <BlockchainVisualization blocks={state.blocks} />
        </div>

        <div 
          className="grid gap-6 lg:grid-cols-3"
          role="list"
          aria-label="Panel layout with three columns"
        >
          {[0, 1, 2].map(colIdx => {
            const colPanels = columns[colIdx];
            const isDropTarget = dropTarget?.col === colIdx;
            const dropIndex = dropTarget?.index ?? 0;

            return (
              <div
                id={`column-${colIdx}`}
                key={colIdx}
                role="listbox"
                aria-label={`Column ${colIdx + 1}`}
                aria-orientation="vertical"
                className="relative flex min-h-[200px] flex-col gap-4 rounded-xl p-2"
              >
                {colPanels.map((panelId, idx) => (
                  <React.Fragment key={panelId}>
                    {isDropTarget && idx === dropIndex && <DropIndicator index={idx} />}
                    <Panel panelId={panelId} colIdx={colIdx} panelIdx={idx} />
                  </React.Fragment>
                ))}
                {isDropTarget && dropIndex >= colPanels.length && <DropIndicator index={colPanels.length} />}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">{t('simulator.info.pos.title')}</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t('simulator.info.pos.description')}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">{t('simulator.info.finality.title')}</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t('simulator.info.finality.description')}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h3 className="mb-2 font-semibold text-foreground">{t('simulator.info.lifecycle.title')}</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t('simulator.info.lifecycle.description')}
            </p>
          </div>
        </div>

        <footer className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t('simulator.footer')}
          </p>
        </footer>
      </div>
    </div>
  );
}
