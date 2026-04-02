# Contributing to InteractiveETH

Thank you for your interest in contributing!

## Adding a New Tutorial

### 1. Create the Tutorial Page

Create a new directory and page file:

```bash
# Example for "smart-contracts" tutorial
mkdir -p app/[locale]/smart-contracts
```

```tsx
// app/[locale]/smart-contracts/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const SmartContractSimulator = dynamic(
  () => import('@/components/tutorials/smart-contracts').then(mod => mod.SmartContractSimulator),
  { ssr: false }
);

export default function SmartContractsPage() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('tutorial.smartContracts.title')}</h1>
      <SmartContractSimulator />
    </div>
  );
}
```

### 2. Add Translations

Update both `messages/en.json` and `messages/es.json`:

```json
{
  "tutorial": {
    "smartContracts": {
      "title": "Smart Contracts",
      "description": "Explore how smart contracts work on Ethereum"
    }
  }
}
```

### 3. Update Landing Page

Add the tutorial to the `TUTORIALS` array in `app/[locale]/page.tsx`:

```tsx
{
  slug: 'smart-contracts',
  icon: Code,
  available: false, // Set to true when ready
  chapter: 'chapter_7.md',
},
```

### 4. Use Book Content

Reference the Mastering Ethereum book in `book/src/` for content:

```bash
ls book/src/
# chapter_4.md  - Transactions
# chapter_7.md  - Smart Contracts
# chapter_9.md  - Blocks
```

## Coding Standards

- Use TypeScript for all new code
- Follow existing component patterns
- Use the shared UI components from `components/ui/`
- Add i18n keys for all user-facing text

## Running Locally

```bash
pnpm dev
# Visit http://localhost:3000/es for Spanish
```

## Questions?

Open an issue or reach out to the maintainers.
