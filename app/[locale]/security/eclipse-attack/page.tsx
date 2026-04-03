'use client';

import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

export default function ComingSoonPage() {
  const locale = useLocale();
  const t = useTranslations('common');
  
  return (
    <TutorialLayout>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30">
            <Construction className="size-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('comingSoon')}</h1>
          <p className="text-muted-foreground mb-6">This security module is under development.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
            <Clock className="size-4" />
            <span>{t('inDevelopment')}</span>
          </div>
          <Link 
            href={`/${locale}/security`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            {t('backToSecurity')}
          </Link>
        </motion.div>
      </div>
    </TutorialLayout>
  );
}
