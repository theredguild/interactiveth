'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Wallet, 
  CheckCircle2, 
  Send, 
  Clock, 
  Shield,
  FileText,
  ToggleLeft,
  ToggleRight,
  Hash,
  User,
  X,
  AlertCircle,
  ExternalLink,
  Network,
  ChevronDown,
  Code2,
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  color: string;
}

interface Transaction {
  from: Wallet;
  to: Wallet;
  value: number;
  gasLimit?: number;
  gasPrice?: number;
  nonce: number;
  hash?: string;
  status: 'draft' | 'signed' | 'pending' | 'confirmed';
  timestamp?: number;
}

const WALLETS: Wallet[] = [
  { id: 'alice', name: 'Alice', address: '0x742d...8fA1', balance: 5.5, color: 'bg-blue-500' },
  { id: 'bob', name: 'Bob', address: '0x1234...5678', balance: 3.2, color: 'bg-green-500' },
  { id: 'charlie', name: 'Charlie', address: '0xabcd...ef01', balance: 8.7, color: 'bg-purple-500' },
];

// Fake Wallet Popup Component
interface FakeWalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  showGas: boolean;
}

function FakeWalletPopup({ isOpen, onClose, onConfirm, transaction, showGas }: FakeWalletPopupProps) {
  if (!isOpen || !transaction) return null;

  const totalCost = transaction.value + (showGas && transaction.gasLimit && transaction.gasPrice 
    ? (transaction.gasLimit * transaction.gasPrice) / 1e9 
    : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-white rounded-full flex items-center justify-center">
                    <Wallet className="size-5 text-orange-500" />
                  </div>
                  <span className="text-white font-semibold">MetaMask Clone</span>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Network Badge */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span>Ethereum Mainnet</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </div>
                </div>

                {/* Account Info */}
                <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                  <div className={`size-10 rounded-full ${transaction.from.color} flex items-center justify-center text-white font-bold`}>
                    {transaction.from.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{transaction.from.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.from.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{transaction.from.balance} ETH</p>
                    <p className="text-xs text-muted-foreground">~$2,750.00</p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contract Interaction</span>
                    <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">ETH Transfer</span>
                  </div>
                  
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From</span>
                      <span className="font-mono">{transaction.from.address.slice(0, 10)}...{transaction.from.address.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To</span>
                      <span className="font-mono">{transaction.to.address.slice(0, 10)}...{transaction.to.address.slice(-4)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Value</span>
                      <div className="text-right">
                        <p className="font-bold">{transaction.value} ETH</p>
                        <p className="text-xs text-muted-foreground">~${(transaction.value * 500).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {showGas && (
                    <div className="border-t border-border pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gas Fee</span>
                        <span>{((transaction.gasLimit || 21000) * (transaction.gasPrice || 20) / 1e9).toFixed(6)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Fee</span>
                        <span>0.0005 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">{totalCost.toFixed(6)} ETH</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <AlertCircle className="size-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-600">
                    This is a simulation. No real transaction will be executed.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-border px-4 py-3 font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={onConfirm}
                    className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-secondary/50 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Site: InteractiveETH</span>
                <ExternalLink className="size-3" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SimpleTransactionsSimulator() {
  const [showGas, setShowGas] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [selectedSender, setSelectedSender] = useState<Wallet>(WALLETS[0]);
  const [selectedReceiver, setSelectedReceiver] = useState<Wallet>(WALLETS[1]);
  const [amount, setAmount] = useState('0.5');
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [step, setStep] = useState<'form' | 'signing' | 'broadcasting' | 'confirmed'>('form');
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const createTransaction = useCallback(() => {
    const value = parseFloat(amount);
    if (value <= 0 || value > selectedSender.balance) return;

    const tx: Transaction = {
      from: selectedSender,
      to: selectedReceiver,
      value,
      gasLimit: showGas ? 21000 : undefined,
      gasPrice: showGas ? 20 : undefined,
      nonce: txHistory.filter(t => t.from.id === selectedSender.id).length,
      status: 'draft',
    };

    setCurrentTx(tx);
    setStep('signing');
    
    // Open wallet popup if enabled
    if (showWallet) {
      setIsWalletOpen(true);
    }
  }, [amount, selectedSender, selectedReceiver, showGas, txHistory, showWallet]);

  const signTransaction = useCallback(() => {
    if (!currentTx) return;
    
    setStep('broadcasting');
    setIsWalletOpen(false);
    
    setTimeout(() => {
      const signedTx: Transaction = {
        ...currentTx,
        status: 'pending',
        timestamp: Date.now(),
      };
      setCurrentTx(signedTx);
      
      setTimeout(() => {
        const confirmedTx: Transaction = {
          ...signedTx,
          status: 'confirmed',
          hash: `0x${Math.random().toString(16).slice(2, 42)}`,
        };
        setCurrentTx(confirmedTx);
        setTxHistory(prev => [confirmedTx, ...prev]);
        setStep('confirmed');
      }, 2000);
    }, 1000);
  }, [currentTx]);

  const handleReject = useCallback(() => {
    setIsWalletOpen(false);
    // Reset to form step
    setStep('form');
    setCurrentTx(null);
  }, []);

  const reset = useCallback(() => {
    setCurrentTx(null);
    setStep('form');
    setAmount('0.5');
    setIsWalletOpen(false);
  }, []);

  const totalCost = currentTx 
    ? currentTx.value + (showGas && currentTx.gasLimit && currentTx.gasPrice 
        ? (currentTx.gasLimit * currentTx.gasPrice) / 1e9 
        : 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Fake Wallet Popup */}
      <FakeWalletPopup 
        isOpen={isWalletOpen}
        onClose={handleReject}
        onConfirm={signTransaction}
        transaction={currentTx}
        showGas={showGas}
      />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Transactions</h1>
              <p className="text-sm text-muted-foreground">
                Learn how Ethereum transactions work from start to finish
              </p>
            </div>
            
            {/* Toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowWallet(!showWallet)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                {showWallet ? (
                  <><ToggleRight className="size-4 text-primary" /> Wallet: ON</>
                ) : (
                  <><ToggleLeft className="size-4 text-muted-foreground" /> Wallet: OFF</>
                )}
              </button>
              
              <button
                onClick={() => setShowGas(!showGas)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                {showGas ? (
                  <><ToggleRight className="size-4 text-primary" /> Gas: ON</>
                ) : (
                  <><ToggleLeft className="size-4 text-muted-foreground" /> Gas: OFF</>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Transaction Form / Flow */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <Send className="size-5 text-primary" />
                    Create Transaction
                  </h2>
                  
                  {/* Sender Selection */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">From (Sender)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {WALLETS.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedSender(wallet)}
                          className={`rounded-lg border p-3 text-left transition-colors ${
                            selectedSender.id === wallet.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-secondary'
                          }`}
                        >
                          <div className={`mb-1 size-6 rounded-full ${wallet.color}`} />
                          <div className="text-sm font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{wallet.balance} ETH</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Receiver Selection */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">To (Receiver)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {WALLETS.filter(w => w.id !== selectedSender.id).map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedReceiver(wallet)}
                          className={`rounded-lg border p-3 text-left transition-colors ${
                            selectedReceiver.id === wallet.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-secondary'
                          }`}
                        >
                          <div className={`mb-1 size-6 rounded-full ${wallet.color}`} />
                          <div className="text-sm font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{wallet.address.slice(0, 6)}...</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Amount (ETH)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      max={selectedSender.balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max: {selectedSender.balance} ETH
                    </p>
                  </div>

                  {/* Gas Info (if enabled) */}
                  {showGas && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 rounded-lg bg-secondary/50 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="size-4 text-primary" />
                        <span className="text-sm font-medium">Gas Details</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Limit:</span>
                          <span>21,000 units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Price:</span>
                          <span>20 Gwei</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Fee:</span>
                          <span>0.00042 ETH</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={createTransaction}
                    disabled={parseFloat(amount) <= 0 || parseFloat(amount) > selectedSender.balance}
                    className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
                  >
                    Create Transaction
                  </button>
                </motion.div>
              )}

              {step === 'signing' && currentTx && (
                <motion.div
                  key="signing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    Sign Transaction
                  </h2>
                  
                  <div className="mb-4 rounded-lg bg-secondary/50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">From:</span>
                      <span className="text-sm font-medium">{currentTx.from.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">To:</span>
                      <span className="text-sm font-medium">{currentTx.to.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Value:</span>
                      <span className="text-sm font-medium">{currentTx.value} ETH</span>
                    </div>
                    {showGas && (
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Gas:</span>
                        <span className="text-sm font-medium">21,000 × 20 Gwei</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total Cost:</span>
                        <span className="text-sm font-bold text-primary">{totalCost.toFixed(6)} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg bg-primary/10 border border-primary/30 p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-primary">Signing:</strong> Your wallet uses your private key to create a cryptographic signature that proves you authorized this transaction.
                    </p>
                  </div>

                  {!showWallet && (
                    <button
                      onClick={signTransaction}
                      className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground"
                    >
                      Sign & Send
                    </button>
                  )}
                  
                  {showWallet && (
                    <div className="rounded-lg bg-secondary/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Check the wallet popup to confirm this transaction
                      </p>
                      <button
                        onClick={() => setIsWalletOpen(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Re-open wallet popup
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {(step === 'broadcasting' || step === 'confirmed') && currentTx && (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {step === 'confirmed' ? (
                      <>
                        <CheckCircle2 className="size-8 text-green-500" />
                        <div>
                          <h2 className="text-lg font-semibold">Transaction Confirmed!</h2>
                          <p className="text-sm text-muted-foreground">
                            Block #{Math.floor(Math.random() * 1000000 + 18000000)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="size-8 text-primary animate-spin" />
                        <div>
                          <h2 className="text-lg font-semibold">Processing...</h2>
                          <p className="text-sm text-muted-foreground">
                            Broadcasting to the network
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {currentTx.hash && (
                    <div className="mb-4 rounded-lg bg-secondary/50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                      </div>
                      <code className="text-xs break-all">{currentTx.hash}</code>
                    </div>
                  )}

                  <button
                    onClick={reset}
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 font-medium hover:bg-secondary"
                  >
                    Send Another Transaction
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transaction History */}
            {txHistory.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold">Recent Transactions</h3>
                <div className="space-y-2">
                  {txHistory.slice(0, 5).map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${tx.from.color}`} />
                        <ArrowRight className="size-3 text-muted-foreground" />
                        <div className={`size-2 rounded-full ${tx.to.color}`} />
                        <span className="text-sm">{tx.value} ETH</span>
                      </div>
                      <CheckCircle2 className="size-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Educational Content */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">What is a Transaction?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                An Ethereum transaction is a signed data package that stores a message to be sent from an externally owned account to another account on the blockchain.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                  <User className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">From (Sender)</p>
                    <p className="text-xs text-muted-foreground">
                      The address that is sending the transaction. Must have enough ETH to cover the value + gas fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                  <ArrowRight className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">To (Receiver)</p>
                    <p className="text-xs text-muted-foreground">
                      The destination address. Can be an externally owned account or a smart contract.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                  <Wallet className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Value</p>
                    <p className="text-xs text-muted-foreground">
                      The amount of ETH to transfer from sender to receiver.
                    </p>
                  </div>
                </div>

                {showGas && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3"
                  >
                    <FileText className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Gas & Fees</p>
                      <p className="text-xs text-muted-foreground">
                        Computational cost of executing the transaction. Paid to validators for including your transaction in a block.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                  <Hash className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Nonce</p>
                    <p className="text-xs text-muted-foreground">
                      A counter that increments with each transaction from an account. Prevents replay attacks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Structure Code Example */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Code2 className="size-5 text-primary" />
                Transaction Structure
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                This is what a real Ethereum transaction looks like under the hood:
              </p>
              <CodeBlock
                code={`{
  "nonce": "0x01",
  "gasPrice": "0x04a817c800",
  "gasLimit": "0x5208",
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fA1",
  "value": "0x0de0b6b3a7640000",
  "data": "0x",
  "v": "0x1c",
  "r": "0x88ff6cf0fefd94db46111149ae4bfc179e9b94721fffd821d38d16464b3f71d0",
  "s": "0x45e0aff800961cfce805daef7016b9b675c137a6a41a548f7b60a3484c06a33a"
}

// nonce: transaction counter (prevents replay attacks)
// gasPrice: 20 Gwei = 0x04a817c800
// gasLimit: 21,000 = 0x5208 (simple ETH transfer)
// value: 1 ETH = 0x0de0b6b3a7640000 (in wei)
// data: empty for simple transfers
// v, r, s: cryptographic signature components`}
                language="json"
                title="Raw Transaction (RLP Encoded)"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Transaction Lifecycle</h2>
              <div className="space-y-2">
                {[
                  { step: 1, label: 'Create', desc: 'Define from, to, and value' },
                  { step: 2, label: 'Sign', desc: showWallet ? 'Confirm in wallet popup' : 'Cryptographic proof of authorization' },
                  { step: 3, label: 'Broadcast', desc: 'Send to the network' },
                  { step: 4, label: 'Pending', desc: 'Waiting in the mempool' },
                  { step: 5, label: 'Confirmed', desc: 'Included in a block' },
                ].map((s) => (
                  <div 
                    key={s.step}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      step === 'form' && s.step === 1 ? 'bg-primary/10 border border-primary/30' :
                      step === 'signing' && s.step === 2 ? 'bg-primary/10 border border-primary/30' :
                      step === 'broadcasting' && (s.step === 3 || s.step === 4) ? 'bg-primary/10 border border-primary/30' :
                      step === 'confirmed' && s.step === 5 ? 'bg-green-500/10 border border-green-500/30' :
                      'bg-secondary/50'
                    }`}
                  >
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step === 'confirmed' && s.step <= 5 ? 'bg-green-500 text-white' :
                      step === 'broadcasting' && s.step <= 4 ? 'bg-primary text-primary-foreground' :
                      step === 'signing' && s.step <= 2 ? 'bg-primary text-primary-foreground' :
                      step === 'form' && s.step === 1 ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Toggle Info */}
            {showWallet && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-6"
              >
                <div className="flex items-start gap-3">
                  <Wallet className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Wallet Simulation Active</p>
                    <p className="text-xs text-muted-foreground">
                      When you create a transaction, a fake wallet popup will appear. This simulates how real wallet extensions (like MetaMask) work. You can approve or reject the transaction.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
