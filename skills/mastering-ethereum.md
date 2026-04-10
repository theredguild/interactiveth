# Mastering Ethereum Reference

Source: `book/` directory (git submodule of https://github.com/ethereumbook/ethereumbook)
All 17 chapters available in Markdown at `book/src/chapter_*.md`

## Chapter-to-Tutorial Mapping

| Tutorial | Chapters | Key Concepts |
|----------|----------|-------------|
| Transactions | Ch. 6 | Transaction lifecycle, structure, signing, gas, nonce, EOA vs contract creation |
| Block Builder (Validator) | Ch. 15 | PoS, validator duties, block proposal, attestation, RANDAO, finality |
| Gas & Fees | Ch. 6 | Gas, EIP-1559, base fee, priority fee, gas limit, block gas target |
| Block Internals | Ch. 14, 15 | EVM state, block header, Merkle Patricia Tries, RLP encoding, state root |
| Smart Contracts | Ch. 7, 8 | Solidity, Vyper, contract lifecycle, ABI, deployment, immutability |
| EVM | Ch. 14 | Opcodes, stack, memory, storage, gas metering, execution context |
| Security (Sandwich, Front-Running) | Ch. 9 | MEV, sandwich attacks, front-running, reentrancy, oracle manipulation |
| Security (Consensus Attacks) | Ch. 9, 15 | Rogue proposer, double-signing, slashing, Casper FFG |
| Security (Network Attacks) | Ch. 9 | Eclipse attacks, 51% attacks, Sybil resistance |
| MEV & PBS | Ch. 16 | MEV, proposer-builder separation, MEV-Boost, Flashbots, relays |

## Chapter Summaries

### Ch. 6 — Transactions
- Transaction structure: nonce, gasPrice/gasLimit, to, value, data, v/r/s (signature)
- EIP-1559: maxFeePerGas, maxPriorityFeePerGas, baseFee
- Transaction lifecycle: creation → signing → broadcasting → mempool → inclusion → finality
- Contract creation transactions have empty `to` field
- Gas = computational effort; gasLimit = max willing to pay; gasPrice = price per unit
- EIP-1559 base fee is burned, adjusts per block (max ±12.5%)

### Ch. 7 — Smart Contracts & Solidity
- Smart contracts = immutable, deterministic programs running on EVM
- Life cycle: write (Solidity) → compile (solc → bytecode) → deploy (contract-creation tx) → execute (triggered by EOA tx)
- Contracts only run when called by a transaction — never run "on their own"
- Transactions are atomic — all effects roll back on failure
- `SELFDESTRUCT` deprecated by EIP-6780 (2023)
- Solidity: procedural, JavaScript-like syntax, most popular EVM language
- Vyper: Python-like, prioritizes safety and readability
- ABI (Application Binary Interface): standard for contract interaction

### Ch. 8 — Smart Contracts & Vyper
- Vyper design goals: security, simplicity, auditability
- Intentionally limited: no modifiers, no class inheritance, no function overloading
- Python-like syntax with contract-oriented features

### Ch. 9 — Smart Contract Security
- Reentrancy: recursive call before state update (The DAO hack, 2016, 3.6M ETH)
- Defense: Checks-Effects-Interactions pattern, ReentrancyGuard
- Oracle manipulation: using DEX spot price as oracle, flash loan attacks
- Defense: TWAP, multi-oracle, circuit breakers
- Front-running: seeing pending tx in mempool and submitting with higher gas
- Sandwich attacks: buy before victim → victim buys at inflated price → sell after
- Defense: Flashbots/private mempool, low slippage tolerance, CoW Protocol

### Ch. 14 — The Ethereum Virtual Machine
- EVM = quasi-Turing-complete state machine, stack-based, 256-bit words
- Data components: immutable code ROM, volatile memory, transient storage, permanent storage
- Opcodes categories:
  - Arithmetic: ADD, MUL, SUB, DIV, MOD, EXP, SIGNEXTEND, SHA3
  - Stack: POP, MLOAD, MSTORE, SLOAD, SSTORE, TLOAD, TSTORE, PUSH1-PUSH32, DUP1-DUP16, SWAP1-SWAP16
  - Control flow: JUMP, JUMPI, PC, JUMPDEST
  - Logging: LOG0-LOG4
  - System: CREATE, CALL, DELEGATECALL, STATICCALL, RETURN, REVERT, SELFDESTRUCT
  - Environment: ADDRESS, BALANCE, CALLER, CALLVALUE, GAS, BLOCKHASH, COINBASE, TIMESTAMP, NUMBER, DIFFICULTY, GASLIMIT, CHAINID, BASEFEE
- Gas metering: each opcode has a gas cost; execution halts if gas exhausted
- All arithmetic is modulo 2^256

### Ch. 15 — Consensus
- Proof of Stake (PoS): validators stake 32 ETH, randomly selected to propose blocks
- RANDAO: randomness source for validator selection
- Slots (12 seconds) → Epochs (32 slots = 6.4 minutes)
- Attestation: validators vote on block validity, aggregated via BLS signatures
- Finality: 2/3+ attestations across two epochs → justified → finalized
- Slashing penalties for: double-signing, surround voting, inactivity
- Fork choice rule: LMD-GHOST (Latest Message Driven Greediest Heaviest Observed SubTree)

### Ch. 16 — Scaling Ethereum
- Scalability trilemma: decentralization, security, scalability — pick two
- L2 rollups: optimistic (assume valid, challenge if wrong) vs ZK (prove correctness)
- EIP-4844 (proto-danksharding): blob transactions for L2 data availability
- MEV (Maximal Extractable Value): profit from transaction reordering
- MEV-Boost: Flashbots protocol for democratic MEV extraction
- PBS (Proposer-Builder Separation): long-term MEV mitigation
- Sandwich attacks, front-running as MEV extraction methods

### Ch. 17 — Zero-Knowledge Proofs
- ZK-SNARKs, ZK-STARKs: prove knowledge without revealing it
- Applications: privacy (Tornado Cash), scaling (ZK rollups), identity
- Key concepts: trusted setup, proving key, verification key, witness

## Key Technical Reference

### Transaction Structure (EIP-1559)
```
type: 0x02
chainId: 1
nonce: 42
maxPriorityFeePerGas: 2 gwei
maxFeePerGas: 50 gwei
gasLimit: 21000
to: 0x...
value: 1 ether
data: 0x
accessList: []
```

### Block Header Fields
- parentHash, ommersHash, beneficiary (fee recipient), stateRoot, transactionsRoot, receiptsRoot
- logsBloom, difficulty (now 0 post-Merge), number, gasLimit, gasUsed, timestamp
- extraData, mixHash (RANDAO reveal), nonce (now 0), baseFeePerGas (EIP-1559)

### AMM Formula (for DEX/sandwich simulations)
```
// Constant Product: x * y = k
k = ethReserve * daiReserve
ethReceived = ethReserve - (k / (daiReserve + daiInput))
priceImpact = (newPrice - oldPrice) / oldPrice * 100
```

### Gas Calculation
```
effectiveGasPrice = baseFee + min(maxPriorityFee, maxFee - baseFee)
txCost = gasUsed * effectiveGasPrice
baseFeeBurned = gasUsed * baseFee
validatorTip = gasUsed * min(maxPriorityFee, maxFee - baseFee)
```

## Common Attack Patterns (for Security Modules)

### Reentrancy
```
// Vulnerable: external call before state update
function withdraw() public {
    uint balance = balances[msg.sender];
    (bool success,) = msg.sender.call{value: balance}("");
    require(success);
    balances[msg.sender] = 0;  // Too late!
}

// Fixed: Checks-Effects-Interactions
function withdraw() public {
    uint balance = balances[msg.sender];
    require(balance > 0);
    balances[msg.sender] = 0;  // Effect first
    (bool success,) = msg.sender.call{value: balance}("");
    require(success);
}
```

### Sandwich Attack Flow
1. Attacker sees victim's pending tx in public mempool
2. Attacker submits front-run tx with higher gas → buys asset first
3. Victim's tx executes at inflated price
4. Attacker submits back-run tx → sells asset at profit
5. Defense: Flashbots (private mempool), low slippage, higher gas

### Front-Running
- Attacker monitors mempool for profitable pending transactions
- Submits identical transaction with higher gas price
- Validator includes attacker's tx first (higher fee = higher priority)
- Defense: Flashbots, commit-reveal schemes, batch auctions

## Building New Tutorials

When creating a new tutorial:
1. Read the relevant chapter(s) from `book/src/` for accurate technical content
2. Extract key concepts that can be demonstrated interactively
3. Map concepts to interactive elements (sliders, visualizations, step-by-step flows)
4. Use chapter content for educational text and tooltips
5. Reference real-world examples and numbers from the book
6. Always include defensive measures alongside attack demonstrations
