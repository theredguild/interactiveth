import type { Transaction, Block, Validator, Node, Wallet } from './ethereum-types';

const WALLET_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const NODE_NAMES = ['Geth-US-East', 'Nethermind-EU', 'Besu-Asia', 'Erigon-US-West', 'Lighthouse-EU', 'Prysm-Asia'];
const VALIDATOR_NAMES = ['Lido', 'Coinbase', 'Kraken', 'Figment', 'Rocket Pool', 'Binance', 'Allnodes', 'Home Staker'];
const LOCATIONS = ['New York', 'Frankfurt', 'Singapore', 'San Francisco', 'London', 'Tokyo'];

export function generateAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

export function generateHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateSignature(): string {
  const chars = '0123456789abcdef';
  let sig = '0x';
  for (let i = 0; i < 130; i++) {
    sig += chars[Math.floor(Math.random() * chars.length)];
  }
  return sig;
}

export function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function shortenHash(hash: string, chars = 8): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function createWallets(count = 4): Wallet[] {
  return Array.from({ length: count }, (_, i) => ({
    address: generateAddress(),
    name: WALLET_NAMES[i % WALLET_NAMES.length],
    balance: Math.floor(Math.random() * 100) + 10,
    nonce: Math.floor(Math.random() * 50),
  }));
}

export function createNodes(count = 6): Node[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    name: NODE_NAMES[i % NODE_NAMES.length],
    type: i < 3 ? 'execution' as const : 'consensus' as const,
    location: LOCATIONS[i % LOCATIONS.length],
    status: 'idle' as const,
    transactionsReceived: 0,
  }));
}

export function createTransaction(wallet: Wallet, recipient: Wallet): Transaction {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    from: wallet.address,
    to: recipient.address,
    value: Math.floor(Math.random() * 5 * 100) / 100 + 0.1,
    gasLimit: 21000,
    gasPrice: Math.floor(Math.random() * 50) + 10,
    nonce: wallet.nonce,
    data: '0x',
    hash: '',
    signature: null,
    status: 'pending',
    timestamp: Date.now(),
    createdBy: 'user',
  };
}

export function createBlock(
  number: number,
  parentHash: string,
  transactions: Transaction[] = []
): Block {
  return {
    number,
    hash: generateHash(),
    parentHash,
    timestamp: Date.now(),
    transactions,
    gasUsed: transactions.reduce((acc, tx) => acc + tx.gasLimit, 0),
    gasLimit: 30000000,
    miner: generateAddress(),
    status: 'building',
    attestations: 0,
  };
}

export function createValidators(count = 8): Validator[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `validator-${i}`,
    address: generateAddress(),
    name: VALIDATOR_NAMES[i % VALIDATOR_NAMES.length],
    stake: 32 + Math.floor(Math.random() * 100),
    isProposer: false,
    hasAttested: false,
    status: 'idle' as const,
  }));
}

export const STEP_DESCRIPTIONS: Record<string, { title: string; description: string; actor: string; location: string }> = {
  'idle': {
    title: 'Ready to Start',
    description: 'Click "Create Transaction" or enable Full Auto to begin the simulation.',
    actor: 'You (the user)',
    location: 'Your device',
  },
  'creating-tx': {
    title: 'User Creates Transaction',
    description: 'A user (you) uses a wallet application (MetaMask, Ledger, etc.) to create a transaction. The wallet software constructs the transaction data: recipient address, ETH amount, gas limit, and gas price.',
    actor: 'Wallet Software (on behalf of user)',
    location: "User's device (browser/app)",
  },
  'signing-tx': {
    title: 'Wallet Signs Transaction',
    description: 'The wallet uses YOUR private key to cryptographically sign the transaction. This signature proves you authorized this transfer without revealing your private key. The signature is created locally on your device.',
    actor: 'Wallet Software + Your Private Key',
    location: "User's device (secure enclave)",
  },
  'broadcasting': {
    title: 'Wallet Broadcasts to Nodes',
    description: 'Your wallet connects to an Ethereum node (via RPC endpoint like Infura, Alchemy, or your own node) and sends the signed transaction. The node validates it and gossips it to peer nodes across the P2P network.',
    actor: 'Ethereum Nodes (P2P Network)',
    location: 'Global node network (thousands of nodes)',
  },
  'mempool': {
    title: 'Transaction Enters Mempool',
    description: 'Each node maintains its own mempool (memory pool) - a waiting area for unconfirmed transactions. Your transaction now exists in the mempool of many nodes, waiting for a validator to include it in a block.',
    actor: 'All Ethereum Nodes',
    location: 'Distributed across all node mempools',
  },
  'selecting-validator': {
    title: 'Protocol Selects Proposer',
    description: 'The Ethereum protocol (RANDAO) randomly selects one validator to propose the next block. Selection probability is weighted by stake (32+ ETH). This happens every 12 seconds (one slot).',
    actor: 'Ethereum Protocol (Consensus Layer)',
    location: 'Beacon Chain',
  },
  'building-block': {
    title: 'Validator Builds Block',
    description: "The selected validator's node pulls transactions from its mempool, orders them (often by gas price), and assembles them into a block. The validator runs an execution client to process state changes.",
    actor: 'Block Proposer (Validator Node)',
    location: "Proposer's validator node",
  },
  'proposing-block': {
    title: 'Validator Proposes Block',
    description: 'The proposer broadcasts the new block to all other validators in the network. The block includes the transaction list, state root, and proposer signature.',
    actor: 'Block Proposer',
    location: 'P2P network broadcast',
  },
  'attesting': {
    title: 'Committee Validates & Attests',
    description: 'A committee of validators (randomly selected for this slot) independently verify the block. Each attesting validator checks transaction validity and signs an attestation vote. Attestations are aggregated.',
    actor: 'Attestation Committee (128+ validators)',
    location: "Each validator's node",
  },
  'finalizing': {
    title: 'Block Achieves Finality',
    description: 'When 2/3+ of total staked ETH attests to a block across two epochs (~13 min), it becomes "finalized" - cryptoeconomically irreversible. Reversing would require burning billions in staked ETH.',
    actor: 'Network Consensus',
    location: 'Global validator network',
  },
  'complete': {
    title: 'Transaction Confirmed',
    description: 'The transaction is now permanently part of the canonical Ethereum blockchain. The state change (ETH transfer) is finalized, and the recipient can spend the funds.',
    actor: 'Ethereum Blockchain',
    location: 'Permanent on-chain record',
  },
};

export const NETWORK_PARTICIPANTS = {
  user: {
    name: 'User (You)',
    description: 'The person initiating the transaction. Uses a wallet to create and sign transactions.',
    icon: 'User',
  },
  wallet: {
    name: 'Wallet Software',
    description: 'Application (MetaMask, Ledger, etc.) that manages keys and creates/signs transactions on your behalf.',
    icon: 'Wallet',
  },
  node: {
    name: 'Ethereum Node',
    description: 'A computer running Ethereum client software. Maintains blockchain state, validates transactions, and relays data. Anyone can run a node.',
    icon: 'Server',
  },
  validator: {
    name: 'Validator',
    description: 'A node that has staked 32+ ETH to participate in consensus. Proposes and attests to blocks. Earns rewards for honest behavior.',
    icon: 'Shield',
  },
  mempool: {
    name: 'Mempool',
    description: 'Not a single location - each node has its own mempool. A waiting room for pending transactions before they are included in a block.',
    icon: 'Inbox',
  },
  beaconChain: {
    name: 'Beacon Chain',
    description: 'The consensus layer that coordinates validators, manages stake, and runs the PoS protocol.',
    icon: 'Radio',
  },
};
