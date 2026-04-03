'use client';

import dynamic from 'next/dynamic';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const ValidatorSimulator = dynamic(
  () => import('@/components/tutorials/validator/validator-simulator').then(mod => mod.ValidatorSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading Validator Simulator...</p>
        </div>
      </div>
    ),
  }
);

export default function ValidatorPage() {
  return (
    <TutorialLayout>
      <ValidatorSimulator />
    </TutorialLayout>
  );
}
