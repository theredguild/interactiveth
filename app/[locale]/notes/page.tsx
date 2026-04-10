import { readdir } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BookText, FileText } from 'lucide-react';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const NOTES_DIRECTORY = path.join(process.cwd(), 'notes', 'chapters');

export default async function NotesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('notesPage');
  const tChapters = await getTranslations('landing.frontPage.chapters');

  const files = await readdir(NOTES_DIRECTORY).catch(() => [] as string[]);
  const slugs = files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();

  return (
    <TutorialLayout>
      <div className="min-h-screen pb-16">
        <section className="relative overflow-hidden rounded-[36px] border border-primary/16 bg-card/45 px-6 py-12 shadow-[0_0_0_1px_rgba(164,114,255,0.05)] backdrop-blur-sm sm:px-8 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(164,114,255,0.14),transparent_36%),linear-gradient(180deg,rgba(12,11,20,0.4),transparent)]" />
          <div className="relative mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.34em] text-primary/80">
              <BookText className="size-3.5" />
              {t('badge')}
            </div>
            <h1 className="mt-6 font-mono text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl rounded-[32px] border border-border bg-card px-6 py-7 shadow-[0_12px_50px_rgba(0,0,0,0.2)] sm:mt-12 sm:px-8 sm:py-9">
          <div className="flex flex-col gap-2">
            {slugs.map((slug) => {
              const chapterMatch = slug.match(/chapter-(\d+)/);
              const chapterNumber = chapterMatch ? chapterMatch[1] : null;
              const chapterKey = slug as string;
              let label = slug;
              let subtitle: string | null = null;
              try {
                label = tChapters(`${chapterKey}.title`);
                subtitle = tChapters(`${chapterKey}.name`);
              } catch {
                // no translation for this slug
              }

              return (
                <Link
                  key={slug}
                  href={`/${locale}/notes/${slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/8 px-4 py-3.5 transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      {subtitle && (
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  {chapterNumber && (
                    <span className="font-mono text-xs text-muted-foreground/50">
                      ch.{chapterNumber}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </TutorialLayout>
  );
}
