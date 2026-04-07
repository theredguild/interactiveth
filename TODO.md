# InteractiveETH Development Roadmap

## Project Overview
Interactive educational visualizations for Ethereum protocol concepts, based on [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook).

### Recent Updates
- 2026-04-07: Updated the front page chapter-link model to use explicit lesson mappings and linked Chapter 2 to the existing Transactions and Gas lessons, based on the chapter’s focus on wallets, transactions, and gas basics.
- 2026-04-07: Added English note translations under `notes/translations/en/` and updated the notes page to render localized content, with an English-only notice that translations were produced using GPT-5.4.
- 2026-04-07: Made the sidebar discover chapter notes dynamically from `notes/chapters/` through an API route, so new Markdown notes appear automatically without manual nav updates.
- 2026-04-07: Installed `marked` and converted chapter notes into rendered in-app pages under `/{locale}/notes/[slug]`, with a banner clarifying that notes are currently available only in Spanish.
- 2026-04-07: Replaced the Chapter 1 notes placeholder with detailed study notes in `notes/chapters/chapter-1.md`, preserving links to the slide deck and replay playlist.
- 2026-04-07: Added a versioned `notes/chapters/` workspace plus a `/notes/[slug]` route so each study chapter can link to Markdown notes directly from the front page.
- 2026-04-07: Added the Chapter 1 slide deck to the front-page archive as a direct resource link while keeping the shared YouTube playlist as the replay entry point.
- 2026-04-07: Adjusted the front page study sequence so the current chapter points to Chapter 2 via the Luma embed and the archive starts with Chapter 1 while reusing the shared playlist for replay access.
- 2026-04-07: Refocused the localized front page around the current chapter, with the Luma embed as the primary study surface, a dedicated playlist replay panel, and an archive of past chapters with linked InteractivETH resources.
- 2026-04-06: Reworked the localized landing page into a minimalist hacker-style front page with embedded Luma and YouTube study surfaces plus a NotebookLM resource entry point.
- 2026-04-06: Added a chapter directory to the front page with Mastering Ethereum chapter links, replay access, InteractivETH routes, and related project resources.

---

## Completed Tutorials

### ✅ Tutorial 1: Transactions (`/transactions`)
**Status:** COMPLETE  
**Book Chapter:** Chapter 4  
**Concepts Covered:**
- Transaction lifecycle from wallet to finality
- User, wallet, nodes, mempool, validators
- Signing, broadcasting, block inclusion, attestation, finality

**Components:**
- `ethereum-simulator.tsx` - Main container
- `transaction-card.tsx` - Transaction details
- `participant-visualization.tsx` - Network participants
- `validators-visualization.tsx` - Validator committee
- `mempool-visualization.tsx` - Mempool dynamics
- `block-visualization.tsx` - Block display
- `step-display.tsx` - Progress indicator
- `top-control-bar.tsx` - Playback controls

**Features:**
- Multi-language support (EN/ES)
- Draggable panels between columns
- Auto-play and manual step modes
- Real-time transaction flow animation

---

## In Progress Tutorials

### ✅ Tutorial 2: Be the Validator - Block Building (`/validator`)
**Status:** COMPLETE  
**Book Chapter:** Chapter 9 (Blocks)  
**Concepts Covered:**
- Transaction selection from mempool
- Gas limit constraints (30M gas)
- Block reward calculation
- Time pressure (12 second slots)
- Optimal ordering strategies

**Interactive Elements:**
- ✅ Click-to-select transactions from mempool
- ✅ Gas limit meter with real-time updates
- ✅ Countdown timer for block proposal window (12 seconds)
- ✅ Score/points system for optimal block building
- ✅ Visual feedback on gas usage

**Components Created:**
- ✅ `components/tutorials/validator/validator-simulator.tsx`
- ✅ `components/tutorials/validator/mempool-panel.tsx` - Source of selectable txs
- ✅ `components/tutorials/validator/block-builder.tsx` - Block construction zone
- ✅ `components/tutorials/validator/gas-meter.tsx` - Gas limit visualization
- ✅ `components/tutorials/validator/score-panel.tsx` - Performance metrics
- ✅ `components/tutorials/validator/timer-display.tsx` - Countdown timer
- ✅ `hooks/use-validator-simulation.ts` - Game state management

**Route:** `/validator` (linked from landing page "Blocks" card)

---

### ✅ Tutorial 3: Gas Price Auction (`/gas`)
**Status:** COMPLETE  
**Book Chapter:** Chapter 6 (Gas)  
**Concepts Covered:**
- Gas price dynamics
- EIP-1559 base fee vs priority fee
- Mempool ordering by gas price
- Congestion scenarios
- Transaction inclusion probability

**Interactive Elements:**
- ✅ Sliders for max fee and priority fee
- ✅ Live mempool queue showing position
- ✅ Congestion level slider (0-100%)
- ✅ Base fee history chart
- ✅ Inclusion time estimator

**Components Created:**
- ✅ `components/tutorials/gas-auction/gas-auction-simulator.tsx`
- ✅ `components/tutorials/gas-auction/mempool-queue.tsx`
- ✅ `components/tutorials/gas-auction/base-fee-chart.tsx`
- ✅ `components/tutorials/gas-auction/gas-price-controls.tsx`
- ✅ `components/tutorials/gas-auction/inclusion-estimator.tsx`
- ✅ `hooks/use-gas-auction.ts` - Gas dynamics simulation

**Route:** `/gas` (marked as available in landing page)

---

### ✅ Tutorial 4: Block Construction Deep Dive (`/block-internals`)
**Status:** COMPLETE  
**Book Chapter:** Chapter 9 (Blocks) + Chapter 8 (EVM)  
**Concepts Covered:**
- Block header fields (parent hash, state root, tx root, receipt root)
- Merkle Patricia Tries
- Block hash calculation
- Metadata fields (timestamp, fee recipient)

**Interactive Elements:**
- ✅ Step-by-step block header field exploration
- ✅ Progressive revelation of block fields
- ✅ Interactive field selector with descriptions
- ✅ Visual block hash generation
- ✅ Educational tooltips for each field

**Components Created:**
- ✅ `components/tutorials/block-internals/block-internals-simulator.tsx`
- ✅ Progressive step system (5 steps)
- ✅ Interactive field cards
- ✅ Educational sidebar with explanations

**Route:** `/block-internals` (marked as available in landing page)
- Slider to adjust gas price/priority fee
- Live mempool view showing position in queue
- Congestion simulation (adjust number of pending txs)
- Historical gas price chart
- Inclusion time estimator
- "Beat the base fee" mini-game

**Components Needed:**
- `components/tutorials/gas-auction/gas-simulator.tsx`
- `components/tutorials/gas-auction/price-slider.tsx`
- `components/tutorials/gas-auction/mempool-queue.tsx`
- `components/tutorials/gas-auction/base-fee-chart.tsx`
- `components/tutorials/gas-auction/inclusion-estimator.tsx`
- `hooks/use-gas-simulation.ts`

**Translation Keys Needed:**
- `tutorial.gas.title`
- `tutorial.gas.description`
- `simulator.gas.*` (all component strings)

---

### 🚧 Tutorial 4: Block Construction Deep Dive (`/block-internals`)
**Status:** PLANNED  
**Book Chapter:** Chapter 9 (Blocks) + Chapter 8 (EVM)  
**Concepts to Cover:**
- Block header fields (parent hash, state root, tx root, receipt root)
- Merkle Patricia Tries
- RLP encoding basics
- Execution payload vs beacon block
- Block hash calculation

**Interactive Elements:**
- Interactive block header builder
- Step-by-step Merkle root calculation visualization
- Field-by-field block construction
- Hash calculation demo
- Toggle between execution and consensus layers

**Components Needed:**
- `components/tutorials/block-internals/block-simulator.tsx`
- `components/tutorials/block-internals/header-builder.tsx`
- `components/tutorials/block-internals/merkle-visualizer.tsx`
- `components/tutorials/block-internals/field-explainer.tsx`
- `components/tutorials/block-internals/hash-calculator.tsx`
- `hooks/use-block-construction.ts`

**Translation Keys Needed:**
- `tutorial.block.title`
- `tutorial.block.description`
- `simulator.block.internals.*` (all component strings)

---

## Upcoming Tutorials (Planned)

### Tutorial 5: Smart Contracts (`/smart-contracts`)
**Book Chapter:** Chapter 7  
**Concepts:** Deployment, bytecode, storage, function calls, events

### Tutorial 6: EVM Execution (`/evm`)
**Book Chapter:** Chapter 8  
**Concepts:** Stack, memory, storage, opcodes, gas metering

### Tutorial 7: Consensus & Finality (`/consensus`)
**Book Chapter:** Chapter 11  
**Concepts:** Casper FFG, justification, finalization, epochs/slots

### Tutorial 8: MEV & PBS (`/mev`)
**Book Chapter:** Chapter 16  
**Concepts:** Proposer-builder separation, MEV extraction, relays

---

## Technical Infrastructure Tasks

### i18n System
- ✅ Basic next-intl setup
- ✅ English translations
- ✅ Spanish translations
- 🔄 Add more languages as needed (Portuguese, Chinese, etc.)

### Shared Components Library
- ✅ Draggable panels system
- ✅ Step progress display
- ✅ Top control bar
- ✅ Network animation background
- 🔄 Tutorial layout wrapper component

### Hooks Library
- ✅ `use-ethereum-simulation.ts`
- ✅ `use-panel-layout.ts`
- 🔄 Create generic `use-tutorial-simulation.ts` base hook

---

## Development Guidelines for Future Agents

### When Adding a New Tutorial:

1. **Update Landing Page**
   - Add to `TUTORIALS` array in `app/[locale]/page.tsx`
   - Mark as `available: false` until complete
   - Add translation keys to `messages/en.json` and `messages/es.json`

2. **Create Route**
   - Create `app/[locale]/[tutorial-slug]/page.tsx`
   - Follow pattern from `app/[locale]/transactions/page.tsx`

3. **Component Structure**
   - Create components in `components/tutorials/[tutorial-slug]/`
   - Use kebab-case for component files
   - Export main component as default from `index.tsx`

4. **Translations**
   - Add all user-facing strings to `messages/en.json` first
   - Use nested structure: `simulator.[tutorial].[component].[string]`
   - Update Spanish translations in `messages/es.json`

5. **Testing**
   - Run `pnpm build` to verify compilation
   - Test both `/en/[tutorial]` and `/es/[tutorial]` routes
   - Verify all interactive elements work
   - Check translations display correctly

### Code Patterns to Follow:

```typescript
// Use translations hook
import { useTranslations } from 'next-intl';
const t = useTranslations();

// Dynamic translation keys
const title = t(`simulator.${tutorialId}.title`);

// Interpolated values
t('simulator.validator.gasUsed', { used: 15000000, limit: 30000000 });
```

### File Naming Conventions:
- Components: `kebab-case.tsx` (e.g., `block-builder.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-validator-simulation.ts`)
- Types: `types.ts` or inline in component files

---

## Mastering Ethereum Chapter Mapping

| Tutorial | Book Chapter | Key Sections |
|----------|--------------|--------------|
| Transactions | 4 | The Transaction Lifecycle, Transaction Structure |
| Validator | 9 | Block Structure, Block Header, Block Rewards |
| Gas Auction | 6 | Gas, Gas Price, EIP-1559 |
| Block Internals | 8-9 | EVM State, Block Structure, Merkle Trees |
| Smart Contracts | 7 | Contract Lifecycle, Bytecode, ABI |
| EVM | 8 | Execution Model, Gas Metering, Opcodes |
| Consensus | 11 | Proof of Stake, Casper FFG, Finality |
| MEV | 16 | MEV Overview, PBS, Relays |

---

## Last Updated
Date: 2026-04-07  
Current Status: ✅ All 3 block-building tutorials complete (Validator, Gas, Block Internals)
Next Milestone: Smart Contracts tutorial

---

## Notes for Future Agents

- The transactions tutorial is fully complete and serves as the reference implementation
- All new tutorials should follow the same i18n pattern (EN/ES support required)
- Keep interactive elements engaging - prefer drag-and-drop, sliders, and games over static text
- Each tutorial should teach 1-3 core concepts deeply rather than covering everything superficially
- Test thoroughly in both languages before marking as `available: true` in the landing page
