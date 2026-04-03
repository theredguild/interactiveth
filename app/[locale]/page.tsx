'use client';

import { useTranslations } from 'next-intl';
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
  Play
} from 'lucide-react';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const LEARNING_CARDS = [
  {
    key: 'transactions',
    icon: ArrowRight,
  },
  {
    key: 'validator',
    icon: Crown,
  },
  {
    key: 'gas',
    icon: Zap,
  },
  {
    key: 'blockInternals',
    icon: Binary,
  },
  {
    key: 'security',
    icon: Shield,
  },
];

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

export default function LandingPage() {
  const t = useTranslations();

  return (
    <TutorialLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 text-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight md:text-6xl"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                href="/transactions"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('hero.cta')}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#community"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-secondary"
              >
                {t('landing.hero.ctaSecondary')}
              </a>
            </motion.div>
          </div>
        </section>

        {/* Community Section - Powered by The Red Guild (MOVED UP) */}
        <section id="community" className="relative py-20 bg-gradient-to-b from-background via-accent/5 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* The Red Guild Header */}
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

              {/* Study Group Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm"
              >
                <div className="grid gap-8 lg:grid-cols-2 items-center">
                  {/* Left: Text Content */}
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

                    {/* Single Discord CTA Button */}
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
                      
                      {/* Plain text link below */}
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

                  {/* Right: YouTube Embed */}
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

        {/* What You'll Learn Section (MOVED DOWN) */}
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
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <CardIcon className="size-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`landing.why.${card.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`landing.why.${card.key}.description`)}
                    </p>
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
    </TutorialLayout>
  );
}
