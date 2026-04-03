'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

// Complete page order for navigation
const PAGE_ORDER = [
  { slug: '', translationKey: 'home' },
  { slug: 'transactions', translationKey: 'transactions' },
  { slug: 'gas', translationKey: 'gas' },
  { slug: 'validator', translationKey: 'validator' },
  { slug: 'block-internals', translationKey: 'blockInternals' },
  { slug: 'protocol-visualizer', translationKey: 'protocolVisualizer' },
  { slug: 'security', translationKey: 'securityOverview' },
  { slug: 'security/sandwich-attack', translationKey: 'sandwichAttack' },
  { slug: 'security/front-running', translationKey: 'frontRunning' },
  { slug: 'security/reentrancy', translationKey: 'reentrancy' },
  { slug: 'security/oracle-manipulation', translationKey: 'oracleManipulation' },
  { slug: 'security/rogue-proposer', translationKey: 'rogueProposer' },
  { slug: 'security/double-signing', translationKey: 'doubleSigning' },
  { slug: 'security/eclipse-attack', translationKey: 'eclipseAttack' },
  { slug: 'security/51-percent', translationKey: 'fiftyOnePercent' },
];

interface PageNavProps {
  show?: boolean;
}

export function PageNavigation({ show = true }: PageNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('sidebar');
  
  // Get current path without locale
  const currentPath = pathname.replace(`/${locale}/`, '').replace(`/${locale}`, '');
  
  // Find current page index
  const currentIndex = PAGE_ORDER.findIndex(page => page.slug === currentPath);
  
  const prevPage = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
  const nextPage = currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && prevPage) {
      window.location.href = `/${locale}/${prevPage.slug}`;
    } else if (e.key === 'ArrowRight' && nextPage) {
      window.location.href = `/${locale}/${nextPage.slug}`;
    }
  }, [prevPage, nextPage, locale]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  if (!show || currentIndex === -1) return null;
  
  return (
    <div className="mt-12 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        {prevPage ? (
          <Link
            href={`/${locale}/${prevPage.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 flex-1 max-w-sm hover:border-primary/30 transition-colors"
          >
            <ArrowLeft className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {t(prevPage.translationKey)}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1 max-w-sm" />
        )}
        
        {/* Next */}
        {nextPage ? (
          <Link
            href={`/${locale}/${nextPage.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 flex-1 max-w-sm hover:border-primary/30 transition-colors justify-end"
          >
            <div className="min-w-0 text-right">
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {t(nextPage.translationKey)}
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ) : (
          <div className="flex-1 max-w-sm" />
        )}
      </div>
      
      {/* Keyboard hint */}
      <p className="mt-3 text-center text-xs text-muted-foreground/50">
        Use <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 text-xs">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 text-xs">→</kbd> arrow keys to navigate
      </p>
    </div>
  );
}
