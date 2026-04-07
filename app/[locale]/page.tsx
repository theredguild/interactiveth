'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CalendarRange,
  Command,
  ExternalLink,
  LibraryBig,
  Menu,
  PlayCircle,
  Search,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { SearchModal } from '@/components/navigation/search-modal';

const LUMA_EVENT_URL = 'https://luma.com/event/evt-WSD5ZSYfGtvMymJ';
const LUMA_EVENT_EMBED_URL = 'https://luma.com/embed/event/evt-WSD5ZSYfGtvMymJ/simple';
const YOUTUBE_PLAYLIST_EMBED_URL =
  'https://www.youtube.com/embed/videoseries?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_&rel=0';
const YOUTUBE_PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PLvTXryB-aecnlPmF9cyA8svSmezw7bTX_';
const NOTEBOOK_LM_URL = 'https://notebooklm.google.com/notebook/f46ed908-e31c-47b5-aea9-fccfb2293c2d';
const MASTERING_ETHEREUM_URL = 'https://masteringethereum.xyz';
const CHAPTER_1_SLIDES_URL =
  'https://drive.google.com/file/d/1kZLWj9N8C96wh-Ow2iV1D-Q9G_IU_4CU/view?usp=drive_link';
const CHAPTER_1_NOTES_URL = '/notes/chapter-1';
const CHAPTER_2_NOTES_URL = '/notes/chapter-2';

type LessonLink = {
  slug: string;
  translationKey: string;
};

function resolveHref(locale: string, href: string) {
  return href.startsWith('/') ? `/${locale}${href}` : href;
}

const CURRENT_CHAPTER = {
  slug: 'chapter-2',
  chapterNumber: 2,
  chapterUrl: 'https://masteringethereum.xyz/chapter_2.html',
  lessonLinks: [
    {
      slug: 'transactions',
      translationKey: 'transactions',
    },
    {
      slug: 'gas',
      translationKey: 'gas',
    },
  ] as LessonLink[],
  resources: ['notebooklm', 'playlist'],
  resourceLinks: [
    {
      labelKey: 'notes',
      url: CHAPTER_2_NOTES_URL,
      prominent: false,
    },
  ],
} as const;

const PAST_CHAPTERS = [
  {
    slug: 'chapter-1',
    chapterNumber: 1,
    chapterUrl: 'https://masteringethereum.xyz/chapter_1.html',
    lessonLinks: [] as LessonLink[],
    resources: ['playlist', 'notebooklm'],
    resourceLinks: [
      {
        labelKey: 'notes',
        url: CHAPTER_1_NOTES_URL,
        prominent: true,
      },
      {
        labelKey: 'slides',
        url: CHAPTER_1_SLIDES_URL,
        prominent: false,
      },
    ],
  },
] as const;

function TerminalFrame({
  children,
  title,
  status,
}: {
  children: React.ReactNode;
  title: string;
  status: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-primary/18 bg-card/90 shadow-[0_0_0_1px_rgba(164,114,255,0.06),0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(164,114,255,0.06),transparent_18%,transparent_82%,rgba(34,211,238,0.04))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(164,114,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
      <div className="relative border-b border-primary/12 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-primary/75">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-primary/80" />
              <span className="size-2 rounded-full bg-accent/55" />
              <span className="size-2 rounded-full bg-primary/30" />
            </div>
            <span>{title}</span>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.32em] text-primary-foreground/85">
            {status}
          </span>
        </div>
      </div>
      <div className="relative p-5 sm:p-6">{children}</div>
    </div>
  );
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

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-20 sm:px-6 lg:px-10 lg:pt-10">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-10 rounded-[32px] border border-primary/16 bg-card/45 p-6 shadow-[0_0_0_1px_rgba(164,114,255,0.05)] backdrop-blur-sm sm:p-8"
          >
            <div className="mb-8 flex flex-col gap-4 border-b border-primary/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.34em] text-primary/80">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_14px_rgba(164,114,255,0.7)]" />
                  {t('landing.frontPage.badge')}
                </div>

                <h1 className="max-w-4xl font-mono text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                  {t('landing.frontPage.title')}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {t('landing.frontPage.subtitle')}
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {t('landing.frontPage.studyGroup.prefix')}{' '}
                  <a
                    href={MASTERING_ETHEREUM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-accent hover:decoration-accent/50"
                  >
                    {t('landing.frontPage.studyGroup.linkLabel')}
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-end">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/35 hover:bg-primary/16"
                >
                  <Search className="size-4" />
                  {t('landing.frontPage.search')}
                  <kbd className="ml-1 hidden rounded border border-primary/20 bg-background/40 px-1.5 text-[10px] text-primary/80 sm:inline-flex">
                    <Command className="size-2.5" />K
                  </kbd>
                </button>

                <Link
                  href={`/${locale}/transactions`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/25 hover:bg-secondary/60"
                >
                  {t('landing.frontPage.primaryCta')}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary/65">
                  {t('landing.frontPage.panels.current.label')}
                </p>
                <p>{t('landing.frontPage.panels.current.value')}</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent/80">
                  {t('landing.frontPage.panels.past.label')}
                </p>
                <p>{t('landing.frontPage.panels.past.value')}</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-primary/65">
                  {t('landing.frontPage.panels.resources.label')}
                </p>
                <p>{t('landing.frontPage.panels.resources.value')}</p>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <motion.section
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45, ease: 'easeOut' }}
            >
              <TerminalFrame
                title={t('landing.frontPage.sections.current.frameTitle')}
                status={t('landing.frontPage.sections.current.status')}
              >
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/16 bg-primary/8 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-primary/75">
                      <CalendarRange className="size-3.5" />
                      {t('landing.frontPage.sections.current.kicker')}
                    </div>
                    <h2 className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
                      {t('landing.frontPage.sections.current.title')}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {t('landing.frontPage.sections.current.description')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={CURRENT_CHAPTER.chapterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/25 hover:bg-secondary/60"
                    >
                      {t('landing.frontPage.sections.current.chapterCta')}
                      <ExternalLink className="size-4" />
                    </a>
                    <a
                      href={LUMA_EVENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/22 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/40 hover:bg-primary/16"
                    >
                      {t('landing.frontPage.sections.current.eventCta')}
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </div>

                <div className="mb-6 rounded-[24px] border border-border bg-background/40 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary/70">
                        {t('landing.frontPage.sections.current.chapterLabel', {
                          number: CURRENT_CHAPTER.chapterNumber,
                        })}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
                        {t(`landing.frontPage.chapters.${CURRENT_CHAPTER.slug}.title`)}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary/65">
                        {t('landing.frontPage.sections.current.routesLabel')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {CURRENT_CHAPTER.lessonLinks.length > 0 ? (
                          CURRENT_CHAPTER.lessonLinks.map((lesson) => (
                            <Link
                              key={lesson.slug}
                              href={`/${locale}/${lesson.slug}`}
                              className="rounded-full border border-border bg-secondary/45 px-3 py-1.5 text-sm text-foreground transition hover:border-primary/20 hover:bg-secondary/70"
                            >
                              {t(`sidebar.${lesson.translationKey}`)}
                            </Link>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {t('landing.frontPage.sections.current.noRoute')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary/65">
                        {t('landing.frontPage.sections.current.resourcesLabel')}
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {CURRENT_CHAPTER.resources.map((resource) => (
                          <li key={resource} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-accent/80" />
                            <span>{t(`landing.frontPage.resourcesList.${resource}`)}</span>
                          </li>
                        ))}
                      </ul>

                      {CURRENT_CHAPTER.resourceLinks && CURRENT_CHAPTER.resourceLinks.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {CURRENT_CHAPTER.resourceLinks.map((resourceLink) => (
                            <a
                              key={resourceLink.url}
                              href={resolveHref(locale, resourceLink.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/8 px-3 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/35 hover:bg-primary/14"
                            >
                              {t(`landing.frontPage.linkLabels.${resourceLink.labelKey}`)}
                              <ExternalLink className="size-4" />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-border bg-background/50">
                  <iframe
                    src={LUMA_EVENT_EMBED_URL}
                    title={t('landing.frontPage.sections.current.embedTitle')}
                    allow="fullscreen; payment"
                    className="h-[450px] w-full md:h-[520px]"
                    loading="lazy"
                  />
                </div>
              </TerminalFrame>
            </motion.section>

            <div className="grid gap-6">
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.45, ease: 'easeOut' }}
              >
                <TerminalFrame
                  title={t('landing.frontPage.sections.playlist.frameTitle')}
                  status={t('landing.frontPage.sections.playlist.status')}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-accent/90">
                        <PlayCircle className="size-3.5" />
                        {t('landing.frontPage.sections.playlist.kicker')}
                      </div>
                      <h2 className="font-mono text-2xl font-semibold text-foreground">
                        {t('landing.frontPage.sections.playlist.title')}
                      </h2>
                    </div>
                  </div>

                  <p className="mb-5 text-sm leading-7 text-muted-foreground">
                    {t('landing.frontPage.sections.playlist.description')}
                  </p>

                  <div className="overflow-hidden rounded-[22px] border border-border bg-background/50">
                    <iframe
                      src={YOUTUBE_PLAYLIST_EMBED_URL}
                      title={t('landing.frontPage.sections.playlist.embedTitle')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full"
                      loading="lazy"
                    />
                  </div>

                  <a
                    href={YOUTUBE_PLAYLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:text-accent/80"
                  >
                    {t('landing.frontPage.sections.playlist.cta')}
                    <ExternalLink className="size-4" />
                  </a>
                </TerminalFrame>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
              >
                <TerminalFrame
                  title={t('landing.frontPage.sections.resources.frameTitle')}
                  status={t('landing.frontPage.sections.resources.status')}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/16 bg-primary/8 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-primary/75">
                    <LibraryBig className="size-3.5" />
                    {t('landing.frontPage.sections.resources.kicker')}
                  </div>

                  <h2 className="font-mono text-2xl font-semibold text-foreground">
                    {t('landing.frontPage.sections.resources.title')}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {t('landing.frontPage.sections.resources.description')}
                  </p>

                  <div className="mt-6 rounded-[22px] border border-primary/16 bg-primary/6 p-5">
                    <p className="font-mono text-sm uppercase tracking-[0.24em] text-primary/75">
                      {t('landing.frontPage.sections.resources.cardLabel')}
                    </p>
                    <p className="mt-3 text-base text-foreground">
                      {t('landing.frontPage.sections.resources.cardTitle')}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {t('landing.frontPage.sections.resources.cardDescription')}
                    </p>

                    <a
                      href={NOTEBOOK_LM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/22 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/40 hover:bg-primary/16"
                    >
                      {t('landing.frontPage.sections.resources.cta')}
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </TerminalFrame>
              </motion.section>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.45, ease: 'easeOut' }}
            className="mt-6"
          >
            <TerminalFrame
              title={t('landing.frontPage.sections.past.frameTitle')}
              status={t('landing.frontPage.sections.past.status')}
            >
              <div className="mb-6 max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/16 bg-primary/8 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-primary/75">
                  <LibraryBig className="size-3.5" />
                  {t('landing.frontPage.sections.past.kicker')}
                </div>

                <h2 className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
                  {t('landing.frontPage.sections.past.title')}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {t('landing.frontPage.sections.past.description')}
                </p>
              </div>

              <div className="space-y-4">
                {PAST_CHAPTERS.map((chapter) => (
                  <article
                    key={chapter.slug}
                    className="rounded-[24px] border border-border bg-secondary/20 p-5 shadow-[0_0_0_1px_rgba(164,114,255,0.03)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary/70">
                          {t('landing.frontPage.sections.past.chapterLabel', {
                            number: chapter.chapterNumber,
                          })}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-foreground">
                          {t(`landing.frontPage.chapters.${chapter.slug}.title`)}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                            href={YOUTUBE_PLAYLIST_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:border-accent/35 hover:bg-accent/16"
                          >
                            {t('landing.frontPage.sections.past.videoCta')}
                            <ExternalLink className="size-4" />
                          </a>
                        <a
                          href={chapter.chapterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/35 hover:bg-primary/16"
                          >
                            {t('landing.frontPage.sections.past.webCta')}
                            <ExternalLink className="size-4" />
                          </a>
                          {chapter.resourceLinks
                            ?.filter((resourceLink) => resourceLink.prominent)
                            .map((resourceLink) => (
                              <a
                                key={resourceLink.url}
                                href={resolveHref(locale, resourceLink.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/35 hover:bg-secondary/60"
                              >
                                {t(`landing.frontPage.linkLabels.${resourceLink.labelKey}`)}
                                <ExternalLink className="size-4" />
                              </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
                      <div className="rounded-2xl border border-border bg-background/40 p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary/65">
                          {t('landing.frontPage.sections.past.routesLabel')}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {chapter.lessonLinks.length > 0 ? (
                            chapter.lessonLinks.map((lesson) => (
                              <Link
                                key={lesson.slug}
                                href={`/${locale}/${lesson.slug}`}
                                className="rounded-full border border-border bg-secondary/45 px-3 py-1.5 text-sm text-foreground transition hover:border-primary/20 hover:bg-secondary/70"
                              >
                                {t(`sidebar.${lesson.translationKey}`)}
                              </Link>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {t('landing.frontPage.sections.past.noRoute')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/40 p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary/65">
                          {t('landing.frontPage.sections.past.resourcesLabel')}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {chapter.resources.map((resource) => (
                            <li key={resource} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 rounded-full bg-accent/80" />
                              <span>{t(`landing.frontPage.resourcesList.${resource}`)}</span>
                            </li>
                          ))}
                        </ul>

                        {chapter.resourceLinks && chapter.resourceLinks.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {chapter.resourceLinks.map((resourceLink) => (
                              <a
                                key={resourceLink.url}
                                href={resolveHref(locale, resourceLink.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/8 px-3 py-2 text-sm font-medium text-primary-foreground transition hover:border-primary/35 hover:bg-primary/14"
                              >
                                {t(`landing.frontPage.linkLabels.${resourceLink.labelKey}`)}
                                <ExternalLink className="size-4" />
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </TerminalFrame>
          </motion.section>

          <footer className="mt-10 border-t border-primary/10 px-2 pt-6 text-sm text-muted-foreground">
            <p>{t('footer.attribution')}</p>
            <p className="mt-1">{t('footer.bookCredit')}</p>
          </footer>
        </div>
      </main>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
