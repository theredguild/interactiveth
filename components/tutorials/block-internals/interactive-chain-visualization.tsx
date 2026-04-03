'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Link2, Hash, Info, Shield, AlertTriangle } from 'lucide-react';

interface BlockData {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  validator: string;
  txCount: number;
  gasUsed: string;
}

const CHAIN_DATA: BlockData[] = [
  {
    number: 18765319,
    hash: '0x7f6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcdef12',
    parentHash: '0x6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcdef1234',
    timestamp: '2023-11-05 08:23:15 UTC',
    validator: '0x9522...BAfe5',
    txCount: 142,
    gasUsed: '12.4M / 30M'
  },
  {
    number: 18765320,
    hash: '0x8f7b6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcd',
    parentHash: '0x7f6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcdef12',
    timestamp: '2023-11-05 08:23:27 UTC',
    validator: '0x1234...5678',
    txCount: 189,
    gasUsed: '15.2M / 30M'
  },
  {
    number: 18765321,
    hash: '0x9d3d8a3b2c1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    parentHash: '0x8f7b6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcd',
    timestamp: '2023-11-05 08:23:39 UTC',
    validator: '0xabcd...ef01',
    txCount: 156,
    gasUsed: '14.8M / 30M'
  },
  {
    number: 18765322,
    hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    parentHash: '0x9d3d8a3b2c1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    timestamp: '2023-11-05 08:23:51 UTC',
    validator: '0x9876...5432',
    txCount: 203,
    gasUsed: '18.1M / 30M'
  }
];

interface ChainBlockProps {
  block: BlockData;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function ChainBlock({ block, isActive, isSelected, onClick, index }: ChainBlockProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      onClick={onClick}
      className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 min-w-[160px] ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105'
          : isActive
          ? 'border-accent bg-accent/5 hover:border-accent/70 hover:bg-accent/10'
          : 'border-border bg-card hover:border-primary/30 hover:bg-secondary/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Box className={`size-5 ${isSelected ? 'text-primary' : isActive ? 'text-accent' : 'text-muted-foreground'}`} />
        <span className={`font-bold ${isSelected ? 'text-primary' : isActive ? 'text-accent' : 'text-muted-foreground'}`}>
          #{block.number}
        </span>
      </div>
      <code className="text-xs text-muted-foreground block truncate max-w-[140px]">
        {block.hash.slice(0, 12)}...
      </code>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full"
        >
          Selected
        </motion.div>
      )}
    </motion.button>
  );
}

interface ChainConnectorProps {
  index: number;
  onHover: (index: number | null) => void;
  isHovered: boolean;
}

function ChainConnector({ index, onHover, isHovered }: ChainConnectorProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center relative cursor-pointer py-6 px-4 -mx-2"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Connection line with glow effect - centered within larger hit area */}
      <div className="relative h-1 w-20 bg-border rounded-full overflow-visible">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/30 rounded-full blur-sm"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        />
        
        {/* Base line */}
        <motion.div
          animate={{ 
            backgroundColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--border))',
          }}
          className="absolute inset-0 rounded-full"
        />
        
        {/* Always-running moving dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
          initial={{ left: 0 }}
          animate={{ left: ['0%', '90%'] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "linear"
          }}
        />
        
        {/* Second moving dot (delayed) for more visual interest */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/60 rounded-full"
          initial={{ left: 0 }}
          animate={{ left: ['0%', '90%'] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "linear",
            delay: 1.25
          }}
        />
      </div>
    </div>
  );
}

export function InteractiveChainVisualization() {
  // First block selected by default
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(CHAIN_DATA[0]);
  const [hoveredConnection, setHoveredConnection] = useState<{from: BlockData, to: BlockData, index: number} | null>(null);

  // Fixed header only shows selected block info - never changes on hover
  const connectionInfo = selectedBlock ? {
    from: CHAIN_DATA.find(b => b.hash === selectedBlock.parentHash) || CHAIN_DATA[0],
    to: selectedBlock,
  } : null;

  // Get hovered connection info
  const hoveredConnectionInfo = hoveredConnection;

  return (
    <div className="w-full">
      {/* Fixed Info Panel - Shows selected block's parentHash info, never changes on hover */}
      <div className="mb-6 min-h-[80px]">
        <AnimatePresence mode="wait">
          {connectionInfo ? (
            <motion.div
              key={`${connectionInfo.from.number}-${connectionInfo.to.number}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-4"
            >
              <div className="flex items-center gap-4">
                {/* Arrow pointing down */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Block #{connectionInfo.from.number}</div>
                  <div className="w-0.5 h-6 bg-primary/50 relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary/50"></div>
                  </div>
                </div>
                
                {/* Connection Info */}
                <div className="flex-1 flex items-center gap-2">
                  <Link2 className="size-4 text-primary" />
                  <div>
                    <span className="text-sm text-muted-foreground">parentHash: </span>
                    <code className="text-sm text-primary font-mono">{connectionInfo.to.parentHash.slice(0, 20)}...</code>
                  </div>
                </div>
                
                {/* Target block */}
                <div className="text-sm text-muted-foreground">
                  → Block #{connectionInfo.to.number}
                </div>
              </div>
              
              <p className="mt-2 text-xs text-muted-foreground">
                Block #{connectionInfo.to.number} references Block #{connectionInfo.from.number}&apos;s hash as its parentHash, creating the chain link
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Click a block to see its parentHash link
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chain Visualization */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-8 pt-4 px-4">
        {CHAIN_DATA.map((block, index) => (
          <div key={block.number} className="flex items-center">
            <div>
              <ChainBlock
                block={block}
                isActive={index === 1}
                isSelected={selectedBlock?.number === block.number}
                onClick={() => setSelectedBlock(selectedBlock?.number === block.number ? null : block)}
                index={index}
              />
            </div>
            
            {index < CHAIN_DATA.length - 1 && (
              <ChainConnector 
                index={index}
                onHover={(idx) => {
                  if (idx !== null) {
                    setHoveredConnection({
                      from: block,
                      to: CHAIN_DATA[index + 1],
                      index: idx
                    });
                  } else {
                    setHoveredConnection(null);
                  }
                }}
                isHovered={hoveredConnection?.index === index}
              />
            )}
          </div>
        ))}
      </div>

      {/* Hover Tooltip - Below the chain, above block details */}
      <div className="min-h-[60px] mb-4">
        <AnimatePresence>
          {hoveredConnectionInfo && (
            <motion.div
              key={`tooltip-${hoveredConnectionInfo.index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Connection</span>
                <span className="text-sm font-medium">{hoveredConnectionInfo.from.number}</span>
                <span className="text-sm text-muted-foreground">→</span>
                <span className="text-sm font-medium">{hoveredConnectionInfo.to.number}</span>
              </div>
              
              <div className="h-4 w-px bg-border mx-2" />
              
              <div className="flex items-center gap-2">
                <Link2 className="size-4 text-accent" />
                <span className="text-sm text-muted-foreground">parentHash:</span>
                <code className="text-sm text-accent font-mono">{hoveredConnectionInfo.to.parentHash.slice(0, 16)}...</code>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Block Details */}
      <AnimatePresence mode="wait">
        {selectedBlock ? (
          <motion.div
            key={selectedBlock.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Box className="size-6 text-primary" />
              <h3 className="text-xl font-bold">Block #{selectedBlock.number} Details</h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="ml-auto text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Hash className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Block Hash</p>
                    <code className="text-sm">{selectedBlock.hash.slice(0, 30)}...</code>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link2 className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Parent Hash</p>
                    <code className="text-sm">{selectedBlock.parentHash.slice(0, 30)}...</code>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Info className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-medium">{selectedBlock.timestamp}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="size-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Validator</p>
                    <code className="text-sm">{selectedBlock.validator}</code>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Box className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                    <p className="text-sm font-medium">{selectedBlock.txCount} txs</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gas Used</p>
                    <p className="text-sm font-medium">{selectedBlock.gasUsed}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Chain Link:</strong> This block&apos;s hash becomes the{' '}
                <code className="text-primary bg-primary/10 px-1 rounded">parentHash</code> of the next block. 
                This cryptographic link makes the blockchain immutable—change any block and you break all subsequent links.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-muted-foreground"
          >
            <p className="text-sm">Click any block above to explore its details and see how the chain links together</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Note */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-secondary/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="size-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Parent Hash Link</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Each block references its parent&apos;s hash, creating an unbreakable chain
          </p>
        </div>
        
        <div className="rounded-xl bg-primary/10 p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="size-4 text-primary" />
            <p className="text-sm font-semibold text-primary">Immutability</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Changing any historical block would change its hash, breaking all child blocks
          </p>
        </div>
        
        <div className="rounded-xl bg-secondary/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Keccak-256</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Block hashes are computed using Keccak-256, Ethereum&apos;s hashing algorithm
          </p>
        </div>
      </div>
    </div>
  );
}
