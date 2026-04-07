'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ArrowRight, 
  Zap, 
  Cpu, 
  Timer,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Crown,
  Binary,
  Code,
  Network,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Scan,
  Bug,
  Radio,
  FileWarning,
  Search,
  Command,
  BookText,
  FileText,
} from 'lucide-react';
import { LocaleSwitcher } from '@/components/locale-switcher';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Hierarchical navigation structure
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface NavItem {
  slug: string;
  translationKey?: string;
  label?: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  difficulty?: Difficulty;
  isCollapsible?: boolean;
  children?: NavItem[];
}

const NAVIGATION: NavItem[] = [
  { slug: '', translationKey: 'home', icon: Globe, available: true },
  // Core Concepts Section
  {
    slug: 'core-concepts',
    translationKey: 'coreConcepts',
    icon: ArrowRight,
    available: true,
    isCollapsible: true,
    children: [
      { slug: 'transactions', translationKey: 'transactions', icon: ArrowRight, available: true, difficulty: 'beginner' },
      { slug: 'gas', translationKey: 'gas', icon: Zap, available: true, difficulty: 'intermediate' },
      { slug: 'validator', translationKey: 'validator', icon: Crown, available: true, difficulty: 'intermediate' },
      { slug: 'block-internals', translationKey: 'blockInternals', icon: Binary, available: true, difficulty: 'intermediate' },
      { slug: 'protocol-visualizer', translationKey: 'protocolVisualizer', icon: Network, available: true, difficulty: 'beginner' },
      // Coming Soon under Core Concepts
      { slug: 'smart-contracts', translationKey: 'smartContracts', icon: Code, available: false, difficulty: 'advanced' },
      { slug: 'evm', translationKey: 'evm', icon: Cpu, available: false, difficulty: 'advanced' },
      { slug: 'mev', translationKey: 'mev', icon: Timer, available: false, difficulty: 'advanced' },
    ]
  },
  // Security Section
  {
    slug: 'security',
    translationKey: 'securityOverview',
    icon: Shield,
    available: true,
    isCollapsible: true,
    children: [
      { slug: 'security/sandwich-attack', translationKey: 'sandwichAttack', icon: AlertTriangle, available: true, difficulty: 'advanced' },
      { slug: 'security/front-running', translationKey: 'frontRunning', icon: Eye, available: false, difficulty: 'advanced' },
      { slug: 'security/reentrancy', translationKey: 'reentrancy', icon: Bug, available: false, difficulty: 'advanced' },
      { slug: 'security/oracle-manipulation', translationKey: 'oracleManipulation', icon: Scan, available: false, difficulty: 'advanced' },
      { slug: 'security/rogue-proposer', translationKey: 'rogueProposer', icon: FileWarning, available: false, difficulty: 'advanced' },
      { slug: 'security/double-signing', translationKey: 'doubleSigning', icon: Lock, available: false, difficulty: 'advanced' },
      { slug: 'security/eclipse-attack', translationKey: 'eclipseAttack', icon: Radio, available: false, difficulty: 'advanced' },
      { slug: 'security/51-percent', translationKey: 'fiftyOnePercent', icon: FileWarning, available: false, difficulty: 'advanced' },
    ]
  },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bgColor: string }> = {
  beginner: { label: 'B', color: 'text-green-600', bgColor: 'bg-green-500/10' },
  intermediate: { label: 'I', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' },
  advanced: { label: 'A', color: 'text-red-600', bgColor: 'bg-red-500/10' },
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen?: () => void;
}

export function Sidebar({ isOpen, onClose, onSearchOpen }: SidebarProps) {
  const t = useTranslations('sidebar');
  const locale = useLocale();
  const pathname = usePathname();
  const [noteSlugs, setNoteSlugs] = useState<string[]>([]);
  
  // Extract current path for active state
  const currentPath = pathname.replace(`/${locale}/`, '');

  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      try {
        const response = await fetch('/api/notes');

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { notes?: string[] };

        if (isMounted) {
          setNoteSlugs(Array.isArray(data.notes) ? data.notes : []);
        }
      } catch {
        if (isMounted) {
          setNoteSlugs([]);
        }
      }
    }

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const noteItems = useMemo<NavItem[]>(() => {
    return noteSlugs.map((slug) => {
      const chapterMatch = slug.match(/chapter-(\d+)/);
      const chapterNumber = chapterMatch ? Number(chapterMatch[1]) : null;

      return {
        slug: `notes/${slug}`,
        label:
          chapterNumber !== null
            ? t('chapterNotes', { number: chapterNumber })
            : slug,
        icon: FileText,
        available: true,
      };
    });
  }, [noteSlugs, t]);

  const navigationItems = useMemo<NavItem[]>(() => {
    if (noteItems.length === 0) {
      return NAVIGATION;
    }

    return [
      ...NAVIGATION,
      {
        slug: 'notes',
        translationKey: 'notes',
        icon: BookText,
        available: true,
        isCollapsible: true,
        children: noteItems,
      },
    ];
  }, [noteItems]);

  const NavLink = ({ 
    item, 
    onClick, 
    isNested = false 
  }: { 
    item: NavItem, 
    onClick?: () => void,
    isNested?: boolean
  }) => {
    const isActive = currentPath === item.slug;
    const Icon = item.icon;
    const label = item.label ?? (item.translationKey ? t(item.translationKey) : item.slug);
    const diffConfig = item.difficulty ? DIFFICULTY_CONFIG[item.difficulty] : null;
    
    if (!item.available) {
      return (
        <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground/50 cursor-not-allowed ${isNested ? 'ml-2 text-xs' : ''}`}>
          <Icon className={`${isNested ? 'size-3' : 'size-4'}`} />
          <span className="text-sm">{label}</span>
          <span className="ml-auto text-xs">{t('soon')}</span>
        </div>
      );
    }

    return (
      <Link
        href={`/${locale}/${item.slug}`}
        onClick={onClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        } ${isNested ? 'ml-2 text-sm' : ''}`}
      >
        <Icon className={`${isActive ? 'text-primary' : ''} ${isNested ? 'size-3' : 'size-4'}`} />
        <span className="flex-1 truncate">{label}</span>
        {diffConfig && (
          <span className={`inline-flex size-4 items-center justify-center rounded text-[9px] font-bold ${diffConfig.bgColor} ${diffConfig.color}`}>
            {diffConfig.label}
          </span>
        )}
        {isActive && <ChevronRight className="size-4 shrink-0" />}
      </Link>
    );
  };

  const CollapsibleSection = ({ 
    section, 
    onClick 
  }: { 
    section: NavItem, 
    onClick?: () => void 
  }) => {
    const Icon = section.icon;
    const label = section.label ?? (section.translationKey ? t(section.translationKey) : section.slug);
    const isSectionActive = currentPath === section.slug;
    const hasActiveChild = section.children?.some((child: any) => currentPath === child.slug);
    
    // Default to open if this section has an active child
    const [isOpen, setIsOpen] = useState(hasActiveChild);

    // Auto-expand when child becomes active
    React.useEffect(() => {
      if (hasActiveChild) setIsOpen(true);
    }, [hasActiveChild]);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="mt-2">
          {/* Section Header */}
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isSectionActive || hasActiveChild
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className={`size-4 ${isSectionActive || hasActiveChild ? 'text-primary' : ''}`} />
              <span className="text-sm font-semibold">{label}</span>
              <ChevronDown 
                className={`ml-auto size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
          </CollapsibleTrigger>
          
          {/* Section Children */}
          <CollapsibleContent>
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
              {section.children?.map((child: any) => (
                <NavLink 
                  key={child.slug} 
                  item={child} 
                  onClick={onClick}
                  isNested={true}
                />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('sectionTitle')}
        </p>
        
        {navigationItems.map((item) => {
          if (item.children) {
            return (
              <CollapsibleSection 
                key={item.slug} 
                section={item} 
                onClick={onItemClick}
              />
            );
          }
          
          return (
            <NavLink 
              key={item.slug} 
              item={item} 
              onClick={onItemClick}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3">
        <LocaleSwitcher />
        <a
          href="https://github.com/ethereumbook/ethereumbook"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Mastering Ethereum
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible on lg screens */}
      <aside className="fixed left-0 top-0 z-50 h-full w-[250px] border-r border-border bg-card hidden lg:block">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Globe className="size-6 text-primary" />
              <span className="font-bold">InteractiveETH</span>
            </Link>
            <button
              type="button"
              onClick={onSearchOpen}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Search pages"
            >
              <Search className="size-3.5" />
              <Command className="size-3" />
            </button>
          </div>

          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar - Slides in */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-[250px] border-r border-border bg-card lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                  <Link href={`/${locale}`} className="flex items-center gap-2">
                    <Globe className="size-6 text-primary" />
              <span className="font-bold">InteractivETH</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onSearchOpen}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                      aria-label="Search pages"
                    >
                      <Search className="size-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded p-1 hover:bg-secondary"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                <SidebarContent onItemClick={onClose} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileMenuButton({ onClickAction }: { onClickAction: () => void }) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className="fixed top-4 left-4 z-40 rounded-lg border border-border bg-card p-2 shadow-sm lg:hidden"
    >
      <Menu className="size-5" />
    </button>
  );
}
