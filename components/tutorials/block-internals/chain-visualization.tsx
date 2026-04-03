'use client';

import { motion } from 'framer-motion';
import { Box, ArrowRight, Link2, Hash } from 'lucide-react';

interface ChainBlockProps {
  number: number;
  hash: string;
  isActive?: boolean;
  isParent?: boolean;
  isChild?: boolean;
}

function ChainBlock({ number, hash, isActive, isParent, isChild }: ChainBlockProps) {
  return (
    <motion.div
      initial={isActive ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative rounded-xl border-2 p-4 min-w-[140px] ${
        isActive 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : isParent
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
          : 'border-muted bg-muted/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Box className={`size-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={`font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          Block #{number}
        </span>
      </div>
      <code className="text-xs text-muted-foreground block truncate">
        {hash.slice(0, 18)}...
      </code>
      {isActive && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full"
        >
          Current
        </motion.div>
      )}
    </motion.div>
  );
}

interface ChainConnectorProps {
  label?: string;
  showHash?: boolean;
  hashValue?: string;
}

function ChainConnector({ label, showHash, hashValue }: ChainConnectorProps) {
  return (
    <div className="flex flex-col items-center px-2">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative h-0.5 w-20 bg-primary/50"
      >
        <motion.div
          animate={{ x: [0, 80] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute top-0 left-0 w-4 h-0.5 bg-primary"
        />
      </motion.div>
      {showHash && hashValue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-2 flex items-center gap-1 bg-secondary/50 rounded px-2 py-1"
        >
          <Link2 className="size-3 text-blue-500" />
          <span className="text-xs text-muted-foreground">parentHash:</span>
          <code className="text-xs text-primary">{hashValue.slice(0, 12)}...</code>
        </motion.div>
      )}
      {label && !showHash && (
        <span className="mt-1 text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

export function ChainVisualization() {
  const parentHash = '0x8f7b6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcd';
  const currentHash = '0x9d3d8a3b2c1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f';

  return (
    <div className="rounded-xl border border-border bg-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="size-5 text-primary" />
        <h3 className="font-semibold">Block Chain Structure</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Each block references its parent via parentHash, creating an immutable chain. 
        Change any parent → all children become invalid.
      </p>

      <div className="flex items-center justify-center overflow-x-auto pb-4">
        {/* Parent Block */}
        <ChainBlock 
          number={18765320} 
          hash={parentHash}
          isParent={true}
        />
        
        {/* Connector to Parent */}
        <ChainConnector 
          showHash={true}
          hashValue={parentHash}
        />
        
        {/* Current Block */}
        <ChainBlock 
          number={18765321} 
          hash={currentHash}
          isActive={true}
        />
        
        {/* Connector to Child */}
        <ChainConnector 
          label="next block inherits this hash"
        />
        
        {/* Child Block (Ghost) */}
        <ChainBlock 
          number={18765322} 
          hash="0x... (pending)"
          isChild={true}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3 text-center">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Parent Block</p>
          <p className="text-xs text-muted-foreground mt-1">
            Its hash becomes the next block&apos;s parentHash
          </p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-sm font-medium text-primary">Current Block</p>
          <p className="text-xs text-muted-foreground mt-1">
            Contains parentHash linking to previous
          </p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm font-medium text-muted-foreground">Child Block</p>
          <p className="text-xs text-muted-foreground mt-1">
            Will reference current block&apos;s hash
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-secondary/50 p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Chain Integrity:</strong> If any transaction in Block #18,765,320 
          were changed, its hash would change, breaking the link to Block #18,765,321. This is what makes 
          blockchains immutable.
        </p>
      </div>
    </div>
  );
}
