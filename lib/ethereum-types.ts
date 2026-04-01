export interface Transaction {
  id: string;
  from: string;
  to: string;
  value: number;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  data: string;
  hash: string;
  signature: string | null;
  status: 'pending' | 'signed' | 'broadcast' | 'in-mempool' | 'in-block' | 'confirmed';
  timestamp: number;
  createdBy: 'user' | 'dapp';
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: Transaction[];
  gasUsed: number;
  gasLimit: number;
  miner: string;
  status: 'building' | 'proposed' | 'attested' | 'finalized';
  attestations: number;
}

export interface Validator {
  id: string;
  address: string;
  name: string;
  stake: number;
  isProposer: boolean;
  hasAttested: boolean;
  status: 'idle' | 'proposing' | 'attesting' | 'finalized';
}

export interface Node {
  id: string;
  name: string;
  type: 'execution' | 'consensus';
  location: string;
  status: 'idle' | 'receiving' | 'propagating' | 'validating';
  transactionsReceived: number;
}

export interface Wallet {
  address: string;
  name: string;
  balance: number;
  nonce: number;
}

export type SimulationStep = 
  | 'idle'
  | 'creating-tx'
  | 'signing-tx'
  | 'broadcasting'
  | 'mempool'
  | 'selecting-validator'
  | 'building-block'
  | 'proposing-block'
  | 'attesting'
  | 'finalizing'
  | 'complete';

export interface SimulationState {
  step: SimulationStep;
  currentTransaction: Transaction | null;
  mempool: Transaction[];
  currentBlock: Block | null;
  validators: Validator[];
  nodes: Node[];
  wallets: Wallet[];
  activeWallet: Wallet | null;
  blocks: Block[];
  isAutoMode: boolean;
  isFullAuto: boolean;
  isPaused: boolean;
  speed: number;
  totalTransactions: number;
}

export interface ParticipantInfo {
  title: string;
  description: string;
  role: string;
}
