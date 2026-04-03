# InteractivETH

Interactive educational visualizations for understanding Ethereum protocol concepts, based on [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook).

## Features

- **Interactive Simulators** — Hands-on exploration of Ethereum concepts (transactions, block building, gas markets, consensus)
- **Security Section** — Learn about attack vectors (sandwich attacks, front-running, reentrancy, etc.) with both attack and defense perspectives
- **Bilingual** — Full English/Spanish support via `next-intl` with locale-based routing (`/en/...`, `/es/...`)
- **Difficulty Levels** — Beginner and Advanced modes per tutorial
- **Modular Architecture** — Easy to add new tutorials following established patterns
- **Responsive Design** — Works on desktop and mobile with collapsible sidebar
- **Lotus Flower Favicon** — Branded with The Red Guild identity 🪷

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Tutorials

### Core Concepts

| Tutorial | Route | Status |
|----------|-------|--------|
| Transactions | `/transactions` | ✅ Available |
| Block Builder | `/validator` | ✅ Available |
| Gas & Fees | `/gas` | ✅ Available |
| Block Internals | `/block-internals` | ✅ Available |
| Protocol Visualizer | `/protocol-visualizer` | ✅ Available |

### Security

| Tutorial | Route | Status |
|----------|-------|--------|
| Sandwich Attack | `/security/sandwich-attack` | ✅ Available |
| Front-Running | `/security/front-running` | 🚧 Coming Soon |
| Reentrancy | `/security/reentrancy` | 🚧 Coming Soon |
| Oracle Manipulation | `/security/oracle-manipulation` | 🚧 Coming Soon |
| Rogue Proposer | `/security/rogue-proposer` | 🚧 Coming Soon |
| Double-Signing | `/security/double-signing` | 🚧 Coming Soon |
| Eclipse Attack | `/security/eclipse-attack` | 🚧 Coming Soon |
| 51% Attack | `/security/51-percent` | 🚧 Coming Soon |

### Planned

| Tutorial | Book Chapter |
|----------|-------------|
| Smart Contracts | Chapter 7 (Solidity) / Chapter 8 (Vyper) |
| EVM Deep Dive | Chapter 14 |
| MEV & PBS | Chapter 16 |

## Project Structure

```
├── app/
│   ├── [locale]/              # i18n routing (en, es)
│   │   ├── page.tsx           # Landing page
│   │   ├── transactions/      # Core concept tutorials
│   │   ├── validator/
│   │   ├── gas/
│   │   ├── block-internals/
│   │   ├── protocol-visualizer/
│   │   └── security/          # Security section
│   │       ├── page.tsx       # Security overview
│   │       ├── sandwich-attack/
│   │       └── ...            # Coming soon modules
│   └── layout.tsx             # Root layout with metadata
├── components/
│   ├── layout/                # Sidebar, breadcrumbs, navigation
│   ├── navigation/            # Search modal, locale switcher
│   ├── ethereum/              # Shared simulator components
│   ├── tutorials/             # Per-tutorial components
│   │   ├── validator/
│   │   ├── gas-auction/
│   │   └── block-internals/
│   └── ui/                    # Reusable UI primitives
├── hooks/                     # Custom React hooks
├── i18n/                      # next-intl config & routing
├── lib/                       # Utilities and types
├── messages/                  # Translation files (en.json, es.json)
├── public/                    # Static assets (lotus favicon, etc.)
└── book/                      # Mastering Ethereum (git submodule)
```

## Adding a New Tutorial

1. **Create the page**: `app/[locale]/[tutorial-slug]/page.tsx`
2. **Build components**: `components/tutorials/[tutorial-slug]/`
3. **Add translations**: Keys in both `messages/en.json` and `messages/es.json`
4. **Register on landing page**: Add to `LEARNING_CARDS` or `COMING_SOON_CARDS`
5. **Add to sidebar**: Update `sidebar.tsx` navigation config
6. **Add breadcrumbs**: Register in `components/navigation/breadcrumbs.tsx`

See `AGENTS.md` for detailed development guidelines.

## i18n

- **Default locale**: English (`en`)
- **Supported locales**: English, Spanish
- **Routing**: Prefix-based (`/en/...`, `/es/...`)
- **Translation files**: `messages/en.json`, `messages/es.json`
- **Usage**: Always use `useTranslations()` — never hardcode user-facing strings

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- next-intl (i18n)
- Lucide React (icons)
- Vercel Analytics

## Book Reference

Content is based on [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook) by Andreas M. Antonopoulos and Gavin Wood. The book is included as a git submodule in `book/` with all 17 chapters in Markdown format.

## License

MIT
