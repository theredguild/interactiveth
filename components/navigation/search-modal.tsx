'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, Shield, BookOpen, Command } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  section: 'core' | 'security';
  icon: React.ReactNode;
  tags: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'InteractivETH landing page',
    href: '/',
    section: 'core',
    icon: <BookOpen className="size-4" />,
    tags: ['start', 'overview'],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    description: 'Learn how Ethereum transactions work',
    href: '/transactions',
    section: 'core',
    icon: <FileText className="size-4" />,
    tags: ['tx', 'transfer', 'send'],
  },
  {
    id: 'gas',
    title: 'Gas & Fees',
    description: 'Understand gas prices and transaction fees',
    href: '/gas',
    section: 'core',
    icon: <FileText className="size-4" />,
    tags: ['fee', 'gwei', 'cost'],
  },
  {
    id: 'validator',
    title: 'Validator',
    description: 'How validators build blocks',
    href: '/validator',
    section: 'core',
    icon: <FileText className="size-4" />,
    tags: ['consensus', 'block', 'proposer'],
  },
  {
    id: 'block-internals',
    title: 'Block Internals',
    description: 'What\'s inside an Ethereum block',
    href: '/block-internals',
    section: 'core',
    icon: <FileText className="size-4" />,
    tags: ['block', 'structure', 'header'],
  },
  {
    id: 'protocol-visualizer',
    title: 'Protocol Visualizer',
    description: 'Visual overview of Ethereum protocol',
    href: '/protocol-visualizer',
    section: 'core',
    icon: <FileText className="size-4" />,
    tags: ['overview', 'diagram'],
  },
  {
    id: 'security',
    title: 'Security Overview',
    description: 'Ethereum security concepts',
    href: '/security',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['attacks', 'vulnerabilities'],
  },
  {
    id: 'sandwich-attack',
    title: 'Sandwich Attack',
    description: 'MEV sandwich attacks on DEX trades',
    href: '/security/sandwich-attack',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['mev', 'dex', 'front-run', 'back-run'],
  },
  {
    id: 'front-running',
    title: 'Front Running',
    description: 'How front running works in Ethereum',
    href: '/security/front-running',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['mev', 'mempool'],
  },
  {
    id: 'reentrancy',
    title: 'Reentrancy Attack',
    description: 'Smart contract reentrancy vulnerability',
    href: '/security/reentrancy',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['contract', 'exploit', 'dao'],
  },
  {
    id: 'oracle-manipulation',
    title: 'Oracle Manipulation',
    description: 'Price oracle manipulation attacks',
    href: '/security/oracle-manipulation',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['price', 'defi', 'flash loan'],
  },
  {
    id: 'rogue-proposer',
    title: 'Rogue Proposer',
    description: 'Malicious block proposer scenarios',
    href: '/security/rogue-proposer',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['consensus', 'validator'],
  },
  {
    id: 'double-signing',
    title: 'Double Signing',
    description: 'Validator double signing attacks',
    href: '/security/double-signing',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['slashing', 'validator'],
  },
  {
    id: 'eclipse-attack',
    title: 'Eclipse Attack',
    description: 'Network-level eclipse attacks',
    href: '/security/eclipse-attack',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['network', 'p2p', 'isolation'],
  },
  {
    id: '51-percent',
    title: '51% Attack',
    description: 'Majority hash power attacks',
    href: '/security/51-percent',
    section: 'security',
    icon: <Shield className="size-4" />,
    tags: ['pow', 'hashrate', 'consensus'],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const locale = useLocale();
  const router = useRouter();
  
  const filteredResults = useMemo(() => {
    if (!query.trim()) return SEARCH_ITEMS;
    
    const q = query.toLowerCase();
    return SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.includes(q))
    );
  }, [query]);
  
  const handleSelect = useCallback((href: string) => {
    router.push(`/${locale}${href}`);
    onClose();
    setQuery('');
    setSelectedIndex(0);
  }, [router, locale, onClose]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex].href);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filteredResults, selectedIndex, handleSelect, onClose]);
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/4 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="size-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 text-xs text-muted-foreground">
                  <Command className="size-3" />K
                </kbd>
                <button onClick={onClose} className="p-1 rounded hover:bg-secondary/50">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredResults.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  filteredResults.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        index === selectedIndex ? 'bg-primary/10' : 'hover:bg-secondary/30'
                      }`}
                    >
                      <div className={`p-1.5 rounded ${
                        item.section === 'security' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <ArrowRight className="size-3.5 text-muted-foreground/50 shrink-0" />
                    </button>
                  ))
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 border-t border-border bg-secondary/20">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><kbd className="px-1.5 py-0.5 rounded bg-secondary/50">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-secondary/50">↵</kbd> Select</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-secondary/50">esc</kbd> Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to use search globally
export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  
  return { isOpen, open, close };
}
