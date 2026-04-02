# InteractiveETH

Interactive educational visualizations for understanding Ethereum protocol concepts, based on [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook).

## Features

- Interactive transaction lifecycle visualization
- Block creation and consensus simulation
- Multi-language support (English, Spanish)
- Modular tutorial architecture for adding new content

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Tutorials

| Tutorial | Status |
|----------|--------|
| Transactions | Available |
| Blocks | Available |
| Smart Contracts | Coming Soon |
| Gas & Fees | Coming Soon |
| EVM | Coming Soon |
| MEV | Coming Soon |

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── [locale]/          # i18n routing
│   └── [locale]/transactions/  # First tutorial
├── components/            # React components
│   ├── ethereum/         # Simulator components
│   └── ui/              # UI primitives
├── book/                  # Mastering Ethereum source (git submodule)
├── hooks/                # Custom React hooks
├── i18n/                  # Internationalization config
├── lib/                  # Utilities and types
└── messages/             # Translation files
```

## Adding a New Tutorial

1. Create a new page: `app/[locale]/[tutorial]/page.tsx`
2. Add tutorial metadata to the landing page
3. Create translations in `messages/en.json` and `messages/es.json`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- next-intl (i18n)

## License

MIT
