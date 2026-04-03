'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Hash, 
  Database, 
  FileCode, 
  Clock, 
  User, 
  ChevronRight,
  Info,
  Binary,
  GitBranch,
  Calculator,
  Link2,
  ArrowDown
} from 'lucide-react';
import { InteractiveChainVisualization } from './interactive-chain-visualization';

// Real Ethereum block header fields (from a recent mainnet block - example values)
const BLOCK_FIELDS = [
  {
    key: 'parentHash',
    label: 'parentHash',
    value: '0x8f7b6e5d4c3b2a109876543210fedcba9876543210abcdef1234567890abcd',
    bytes: 32,
    description: 'Keccak-256 hash of the parent block\'s header',
    technical: 'Hash of the complete RLP-encoded parent header. Creates the immutable chain.',
    calculation: 'Keccak256(RLP(parentHeader))',
    color: 'bg-blue-500/20 text-blue-500',
    icon: <GitBranch className="size-4" />
  },
  {
    key: 'ommersHash',
    label: 'ommersHash',
    value: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
    bytes: 32,
    description: 'Hash of the ommer (uncle) block list',
    technical: 'Keccak-256 of the RLP-encoded list of ommer block headers. Empty list = fixed null hash.',
    calculation: 'Keccak256(RLP([])) = 0x1dcc4de8...',
    color: 'bg-gray-500/20 text-gray-500',
    icon: <Hash className="size-4" />
  },
  {
    key: 'beneficiary',
    label: 'beneficiary (coinbase)',
    value: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    bytes: 20,
    description: 'Validator address that receives block rewards and fees',
    technical: '20-byte Ethereum address of the block proposer. Rewards accumulate here.',
    calculation: 'Selected by RANDAO from validator set',
    color: 'bg-purple-500/20 text-purple-500',
    icon: <User className="size-4" />
  },
  {
    key: 'stateRoot',
    label: 'stateRoot',
    value: '0x9d3d8a3b2c1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    bytes: 32,
    description: 'Root of the state Merkle Patricia Trie after block execution',
    technical: 'Root hash of the world state trie containing all accounts, balances, nonces, code, and storage.',
    calculation: 'Merkle Patricia Trie root of all accounts',
    color: 'bg-green-500/20 text-green-500',
    icon: <Database className="size-4" />
  },
  {
    key: 'transactionsRoot',
    label: 'transactionsRoot',
    value: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    bytes: 32,
    description: 'Root of the transaction trie for this block',
    technical: 'Merkle root of all transactions in the block. Each tx indexed by its position.',
    calculation: 'MerkleRoot([RLP(tx1), RLP(tx2), ...])',
    color: 'bg-yellow-500/20 text-yellow-500',
    icon: <FileCode className="size-4" />
  },
  {
    key: 'receiptsRoot',
    label: 'receiptsRoot',
    value: '0xb2c3d4e5f6a7890123456789012345678901234567890abcdef1234567890ab',
    bytes: 32,
    description: 'Root of the receipts trie for this block',
    technical: 'Merkle root of transaction receipts containing gas used, logs, and execution status.',
    calculation: 'MerkleRoot([RLP(receipt1), RLP(receipt2), ...])',
    color: 'bg-orange-500/20 text-orange-500',
    icon: <FileCode className="size-4" />
  },
  {
    key: 'logsBloom',
    label: 'logsBloom',
    value: '0x0001a2b3... (256 bytes)',
    bytes: 256,
    description: 'Bloom filter for log entries from this block',
    technical: '2048-bit (256 byte) bloom filter allowing quick log lookup. OR of all tx receipt blooms.',
    calculation: 'Bitwise OR of all receipt bloom filters',
    color: 'bg-pink-500/20 text-pink-500',
    icon: <Binary className="size-4" />
  },
  {
    key: 'difficulty',
    label: 'difficulty',
    value: '0x00',
    bytes: 8,
    description: 'Difficulty value (always 0 in PoS)',
    technical: 'Legacy field from PoW era. Set to 0 in Proof of Stake.',
    calculation: 'Fixed at 0 for PoS',
    color: 'bg-gray-400/20 text-gray-400',
    icon: <Calculator className="size-4" />
  },
  {
    key: 'number',
    label: 'number',
    value: '18765321',
    bytes: 8,
    description: 'Block number (sequential height)',
    technical: 'Sequential block height starting from 0 (genesis). Parent number + 1.',
    calculation: 'parent.number + 1',
    color: 'bg-cyan-500/20 text-cyan-500',
    icon: <Hash className="size-4" />
  },
  {
    key: 'gasLimit',
    label: 'gasLimit',
    value: '30000000',
    bytes: 8,
    description: 'Maximum gas allowed in this block',
    technical: 'Hard limit of 30M gas per block. Determines max computation.',
    calculation: 'Protocol defined (30,000,000)',
    color: 'bg-red-500/20 text-red-500',
    icon: <Calculator className="size-4" />
  },
  {
    key: 'gasUsed',
    label: 'gasUsed',
    value: '15243891',
    bytes: 8,
    description: 'Total gas used by all transactions',
    technical: 'Sum of gas consumed by every transaction in the block.',
    calculation: 'Σ(tx.gasUsed) for all tx in block',
    color: 'bg-red-400/20 text-red-400',
    icon: <Calculator className="size-4" />
  },
  {
    key: 'timestamp',
    label: 'timestamp',
    value: '1699152000',
    bytes: 8,
    description: 'Unix timestamp of block creation',
    technical: 'Seconds since Unix epoch (Jan 1, 1970). Must be > parent timestamp.',
    calculation: 'System time when block proposed',
    color: 'bg-indigo-500/20 text-indigo-500',
    icon: <Clock className="size-4" />
  },
  {
    key: 'extraData',
    label: 'extraData',
    value: '0x4e65746865726d696e642d4531',
    bytes: 32,
    description: 'Arbitrary extra data field',
    technical: 'Max 32 bytes. Often contains validator client name/version.',
    calculation: 'Validator defined',
    color: 'bg-teal-500/20 text-teal-500',
    icon: <Info className="size-4" />
  },
  {
    key: 'mixHash',
    label: 'mixHash',
    value: '0x0000000000000000000000000000000000000000000000000000000000000000',
    bytes: 32,
    description: 'Mix hash from PoW (now 0s in PoS)',
    technical: 'Legacy from PoW. Set to zeros in PoS or contains RANDAO reveal.',
    calculation: '0x00...00 for PoS',
    color: 'bg-gray-400/20 text-gray-400',
    icon: <Hash className="size-4" />
  },
  {
    key: 'nonce',
    label: 'nonce',
    value: '0x0000000000000000',
    bytes: 8,
    description: 'Nonce from PoW (now 0s in PoS)',
    technical: 'Legacy field from PoW. Always 0 in PoS.',
    calculation: 'Fixed at 0 for PoS',
    color: 'bg-gray-400/20 text-gray-400',
    icon: <Hash className="size-4" />
  }
];

// Educational steps with correlations
const LEARNING_STEPS = [
  {
    id: 'intro',
    title: 'Ethereum Block Header Anatomy',
    description: 'An Ethereum block header contains 15 fields totaling exactly 508 bytes (excluding dynamic lists). Each field plays a critical role in consensus, validation, and chain integrity.',
    fields: [],
    correlation: 'The block hash is computed from the RLP encoding of ALL these fields together.'
  },
  {
    id: 'chain',
    title: 'Step 1: Chain Integrity (parentHash, number)',
    description: 'parentHash cryptographically links to the previous block. Combined with number (sequential height), this creates the immutable blockchain structure.',
    fields: ['parentHash', 'number'],
    correlation: 'parentHash = Keccak256(RLP(parentHeader)). number = parent.number + 1. If parentHash is wrong, the entire chain is invalid.'
  },
  {
    id: 'state',
    title: 'Step 2: World State (stateRoot)',
    description: 'After executing all transactions, the global state (all accounts) is hashed into stateRoot. This enables light clients to verify account balances without downloading the entire chain.',
    fields: ['stateRoot'],
    correlation: 'stateRoot changes after EVERY block based on transaction execution. It is the Merkle root of all accounts.'
  },
  {
    id: 'tries',
    title: 'Step 3: Merkle Tries (transactionsRoot, receiptsRoot)',
    description: 'Two additional Merkle trees: one for transactions (input data) and one for receipts (execution results). Enables efficient verification of inclusion.',
    fields: ['transactionsRoot', 'receiptsRoot', 'logsBloom'],
    correlation: 'These three fields form the "evidence" trie. logsBloom is a bloom filter for efficient log lookup (bitwise OR of all receipt blooms).'
  },
  {
    id: 'consensus',
    title: 'Step 4: Consensus & Rewards (beneficiary, timestamp, extraData)',
    description: 'beneficiary identifies the validator who proposed this block (receives fees). timestamp ensures sequential ordering.',
    fields: ['beneficiary', 'timestamp', 'extraData'],
    correlation: 'beneficiary is selected by RANDAO from the validator set. timestamp must be > parent and < now + 15 seconds.'
  },
  {
    id: 'limits',
    title: 'Step 5: Resource Limits (gasLimit, gasUsed)',
    description: 'gasLimit caps computation per block (30M). gasUsed tracks actual consumption. Together they measure network load.',
    fields: ['gasLimit', 'gasUsed', 'difficulty', 'mixHash', 'nonce', 'ommersHash'],
    correlation: 'gasUsed/gasLimit ratio determines next block\'s base fee (EIP-1559). Legacy fields (difficulty, mixHash, nonce) are 0 in PoS. ommersHash is always null hash since PoS removed uncles.'
  },
  {
    id: 'hash',
    title: 'Step 6: Computing the Block Hash',
    description: 'Finally, all 15 fields are RLP-encoded and hashed to create the unique block identifier.',
    fields: [],
    correlation: 'blockHash = Keccak256(RLP([parentHash, ommersHash, beneficiary, stateRoot, transactionsRoot, receiptsRoot, logsBloom, difficulty, number, gasLimit, gasUsed, timestamp, extraData, mixHash, nonce]))'
  }
];

// RLP encoding example
const RLP_EXAMPLE = `
RLP Encoding Process:
1. Each field is encoded based on type:
   - Byte arrays: prefix + data
   - Integers: converted to minimal byte arrays
   - Lists: recursively encoded with list prefix

2. For our block header:
   parentHash (32 bytes)    → 0x80 + 32 + [32 bytes]
   beneficiary (20 bytes)   → 0x80 + 20 + [20 bytes]
   ... (all 15 fields)

3. Result: ~540+ byte RLP-encoded header

4. Final hash:
    blockHash = Keccak256(RLP(header))`;

export function BlockInternalsSimulator() {
  const t = useTranslations();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showRPLEncoding, setShowRPLEncoding] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentStep = LEARNING_STEPS[activeStep];
  const isLastStep = activeStep === LEARNING_STEPS.length - 1;

  const visibleFields = currentStep.fields.length > 0 
    ? currentStep.fields 
    : BLOCK_FIELDS.map(f => f.key);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Compact */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Box className="size-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Ethereum Block Structure
              </h1>
              <p className="text-xs text-muted-foreground">
                Interactive exploration of blockchain internals
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO: Interactive Chain Visualization - Takes up most of the screen */}
      <section className="min-h-[85vh] flex flex-col justify-center px-4 py-8 bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/10 to-background">
        <div className="mx-auto max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-4">
              <Link2 className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Interactive Exploration</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              The Blockchain Chain
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every block is cryptographically linked to its parent through the parentHash field. 
              Click on any block below to explore how this creates an immutable chain of history.
            </p>
          </motion.div>

          {/* Large Interactive Chain Visualization */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 md:p-8 shadow-xl">
            <InteractiveChainVisualization />
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Continue to detailed field exploration</span>
              <ArrowDown className="size-4 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* DETAILED EXPLORATION SECTION */}
      <AnimatePresence>
        {showDetails && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-12 border-t border-border"
          >
            <div className="mx-auto max-w-7xl">
              {/* Section Header */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Detailed Field Exploration</h2>
                <p className="text-muted-foreground">
                  Step-by-step breakdown of all 15 fields in an Ethereum block header
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Learning Progress</span>
                  <span className="font-medium">{activeStep + 1} / {LEARNING_STEPS.length}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeStep + 1) / LEARNING_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {LEARNING_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                      idx === activeStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {idx + 1}. {step.title.split(':')[0]}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: Current Step Info */}
                <div className="space-y-6">
                  {/* Step Description */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-3">{currentStep.title}</h3>
                    <p className="text-muted-foreground mb-4">{currentStep.description}</p>
                    
                    {currentStep.correlation && (
                      <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                        <h4 className="text-sm font-medium text-primary mb-2">Correlation & Technical Detail:</h4>
                        <p className="text-sm text-muted-foreground">{currentStep.correlation}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="px-4 py-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => !isLastStep && setActiveStep(activeStep + 1)}
                      disabled={isLastStep}
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
                    >
                      {isLastStep ? 'Complete' : 'Next Step'}
                    </button>
                  </div>

                  {/* RLP Encoding Toggle */}
                  <button
                    onClick={() => setShowRPLEncoding(!showRPLEncoding)}
                    className="w-full p-4 rounded-xl border border-border bg-card text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Binary className="size-5 text-primary" />
                        <span className="font-medium">RLP Encoding & Block Hash Calculation</span>
                      </div>
                      <ChevronRight className={`size-5 transition-transform ${showRPLEncoding ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {showRPLEncoding && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="rounded-xl border border-border bg-secondary/30 p-4 overflow-hidden"
                      >
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{RLP_EXAMPLE}</pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: Field Explorer */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-4">Block Header Fields</h3>
                  {BLOCK_FIELDS.filter(field => visibleFields.includes(field.key)).map((field) => {
                    const isSelected = selectedField === field.key;
                    
                    return (
                      <motion.button
                        key={field.key}
                        onClick={() => setSelectedField(isSelected ? null : field.key)}
                        className={`w-full text-left rounded-lg border p-4 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex size-8 items-center justify-center rounded ${field.color}`}>
                            {field.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{field.label}</span>
                              <span className="text-xs text-muted-foreground">{field.bytes} bytes</span>
                            </div>
                            <code className="text-xs text-muted-foreground block truncate mt-1">
                              {field.value}
                            </code>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-3 space-y-2"
                              >
                                <p className="text-sm text-muted-foreground">{field.description}</p>
                                <div className="rounded bg-secondary/50 p-2 text-xs">
                                  <span className="text-primary font-medium">Technical: </span>
                                  {field.technical}
                                </div>
                                <div className="rounded bg-secondary/50 p-2 text-xs">
                                  <span className="text-primary font-medium">Calculation: </span>
                                  <code>{field.calculation}</code>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Block Size Summary */}
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-4">Block Header Size Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-primary">15</p>
                    <p className="text-xs text-muted-foreground">Total Fields</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-primary">508</p>
                    <p className="text-xs text-muted-foreground">Bytes (Fixed)</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Merkle Roots</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <p className="text-2xl font-bold text-primary">Keccak-256</p>
                    <p className="text-xs text-muted-foreground">Hash Function</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
