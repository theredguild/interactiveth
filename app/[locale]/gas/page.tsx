'use client';

import dynamic from 'next/dynamic';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const GasAuctionSimulator = dynamic(
  () => import('@/components/tutorials/gas-auction/gas-auction-simulator').then(mod => mod.GasAuctionSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading Gas Auction Simulator...</p>
        </div>
      </div>
    ),
  }
);

export default function GasAuctionPage() {
  return (
    <TutorialLayout>
      <GasAuctionSimulator />
    </TutorialLayout>
  );
}
