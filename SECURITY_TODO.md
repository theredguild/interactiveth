# InteractiveETH Security Section Roadmap

## Overview
Comprehensive educational security section covering major Ethereum attack vectors, with both Beginner (visual storytelling) and Advanced (technical/code-level) versions for each module.

## Module Structure
Each module includes:
- **Beginner Version:** Visual storytelling, animations, minimal complexity
- **Advanced Version:** Technical details, code examination, real attack parameters
- **Historical Context:** Real-world examples with dates, losses, and outcomes
- **Defensive Measures:** How to prevent, detect, and mitigate
- **Interactive Elements:** User participation where applicable

---

## Phase 1: MEV & Transaction Ordering Attacks

### Module 1.1: Front-Running Simulator ⭐ PRIORITY
**Status:** Not Started
**Files:**
- `components/tutorials/security/front-running-simulator.tsx`
- `hooks/use-front-running-simulation.ts`
- `app/[locale]/security/front-running/page.tsx`

**Features:**
- [ ] Real-time mempool visualization
- [ ] User places trade → Attacker sees it → Price impact animation
- [ ] Adjustable gas price race
- [ ] Slippage calculator showing victim loss
- [ ] Historical case: Sushiswap MEV extraction (2021)
- [ ] Defense: Flashbots Protect integration demo

**Beginner Mode:**
- Simple DEX swap scenario
- Visual "race" showing attacker getting in first
- Loss amount highlighted in red
- Protection toggle (on/off)

**Advanced Mode:**
- Priority Gas Auction (PGA) mechanics
- Mempool monitoring bot simulation
- Exact gas price calculations
- Flashbots bundle construction

---

### Module 1.2: Sandwich Attack Simulator ⭐ PRIORITY
**Status:** Not Started
**Files:**
- `components/tutorials/security/sandwich-attack-simulator.tsx`
- `hooks/use-sandwich-simulation.ts`
- `app/[locale]/security/sandwich-attack/page.tsx`

**Features:**
- [ ] Three-step visualization: Front-run → Victim → Back-run
- [ ] Interactive price curve showing manipulation
- [ ] Adjustable slippage (1%, 3%, 5%, 10%)
- [ ] Real-time MEV extraction calculation
- [ ] Historical case: Multiple Cream Finance attacks
- [ ] Defense: CoW Protocol, slippage protection

**Beginner Mode:**
- Token swap on Uniswap-style AMM
- Clear before/after price display
- Animated sandwich sequence
- Profit/Loss breakdown pie chart

**Advanced Mode:**
- AMM pricing curves (x*y=k)
- Optimal attack size calculation
- Gas optimization for profitability
- MEV-Boost relay integration

---

### Module 1.3: Mempool Privacy Demo
**Status:** Not Started
**Files:**
- `components/tutorials/security/mempool-privacy-demo.tsx`
- `app/[locale]/security/mempool-privacy/page.tsx`

**Features:**
- [ ] Public mempool: Everyone sees pending txs
- [ ] Private channels: Flashbots, Eden Network
- [ ] Searcher bot visualization (sharks circling)
- [ ] Transaction flow comparison
- [ ] Historical case: Flashbots Protect adoption
- [ ] Defense: RPC endpoint configuration

**Beginner Mode:**
- "Where does your transaction go?" flowchart
- Public vs Private visualization
- Simple toggle between modes

**Advanced Mode:**
- RPC endpoint technical details
- Bundle submission mechanics
- Searcher-builder-validator flow

---

## Phase 2: Validator Misbehavior

### Module 2.1: The Rogue Proposer
**Status:** Not Started
**Files:**
- `components/tutorials/security/rogue-proposer-simulator.tsx`
- `hooks/use-rogue-proposer-simulation.ts`
- `app/[locale]/security/rogue-proposer/page.tsx`

**Features:**
- [ ] Censorship: Transactions stuck in mempool
- [ ] Self-dealing: Attacker includes own arbitrage first
- [ ] Empty blocks: Intentional exclusion
- [ ] Attestation view: Other validators rejecting
- [ ] Slashing animation: 32 ETH burn
- [ ] Historical case: Lido MEV-boost debates
- [ ] Fork visualization: Honest vs rogue chain

**Beginner Mode:**
- Interactive block building as validator
- Temptation to be evil vs honest rewards
- Slashing consequence visualization
- Consensus chooses honest chain

**Advanced Mode:**
- Fork choice rule mechanics
- Inactivity leak calculations
- Attestation aggregation details
- Slashing conditions (Casper FFG)

---

### Module 2.2: Double-Signing Attack
**Status:** Not Started
**Files:**
- `components/tutorials/security/double-signing-simulator.tsx`
- `app/[locale]/security/double-signing/page.tsx`

**Features:**
- [ ] Split-screen: Block A and Block B proposed
- [ ] Network partition visualization
- [ ] Some nodes see A, others see B
- [ ] Slashing detection and execution
- [ ] Validator ejection from set
- [ ] Historical case: No major instances (system working!)
- [ ] Compare: Inactivity leak vs slashing

**Beginner Mode:**
- Simple two-block visualization
- Slashing event animation
- Why finality matters explanation

**Advanced Mode:**
- Equivocation proof construction
- BLS signature verification
- Beacon chain fork choice

---

## Phase 3: Smart Contract Vulnerabilities

### Module 3.1: Reentrancy Attack (DAO Hack) ⭐ PRIORITY
**Status:** Not Started
**Files:**
- `components/tutorials/security/reentrancy-simulator.tsx`
- `app/[locale]/security/reentrancy/page.tsx`

**Features:**
- [ ] Step-by-step DAO hack recreation
- [ ] Visual call stack with arrows
- [ ] Recursive withdrawal loop animation
- [ ] Balance tracker (real-time drain)
- [ ] Code comparison: Vulnerable vs Fixed
- [ ] Historical case: The DAO (2016) - 3.6M ETH stolen
- [ ] Defense: Checks-Effects-Interactions, ReentrancyGuard

**Beginner Mode:**
- Bank contract visualization
- "Recursive ATM" analogy
- Fund draining animation
- Simple fix explanation

**Advanced Mode:**
- Call stack depth tracking
- Solidity code walkthrough
- Mutex pattern implementation
- Cross-function reentrancy

---

### Module 3.2: Oracle Manipulation
**Status:** Not Started
**Files:**
- `components/tutorials/security/oracle-manipulation.tsx`
- `app/[locale]/security/oracle-manipulation/page.tsx`

**Features:**
- [ ] DEX price vs Oracle price comparison
- [ ] Flash loan price pump simulation
- [ ] Borrow at inflated collateral value
- [ ] Protocol left with bad debt
- [ ] Historical case: Cream Finance ($130M), Mango Markets ($100M)
- [ ] Defense: TWAP, multi-oracle, circuit breakers

**Beginner Mode:**
- Price feed visualization
- Attack sequence animation
- Profit/loss tracker

**Advanced Mode:**
- Flash loan mechanics
- TWAP calculation
- Manipulation cost analysis
- Chainlink aggregator details

---

## Phase 4: Network-Level Attacks

### Module 4.1: Eclipse Attack Visualization
**Status:** Not Started
**Files:**
- `components/tutorials/security/eclipse-attack.tsx`
- `app/[locale]/security/eclipse-attack/page.tsx`

**Features:**
- [ ] Network map with nodes and connections
- [ ] Target node isolation animation
- [ ] Honest connections turn red (attacker controlled)
- [ ] Fake blockchain state presentation
- [ ] Prevention: Peer diversity, DHT randomization
- [ ] Historical case: Bitcoin eclipse attacks (research)
- [ ] Detection: Connection monitoring

**Beginner Mode:**
- Node isolation visualization
- "Fake reality" presentation
- How to stay connected guide

**Advanced Mode:**
- Kademlia DHT mechanics
- Peer selection algorithms
- Connection table manipulation

---

### Module 4.2: Sybil/51% Attack Demo
**Status:** Not Started
**Files:**
- `components/tutorials/security/fifty-one-percent.tsx`
- `app/[locale]/security/51-percent/page.tsx`

**Features:**
- [ ] Slider: Adjust honest vs malicious validator %
- [ ] Threshold visualizer: 33%, 50%, 66% lines
- [ ] Attack scenarios:
  - Double spends
  - Reorgs (deep vs shallow)
  - Censorship
- [ ] Cost calculator: ETH price × 32 ETH × validator count
- [ ] Historical case: Bitcoin Gold (2018), ETC (2020)
- [ ] Defense: Economic incentives, slashing

**Beginner Mode:**
- Simple percentage slider
- "You need THIS much control" visualization
- Why it's economically irrational

**Advanced Mode:**
- Long-range attacks
- Weak subjectivity
- Validator set rotation
- Cost-benefit analysis

---

## Phase 5: Transaction & Block Manipulation

### Module 5: Malicious Crafting
**Status:** Not Started
**Files:**
- `components/tutorials/security/malicious-crafting.tsx`
- `app/[locale]/security/malicious-crafting/page.tsx`

**Features:**
- [ ] Invalid state root: Proposer lies about execution
- [ ] Invalid attestations: Fake signatures
- [ ] Timestamp manipulation: Oracle exploitation
- [ ] User as "honest validator" reviewing blocks
- [ ] Validation checks interactive checklist
- [ ] Block rejection visualization
- [ ] Defense: Fraud proofs, validity proofs

**Beginner Mode:**
- "Spot the problem" game
- Validation checklist
- Reject vs Accept decision

**Advanced Mode:**
- State root computation
- BLS signature aggregation
- Block body vs header verification

---

## Infrastructure Tasks

### Sidebar Integration
- [ ] Add "Security" section to sidebar
- [ ] Icon: Shield or Lock
- [ ] Expandable sub-menu for all modules
- [ ] Spanish translations

### Routing
- [ ] `/security` - Overview page listing all modules
- [ ] `/security/front-running`
- [ ] `/security/sandwich-attack`
- [ ] `/security/mempool-privacy`
- [ ] `/security/rogue-proposer`
- [ ] `/security/double-signing`
- [ ] `/security/reentrancy`
- [ ] `/security/oracle-manipulation`
- [ ] `/security/eclipse-attack`
- [ ] `/security/51-percent`
- [ ] `/security/malicious-crafting`

### Translations
- [ ] All keys in `en.json`
- [ ] All keys in `es.json`
- [ ] Historical case descriptions
- [ ] Defense measure explanations

### Shared Components
- [ ] `MempoolVisualizer` - Common mempool display
- [ ] `AttackTimeline` - Step-by-step attack flow
- [ ] `BalanceTracker` - Real-time fund movement
- [ ] `SlashingEvent` - ETH burn animation
- [ ] `ForkVisualizer` - Chain split visualization
- [ ] `CodeComparison` - Vulnerable vs Fixed code
- [ ] `CaseStudyCard` - Historical attack summary
- [ ] `DefensePanel` - Countermeasures checklist

---

## Design System for Security

### Color Coding
- **Normal Flow:** Green accents (#22c55e)
- **Attack Injection:** Red pulsing (#ef4444)
- **Exploitation:** Orange/Yellow lightning (#f59e0b)
- **Detection/Defense:** Blue shields (#3b82f6)
- **Consequences:** Dark red fire effects (#7f1d1d)
- **Educational:** Purple info (#8b5cf6)

### Animation Language
- **Slashing:** ETH burning with fire particles
- **Draining:** Liquid flowing out animation
- **Reentrancy:** Recursive spiral/loop effect
- **MEV Extraction:** Vacuum/suction animation
- **Censorship:** Transactions grayed out, blocked
- **Attestation:** Checkmarks/X marks appearing
- **Fork:** Chain splitting with diverging paths

### Sound Effects (Optional)
- **Alert:** When attack detected
- **Success:** When defense activated
- **Slashing:** Dramatic burn sound
- **Mining:** Block confirmation chime

---

## Priority Order

### Phase 1 (Immediate)
1. Infrastructure setup
2. Sandwich Attack (most visual)
3. Reentrancy Attack (DAO hack - most famous)
4. Front-Running (high relevance)

### Phase 2 (Next)
5. Rogue Proposer
6. Oracle Manipulation
7. 51% Attack

### Phase 3 (Later)
8. Double-Signing
9. Eclipse Attack
10. Mempool Privacy
11. Malicious Crafting

---

## Testing Checklist

For each module:
- [ ] Interactive elements work
- [ ] Beginner/Advanced toggle functional
- [ ] All historical case data accurate
- [ ] Defense measures complete
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Spanish translation verified
- [ ] Build passes
- [ ] UX intuitive (test with fresh eyes)
- [ ] Performance acceptable (no lag)

---

## Notes
- Keep educational tone - never encourage actual attacks
- Always emphasize defensive measures
- Use real numbers and dates for historical cases
- Credit sources for historical data
- Keep code examples simplified but accurate
- Ensure accessibility (alt text, keyboard nav, ARIA labels)
