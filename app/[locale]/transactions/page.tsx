'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Globe } from 'lucide-react';

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

export default function TransactionsPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Globe className="size-6 text-primary" />
            <a href="/" className="text-xl font-bold hover:text-primary transition-colors">
              InteractiveETH
            </a>
          </div>
          <nav className="flex items-center gap-4">
            <LocaleSwitcher />
          </nav>
        </div>
      </header>
      <EthereumSimulator />
    </div>
  );
}
