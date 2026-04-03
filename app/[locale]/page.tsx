'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Crown, 
  Zap, 
  Binary,
  Shield,
  Code,
  Cpu,
  Timer,
  ExternalLink,
  MessageCircle,
  Play,
  Search,
  Command,
  Menu,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { useState, useEffect } from 'react';
import { SearchModal } from '@/components/navigation/search-modal';

const LEARNING_CARDS = [
  {
    key: 'transactions',
    icon: ArrowRight,
    href: '/transactions',
    difficulty: 'beginner' as const,
  },
  {
    key: 'validator',
    icon: Crown,
    href: '/validator',
    difficulty: 'intermediate' as const,
  },
  {
    key: 'gas',
    icon: Zap,
    href: '/gas',
    difficulty: 'intermediate' as const,
  },
  {
    key: 'blockInternals',
    icon: Binary,
    href: '/block-internals',
    difficulty: 'intermediate' as const,
  },
  {
    key: 'security',
    icon: Shield,
    href: '/security',
    difficulty: 'advanced' as const,
  },
];

const DIFFICULTY_BADGES = {
  beginner: { label: 'Beginner', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  advanced: { label: 'Advanced', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
};

const COMING_SOON_CARDS = [
  {
    key: 'smartContracts',
    icon: Code,
  },
  {
    key: 'evm',
    icon: Cpu,
  },
  {
    key: 'mev',
    icon: Timer,
  },
];

// Animated Ethereum diamond SVG
function EthereumDiamond({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 256 417" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" 
        fill="currentColor" 
        opacity="0.6"
      />
      <path 
        d="M127.962 0L0 212.32l127.962 75.639V154.158z" 
        fill="currentColor" 
        opacity="0.4"
      />
      <path 
        d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z" 
        fill="currentColor" 
        opacity="0.5"
      />
      <path 
        d="M127.962 416.905v-104.72L0 236.585z" 
        fill="currentColor" 
        opacity="0.3"
      />
      <path 
        d="M127.961 287.958l127.96-75.637-127.96-58.162z" 
        fill="currentColor" 
        opacity="0.7"
      />
      <path 
        d="M0 212.32l127.96 75.638v-154.16z" 
        fill="currentColor" 
        opacity="0.5"
      />
    </svg>
  );
}

// Floating particles background - only renders on client to avoid hydration mismatch
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }))
  );

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 rounded-lg border border-border bg-card p-2 shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      
      {/* Main Content - Full width for landing page */}
      <main className="flex-1 lg:ml-[250px]">
        <div className="min-h-screen">
          {/* Hero Section - Ethereum Themed */}
          <section className="relative py-24 md:py-32 text-center overflow-hidden gradient-ethereum-hero">
            {/* Background effects */}
            <FloatingParticles />
            
            {/* Large subtle diamond watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <EthereumDiamond className="w-[600px] h-[600px] text-primary animate-float" />
            </div>
            
            {/* Radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container relative mx-auto px-4">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-ethereum/30 bg-ethereum/10 px-4 py-1.5"
              >
                <div className="size-2 rounded-full bg-ethereum animate-pulse-glow" />
                <span className="text-sm text-ethereum-light">Powered by The Red Guild</span>
              </motion.div>
              
              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-foreground via-foreground to-ethereum-light bg-clip-text">
                  {t('hero.title')}
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground"
              >
                {t('hero.subtitle')}
              </motion.p>
              
              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  href={`/${locale}/transactions`}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg gradient-ethereum px-6 py-3.5 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-ethereum/25 hover:-translate-y-0.5"
                >
                  {t('hero.cta')}
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 font-medium transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5"
                >
                  <Search className="size-4 text-muted-foreground" />
                  {t('landing.hero.ctaSecondary')}
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/50 text-[10px] text-muted-foreground">
                    <Command className="size-2.5" />K
                  </kbd>
                </button>
              </motion.div>
            </div>
          </section>

          {/* Community Section */}
          <section id="community" className="relative py-20 bg-gradient-to-b from-background via-accent/5 to-accent/10">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5"
                  >
                    <span className="text-lg">{t('landing.community.subtitle')}</span>
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-4"
                  >
                    {t('landing.community.title')}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground max-w-2xl mx-auto"
                  >
                    {t('landing.community.description')}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm"
                >
                  <div className="grid gap-8 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3 text-xl font-semibold flex items-center gap-2">
                          <MessageCircle className="size-5 text-primary" />
                          {t('landing.community.studyGroup.title')}
                        </h3>
                        <p className="text-muted-foreground">
                          {t('landing.community.studyGroup.description')}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <a
                          href="https://discord.gg/eegRCDmwbM"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4752C4] w-full sm:w-auto"
                        >
                          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                          {t('landing.community.studyGroup.discord')}
                          <ExternalLink className="size-3.5 opacity-70" />
                        </a>
                        
                        <p className="text-sm text-muted-foreground">
                          read{' '}
                          <a
                            href="https://discord.gg/eegRCDmwbM"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            #{t('landing.community.studyGroup.channel')}
                          </a>{' '}
                          messages
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg">
                        <iframe
                          src="https://www.youtube.com/embed/videoseries?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_&rel=0"
                          title="Mastering Ethereum Study Group Playlist"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                          loading="lazy"
                        />
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=67zwkh_cC6Q&list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Play className="size-4" />
                        {t('landing.community.studyGroup.youtube')}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What You'll Learn Section */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-3">
                  {t('landing.why.title')}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {t('landing.why.subtitle')}
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                {LEARNING_CARDS.map((card, index) => {
                  const CardIcon = card.icon;
                  const badge = DIFFICULTY_BADGES[card.difficulty];
                  return (
                    <motion.div
                      key={card.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <CardIcon className="size-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {t(`landing.why.${card.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(`landing.why.${card.key}.description`)}
                      </p>
                      <Link
                        href={`/${locale}${card.href}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Learn more
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="py-16 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-3">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  More advanced topics in development
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                {COMING_SOON_CARDS.map((card, index) => {
                  const CardIcon = card.icon;
                  return (
                    <motion.div
                      key={card.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative rounded-xl border border-border bg-secondary/30 p-6 transition-all duration-300 opacity-60"
                    >
                      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted/50 transition-colors">
                        <CardIcon className="size-6 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                        {t(`landing.comingSoon.${card.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">
                        {t(`landing.comingSoon.${card.key}.description`)}
                      </p>
                      <span className="absolute top-4 right-4 text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        Soon
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border py-8 bg-background">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t('footer.attribution')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('footer.bookCredit')}
              </p>
            </div>
          </footer>
        </div>
      </main>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
