# AGENTS.md — InteractivETH

## What This Project Is

**InteractivETH** is an interactive educational platform for learning Ethereum protocol concepts. It uses hands-on simulations (transaction lifecycle, block building, gas auctions, security attacks) to teach concepts from the book [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook).

**Branding**: The name is InteractivETH (capital ETH). Favicon is a lotus flower 🪷 (The Red Guild).

## Critical Rules

### 1. ALWAYS USE `pnpm`
Never use `npm` or `yarn`. All commands use `pnpm`:
```bash
pnpm install
pnpm dev
pnpm build
```

### 2. ALWAYS EXTRACT STRINGS TO TRANSLATIONS
Never hardcode user-facing text. Always use `useTranslations()`:

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('namespace');  // or useTranslations() for root
```

**Translation workflow:**
1. Add the key to `messages/en.json` first
2. Add the Spanish equivalent to `messages/es.json`
3. Keep both files in sync — same keys, translated values
4. Use the component with `t('key')` or `t('nested.key')`

**Example:**
```json
// messages/en.json
{ "sandwich": { "title": "Sandwich Attack Simulator" } }

// messages/es.json
{ "sandwich": { "title": "Simulador de Ataque Sandwich" } }
```

```tsx
const t = useTranslations('sandwich');
<h1>{t('title')}</h1>
```

### 3. UPDATE TODOS AND STATUS
After completing work:
- Update `TODO.md` with current status
- Update `SECURITY_TODO.md` for security modules
- Keep this file current if project structure changes

## Project Structure

```
app/[locale]/          → Pages (i18n routing: /en, /es)
components/
  layout/              → Sidebar, breadcrumbs, tutorial layout, page nav
  navigation/          → Search modal, locale switcher
  ethereum/            → Shared simulator components
  tutorials/           → Per-tutorial components (validator/, gas-auction/, etc.)
  ui/                  → Reusable primitives (CodeBlock, etc.)
messages/              → en.json, es.json (keep keys in sync!)
notes/
  chapters/            → Original Markdown study notes rendered for Spanish and auto-listed in the sidebar
  translations/
    en/                → English note translations rendered under /en/notes/[slug]
book/                  → Mastering Ethereum git submodule (17 chapters)
public/                → Static assets (lotus favicon)
```

## Code Patterns

### New tutorial page
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

export default function MyTutorialPage() {
  const t = useTranslations('myTutorial');
  // ...
}
```

### New Coming Soon page
All use the shared pattern in `security/*/page.tsx` with `useTranslations('common')`.

### File naming
- Components: `kebab-case.tsx`
- Hooks: `use-kebab-case.ts`
- Pages: `page.tsx` in route directories

## Adding Content

1. **New tutorial**: Create page in `app/[locale]/slug/`, components in `components/tutorials/slug/`, translations in both JSON files
2. **New translation key**: Add to `en.json` AND `es.json` simultaneously
3. **New route**: Register in `breadcrumbs.tsx` PAGE_HIERARCHY and `sidebar.tsx`
4. **Difficulty badges**: Use `useTranslations('difficulty')` → `td('beginner')`, `td('intermediate')`, `td('advanced')`

### Study notes
- Add chapter notes as Markdown files in `notes/chapters/`
- Add English translations in `notes/translations/en/` when needed
- Landing-page chapter resources can link to them through `/{locale}/notes/[slug]`

## Book Reference

The `book/` directory contains Mastering Ethereum as a git submodule with all 17 chapters in Markdown. Use it as the technical reference when building new tutorials. Key mappings:

| Tutorial | Chapter |
|----------|---------|
| Transactions | 6 (Transactions) |
| Block Builder | 15 (Consensus) |
| Gas & Fees | 6 (Gas) |
| Block Internals | 14 (EVM) + 15 (Consensus) |
| Smart Contracts | 7 (Solidity) + 8 (Vyper) |
| EVM | 14 (EVM) |
| Security modules | 9 (Smart Contract Security) |
| MEV | 16 (Scaling) |

## Verification

Before marking work complete:
```bash
pnpm build          # Must compile with zero errors
```

Check translation parity:
```bash
node -e "const en=require('./messages/en.json');const es=require('./messages/es.json');const ek=Object.keys(en);const sk=Object.keys(es);console.log('en:',ek.length,'es:',sk.length);"
```

## Current Status (as of 2026-04-03)

**Completed:** Transactions, Block Builder, Gas & Fees, Block Internals, Protocol Visualizer, Sandwich Attack simulator
**In progress:** Security section (7/8 modules are "Coming Soon" placeholders)
**Planned:** Smart Contracts, EVM, MEV tutorials
**i18n:** English + Spanish fully wired, all translation keys synced (510+ keys)
