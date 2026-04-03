'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

// Map each page to its parent section
const PAGE_HIERARCHY: Record<string, { section: string | null; label: string }> = {
  'transactions': { section: 'coreConcepts', label: 'transactions' },
  'gas': { section: 'coreConcepts', label: 'gas' },
  'validator': { section: 'coreConcepts', label: 'validator' },
  'block-internals': { section: 'coreConcepts', label: 'blockInternals' },
  'protocol-visualizer': { section: 'coreConcepts', label: 'protocolVisualizer' },
  'security': { section: null, label: 'securityOverview' },
  'security/sandwich-attack': { section: 'security', label: 'sandwichAttack' },
  'security/front-running': { section: 'security', label: 'frontRunning' },
  'security/reentrancy': { section: 'security', label: 'reentrancy' },
  'security/oracle-manipulation': { section: 'security', label: 'oracleManipulation' },
  'security/rogue-proposer': { section: 'security', label: 'rogueProposer' },
  'security/double-signing': { section: 'security', label: 'doubleSigning' },
  'security/eclipse-attack': { section: 'security', label: 'eclipseAttack' },
  'security/51-percent': { section: 'security', label: 'fiftyOnePercent' },
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('sidebar');
  
  // Remove locale prefix
  const pathWithoutLocale = pathname.replace(`/${locale}`, '').replace(/^\//, '');
  
  // Don't render on home page
  if (!pathWithoutLocale) return null;
  
  const pageInfo = PAGE_HIERARCHY[pathWithoutLocale];
  
  // If page not in hierarchy, fall back to simple path-based breadcrumbs
  if (!pageInfo) {
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('home'), href: `/${locale}`, isCurrent: false },
    ];
    
    let cumulativePath = '';
    for (let i = 0; i < segments.length; i++) {
      cumulativePath += `/${segments[i]}`;
      breadcrumbs.push({
        label: t(segments[i]) || segments[i],
        href: `/${locale}${cumulativePath}`,
        isCurrent: i === segments.length - 1,
      });
    }
    
    return <BreadcrumbList breadcrumbs={breadcrumbs} />;
  }
  
  // Build hierarchy-aware breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('home'), href: `/${locale}`, isCurrent: false },
  ];
  
  // Add section if it exists
  if (pageInfo.section) {
    breadcrumbs.push({
      label: t(pageInfo.section),
      href: `/${locale}/${pageInfo.section}`,
      isCurrent: false,
    });
  }
  
  // Add current page
  breadcrumbs.push({
    label: t(pageInfo.label),
    href: `/${locale}/${pathWithoutLocale}`,
    isCurrent: true,
  });
  
  return <BreadcrumbList breadcrumbs={breadcrumbs} />;
}

function BreadcrumbList({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />
            )}
            {crumb.isCurrent ? (
              <span className="text-foreground font-medium truncate max-w-[200px]">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 ? <Home className="size-3.5" /> : crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
