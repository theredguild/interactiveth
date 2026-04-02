import React, { useState, useCallback, useRef, useEffect } from 'react';

type PanelId = 'transaction' | 'participants' | 'block' | 'validators' | 'mempool';
type ColumnsState = Record<number, PanelId[]>;

const STORAGE_KEY = 'ethereum-simulator-layout';

function getDefaultColumns(): ColumnsState {
  return {
    0: ['transaction', 'participants'],
    1: ['block', 'validators'],
    2: ['mempool'],
  };
}

function loadFromStorage(): ColumnsState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed as ColumnsState;
      }
    }
  } catch (e) {
    console.warn('Failed to load layout from localStorage:', e);
  }
  return null;
}

function saveToStorage(columns: ColumnsState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  } catch (e) {
    console.warn('Failed to save layout to localStorage:', e);
  }
}

export interface UsePanelDragOptions {
  columns: ColumnsState;
  onColumnsChange: (columns: ColumnsState | ((prev: ColumnsState) => ColumnsState)) => void;
}

export interface UsePanelDragReturn {
  crossDrag: {
    panelId: PanelId;
    sourceCol: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null;
  dropTarget: { col: number; index: number } | null;
  handlePanelDragStart: (panelId: PanelId, e: React.PointerEvent) => void;
  handleGlobalPointerMove: (e: React.PointerEvent) => void;
  handleGlobalPointerUp: () => void;
}

export function usePanelDrag({ columns, onColumnsChange }: UsePanelDragOptions): UsePanelDragReturn {
  const [crossDrag, setCrossDrag] = useState<{
    panelId: PanelId;
    sourceCol: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ col: number; index: number } | null>(null);

  const columnsRef = useRef(columns);
  const crossDragRef = useRef(crossDrag);
  const dropTargetRef = useRef(dropTarget);

  useEffect(() => { columnsRef.current = columns; }, [columns]);
  useEffect(() => { crossDragRef.current = crossDrag; }, [crossDrag]);
  useEffect(() => { dropTargetRef.current = dropTarget; }, [dropTarget]);

  const getColumnFromX = useCallback((x: number): number => {
    const cw = window.innerWidth / 3;
    return Math.min(2, Math.max(0, Math.floor(x / cw)));
  }, []);

  const calculateDropIndex = useCallback((targetCol: number, y: number, excludeId?: PanelId) => {
    const panelIds = columnsRef.current[targetCol].filter(id => id !== excludeId);
    if (panelIds.length === 0) return 0;

    const colEl = document.getElementById(`column-${targetCol}`);
    if (!colEl) return 0;
    const colRect = colEl.getBoundingClientRect();
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
  }, []);

  const handlePanelDragStart = useCallback((panelId: PanelId, e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a')) return;

    const colEntry = Object.entries(columnsRef.current).find(([_, panels]) => panels.includes(panelId));
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
  }, []);

  const handlePanelDragMove = useCallback((e: PointerEvent) => {
    if (!crossDragRef.current) return;

    const targetCol = getColumnFromX(e.clientX);
    const dropIdx = calculateDropIndex(targetCol, e.clientY, crossDragRef.current.panelId);

    setCrossDrag(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    setDropTarget({ col: targetCol, index: dropIdx });
  }, [getColumnFromX, calculateDropIndex]);

  const handlePanelDragEnd = useCallback(() => {
    const drag = crossDragRef.current;
    const target = dropTargetRef.current;

    if (!drag || !target) {
      setCrossDrag(null);
      setDropTarget(null);
      return;
    }

    const { panelId, sourceCol } = drag;
    const { col: targetCol, index: insertIdx } = target;

    const currentIdx = columnsRef.current[sourceCol].indexOf(panelId);
    if (sourceCol === targetCol && (currentIdx === insertIdx || currentIdx === insertIdx - 1)) {
      setCrossDrag(null);
      setDropTarget(null);
      return;
    }

    onColumnsChange((prev: ColumnsState) => {
      const newCols = { ...prev };
      newCols[sourceCol] = newCols[sourceCol].filter((id: PanelId) => id !== panelId);
      const targetList = [...newCols[targetCol]];
      targetList.splice(insertIdx, 0, panelId);
      newCols[targetCol] = targetList;
      return newCols;
    });

    setCrossDrag(null);
    setDropTarget(null);
  }, [onColumnsChange]);

  const handleGlobalPointerMove = useCallback((e: React.PointerEvent) => {
    if (crossDragRef.current) {
      handlePanelDragMove(e.nativeEvent);
    }
  }, [handlePanelDragMove]);

  const handleGlobalPointerUp = useCallback(() => {
    if (crossDragRef.current) {
      handlePanelDragEnd();
    }
  }, [handlePanelDragEnd]);

  return {
    crossDrag,
    dropTarget,
    handlePanelDragStart,
    handleGlobalPointerMove,
    handleGlobalPointerUp,
  };
}

export interface UsePanelLayoutReturn {
  columns: ColumnsState;
  setColumns: React.Dispatch<React.SetStateAction<ColumnsState>>;
  resetLayout: () => void;
  isLoaded: boolean;
}

export function usePanelLayout(): UsePanelLayoutReturn {
  const [columns, setColumns] = useState<ColumnsState>(getDefaultColumns);
  const [isLoaded, useIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setColumns(saved);
    }
    useIsLoaded(true);
  }, []);

  const resetLayout = useCallback(() => {
    const defaults = getDefaultColumns();
    setColumns(defaults);
    saveToStorage(defaults);
  }, []);

  const handleSetColumns = useCallback((updater: ColumnsState | ((prev: ColumnsState) => ColumnsState)) => {
    setColumns(prev => {
      const newCols = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(newCols);
      return newCols;
    });
  }, []);

  return {
    columns,
    setColumns: handleSetColumns,
    resetLayout,
    isLoaded,
  };
}

export interface UsePanelResizeReturn {
  customHeights: Record<string, number>;
  handleResizeDown: (panelId: PanelId, e: React.PointerEvent) => void;
}

export function usePanelResize(): UsePanelResizeReturn {
  const [customHeights, setCustomHeights] = useState<Record<string, number>>({});

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

  return {
    customHeights,
    handleResizeDown,
  };
}
