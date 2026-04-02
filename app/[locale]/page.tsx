'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Code, 
  Zap, 
  Cpu, 
  Timer,
  Globe,
  Github
} from 'lucide-react';

const TUTORIALS = [
  {
    slug: 'transactions',
    translationKey: 'transactions',
    icon: ArrowRight,
    available: true,
  },
  {
    slug: 'blocks',
    translationKey: 'blocks',
    icon: Layers,
    available: true,
  },
  {
    slug: 'smart-contracts',
    translationKey: 'smartContracts',
    icon: Code,
    available: false,
  },
  {
    slug: 'gas',
    translationKey: 'gas',
    icon: Zap,
    available: false,
  },
  {
    slug: 'evm',
    translationKey: 'evm',
    icon: Cpu,
    available: false,
  },
  {
    slug: 'mev',
    translationKey: 'mev',
    icon: Timer,
    available: false,
  },
];

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Globe className="size-6 text-primary" />
            <span className="text-xl font-bold">InteractiveETH</span>
          </div>
          <nav className="flex items-center gap-4">
            <LocaleSwitcher />
            <a
              href="https://github.com/ethereumbook/ethereumbook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="size-5" />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('hero.cta')}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#tutorials"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-secondary"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {t('landing.features.title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t('landing.features.visual.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.visual.description')}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10">
                  <Zap className="size-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t('landing.features.handsOn.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.handsOn.description')}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-chart-3/10">
                  <Github className="size-6 text-chart-3" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t('landing.features.openSource.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.openSource.description')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="tutorials" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold">
              {t('tutorials.title')}
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              {t('tutorials.subtitle')}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TUTORIALS.map((tutorial) => {
                const TutorialIcon = tutorial.icon;
                const title = t(`tutorial.${tutorial.translationKey}.title`);
                const description = t(`tutorial.${tutorial.translationKey}.description`);

                return (
                  <div
                    key={tutorial.slug}
                    className={`rounded-xl border p-6 transition-colors ${
                      tutorial.available
                        ? 'border-border bg-card hover:border-primary/50'
                        : 'border-dashed border-muted-foreground/30 bg-muted/30'
                    }`}
                  >
                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <TutorialIcon className="size-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{description}</p>
                    {tutorial.available ? (
                      <Link
                        href={`/${tutorial.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {t('tutorials.start')}
                        <ArrowRight className="size-3" />
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('tutorials.comingSoon')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
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
  );
}
