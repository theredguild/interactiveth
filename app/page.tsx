'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent hydration mismatches
// caused by random value generation (wallets, validators, nodes)
const EthereumSimulator = dynamic(
  () => import('@/components/ethereum/ethereum-simulator').then(mod => mod.EthereumSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading Ethereum Simulator...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <EthereumSimulator />;
}
