'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { SearchModal } from '@/components/navigation/search-modal';

const LUMA_URL = 'https://luma.com/masteringserrano';
const INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=67zwkh_cC6Q';
const MASTERING_ETHEREUM_URL = 'https://masteringethereum.xyz';
const DISCORD_INVITE_URL = 'https://discord.com/invite/eegRCDmwbM';
const NOTEBOOK_LM_URL = 'https://notebooklm.google.com/notebook/f46ed908-e31c-47b5-aea9-fccfb2293c2d';
const CHAPTER_1_NOTES_URL = '/notes/chapter-1';
const CHAPTER_1_SLIDES_URL =
  'https://drive.google.com/file/d/1kZLWj9N8C96wh-Ow2iV1D-Q9G_IU_4CU/view?usp=drive_link';
const CHAPTER_1_YOUTUBE_URL =
  'https://www.youtube.com/playlist?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_';

const PAST_CHAPTERS = [
  {
    slug: 'chapter-1',
    number: 1,
    chapterUrl: 'https://masteringethereum.xyz/chapter_1.html',
    youtubeUrl: CHAPTER_1_YOUTUBE_URL,
    links: [
      { label: 'notes', url: CHAPTER_1_NOTES_URL },
      { label: 'slides', url: CHAPTER_1_SLIDES_URL },
    ],
  },
] as const;

function resolveHref(locale: string, href: string) {
  return href.startsWith('/') ? `/${locale}${href}` : href;
}

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen((previous) => !previous);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-primary/20 bg-card/90 p-2.5 text-primary shadow-lg shadow-black/30 backdrop-blur lg:hidden"
        aria-label={t('landing.frontPage.menu.open')}
      >
        <Menu className="size-5" />
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main className="relative flex-1 overflow-hidden lg:ml-[250px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(164,114,255,0.18),transparent_28%),linear-gradient(180deg,rgba(12,11,20,0.96),rgba(9,9,16,1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(164,114,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-10 px-4 py-16 sm:px-6">

          {/* Hero */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
              {t('landing.frontPage.badge')}
            </p>
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('landing.frontPage.title')}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t('landing.frontPage.subtitle')}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('landing.frontPage.studyGroup.prefix')}{' '}
              <a
                href={MASTERING_ETHEREUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-accent"
              >
                {t('landing.frontPage.studyGroup.linkLabel')}
              </a>
              .
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col">
            {[
              { label: t('landing.frontPage.introVideo'), href: INTRO_VIDEO_URL },
              { label: t('landing.frontPage.lumaSubscribe'), href: LUMA_URL },
              { label: t('landing.frontPage.discordJoin'), href: DISCORD_INVITE_URL },
              { label: t('landing.frontPage.notebookLm'), href: NOTEBOOK_LM_URL },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-white/8 py-4 transition hover:border-primary/30"
              >
                <span className="text-sm font-medium text-foreground">
                  {link.label}
                </span>
                <ExternalLink className="size-4 text-muted-foreground transition group-hover:text-primary" />
              </a>
            ))}
          </nav>

          {/* Past chapters */}
          {PAST_CHAPTERS.length > 0 && (
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
                {t('landing.frontPage.sections.past.kicker')}
              </p>
              {PAST_CHAPTERS.map((chapter) => (
                <div
                  key={chapter.slug}
                  className="border-l-2 border-white/10 py-2 pl-4"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {t('landing.frontPage.sections.past.chapterLabel', {
                        number: chapter.number,
                      })}
                    </span>
                    <span className="text-white/16">&mdash;</span>
                    <a
                      href={chapter.chapterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {t('landing.frontPage.sections.past.webCta')}
                    </a>
                    {chapter.youtubeUrl ? (
                      <a
                        href={chapter.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition hover:text-primary"
                      >
                        {t('landing.frontPage.sections.past.playlistCta')}
                      </a>
                    ) : (
                      <span className="group/coming-soon relative inline-flex cursor-not-allowed text-sm text-muted-foreground/70">
                        <span>{t('landing.frontPage.sections.past.playlistCta')}</span>
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-md border border-primary/20 bg-card/95 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary opacity-0 shadow-lg shadow-black/30 transition group-hover/coming-soon:opacity-100">
                          {t('landing.frontPage.linkStatuses.comingSoon')}
                        </span>
                      </span>
                    )}
                    {chapter.links.map((link) => (
                      <a
                        key={link.url}
                        href={resolveHref(locale, link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition hover:text-primary"
                      >
                        {t(`landing.frontPage.linkLabels.${link.label}`)}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="text-xs text-muted-foreground">
            <p>{t('footer.bookCredit')}</p>
          </footer>
        </div>
      </main>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
