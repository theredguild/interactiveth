'use client';

import dynamic from 'next/dynamic';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const BlockInternalsSimulator = dynamic(
  () => import('@/components/tutorials/block-internals/block-internals-simulator').then(mod => mod.BlockInternalsSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading Block Construction Simulator...</p>
        </div>
      </div>
    ),
  }
);

export default function BlockInternalsPage() {
  return (
    <TutorialLayout>
      <BlockInternalsSimulator />
    </TutorialLayout>
  );
}
