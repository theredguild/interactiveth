'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BookOpen, ExternalLink, Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { SearchModal } from '@/components/navigation/search-modal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const LUMA_URL = 'https://luma.com/masteringserrano';
const MASTERING_ETHEREUM_URL = 'https://masteringethereum.xyz';
const DISCORD_INVITE_URL = 'https://discord.com/invite/eegRCDmwbM';
const CHAPTER_1_NOTES_URL = '/notes/chapter-1';
const CHAPTER_1_SLIDES_URL =
  'https://drive.google.com/file/d/1kZLWj9N8C96wh-Ow2iV1D-Q9G_IU_4CU/view?usp=drive_link';
const CHAPTER_1_YOUTUBE_URL =
  'https://www.youtube.com/playlist?list=PLvTXryB-aeclKsDmbPj3WKPdtBmZ5_xZX';
const PLAYLIST_EMBED_URL =
  'https://www.youtube.com/embed/videoseries?list=PLvTXryB-aeclKsDmbPj3WKPdtBmZ5_xZX';

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

        <div className="relative w-full py-8 px-6 sm:px-10 lg:pl-14 lg:pr-6 xl:pl-20 xl:pr-0">
          <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_3fr_1fr]">

            {/* Capítulos pasados */}
            {PAST_CHAPTERS.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
                  {t('landing.frontPage.sections.past.kicker')}
                </p>
                {PAST_CHAPTERS.map((chapter) => (
                  <div key={chapter.slug} className="border-l-2 border-white/10 py-2 pl-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">
                        {t('landing.frontPage.sections.past.chapterLabel', { number: chapter.number })}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        {t(`landing.frontPage.chapters.${chapter.slug}.name`)}
                      </span>
                      <div className="flex gap-3 pt-1">
                        <a href={chapter.chapterUrl} target="_blank" rel="noopener noreferrer" title="Open chapter" className="rounded-md border border-white/10 px-2 py-0.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                          {t('landing.frontPage.sections.past.webCta')}
                        </a>
                        {chapter.youtubeUrl ? (
                          <a href={chapter.youtubeUrl} target="_blank" rel="noopener noreferrer" title="Open in YouTube" className="rounded-md border border-white/10 px-2 py-0.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                            {t('landing.frontPage.sections.past.playlistCta')}
                          </a>
                        ) : (
                          <span className="cursor-not-allowed rounded-md border border-white/5 px-2 py-0.5 text-sm text-muted-foreground/30">
                            {t('landing.frontPage.sections.past.playlistCta')}
                          </span>
                        )}
                        {chapter.links.filter((l) => l.label === 'notes').map((link) => (
                          <Link key={link.url} href={`/${locale}${link.url}`} title="Notes" className="rounded-md border border-white/10 px-2 py-0.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                            {t('landing.frontPage.linkLabels.notes')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Centro — hero + CTA */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
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

              {/* CTA card */}
              <div className="grid overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] grid-cols-1 sm:grid-cols-[1fr_240px]">
                <div className="flex flex-col justify-between gap-4 p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-primary/70" />
                      <span className="text-sm font-semibold text-foreground">
                        {t('landing.frontPage.cta.title')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t('landing.frontPage.cta.description')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/70 hover:bg-primary/20"
                    >
                      {t('landing.frontPage.cta.discordCta')}
                      <ExternalLink className="size-3.5" />
                    </a>
                    <a
                      href={LUMA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-white/40 hover:bg-white/10 hover:text-foreground"
                    >
                      {t('landing.frontPage.cta.lumaCta')}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
                <div className="hidden overflow-hidden sm:block">
                  <iframe
                    src={PLAYLIST_EMBED_URL}
                    title={t('landing.frontPage.sections.past.embedTitle')}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>

              <footer className="text-xs text-muted-foreground">
                <p>{t('footer.bookCredit')}</p>
              </footer>
            </div>

            {/* Contribuidores */}
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
                {t('landing.frontPage.contributors.kicker')}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { handle: 'd4rm_', name: 'dantesito', url: 'https://x.com/d4rm_' },
                  { handle: 'mattaereal', name: 'matta', url: 'https://x.com/mattaereal' },
                ].map((contributor) => (
                  <a
                    key={contributor.handle}
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 transition"
                  >
                    <Avatar className="size-7 ring-1 ring-white/10 transition group-hover:ring-primary/40">
                      <AvatarImage
                        src={`https://unavatar.io/twitter/${contributor.handle}`}
                        alt={contributor.name}
                      />
                      <AvatarFallback className="text-[10px] text-muted-foreground">
                        {contributor.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground transition group-hover:text-foreground">
                      {contributor.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
