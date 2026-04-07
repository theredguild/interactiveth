import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { marked, type Token, type Tokens } from 'marked';
import { getTranslations } from 'next-intl/server';
import { AlertCircle, BookText, FileText } from 'lucide-react';
import { TutorialLayout } from '@/components/layout/tutorial-layout';

const NOTES_DIRECTORY = path.join(process.cwd(), 'notes', 'chapters');
const TRANSLATED_NOTES_DIRECTORY = path.join(process.cwd(), 'notes', 'translations');

function isSafeSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug);
}

function getTokenKey(token: { type: string; raw?: string; text?: string }, fallback: string) {
  return `${token.type}-${token.raw ?? token.text ?? fallback}`;
}

function createSiblingKeyFactory(scope: string) {
  const seen = new Map<string, number>();

  return (signature: string) => {
    const count = seen.get(signature) ?? 0;
    seen.set(signature, count + 1);
    return `${scope}-${signature}-${count}`;
  };
}

function renderInlineTokens(tokens: Token[] = []): ReactNode {
  const getSiblingKey = createSiblingKeyFactory('inline');

  return tokens.map((token) => {
    const key = getSiblingKey(getTokenKey(token, 'inline'));

    switch (token.type) {
      case 'text':
      case 'escape':
        return <span key={key}>{token.text}</span>;
      case 'strong':
        return <strong key={key}>{renderInlineTokens(token.tokens)}</strong>;
      case 'em':
        return <em key={key}>{renderInlineTokens(token.tokens)}</em>;
      case 'codespan':
        return <code key={key}>{token.text}</code>;
      case 'del':
        return <del key={key}>{renderInlineTokens(token.tokens)}</del>;
      case 'br':
        return <br key={key} />;
      case 'link':
        return (
          <a key={key} href={token.href} target="_blank" rel="noopener noreferrer">
            {renderInlineTokens(token.tokens)}
          </a>
        );
      default:
        return 'text' in token ? <span key={key}>{token.text}</span> : null;
    }
  });
}

function renderBlockTokens(tokens: Token[] = []): ReactNode {
  const getSiblingKey = createSiblingKeyFactory('block');

  return tokens.map((token) => {
    const key = getSiblingKey(getTokenKey(token, 'block'));

    switch (token.type) {
      case 'space':
        return null;
      case 'heading': {
        switch (token.depth) {
          case 1:
            return <h1 key={key}>{renderInlineTokens(token.tokens)}</h1>;
          case 2:
            return <h2 key={key}>{renderInlineTokens(token.tokens)}</h2>;
          case 3:
            return <h3 key={key}>{renderInlineTokens(token.tokens)}</h3>;
          case 4:
            return <h4 key={key}>{renderInlineTokens(token.tokens)}</h4>;
          case 5:
            return <h5 key={key}>{renderInlineTokens(token.tokens)}</h5>;
          default:
            return <h6 key={key}>{renderInlineTokens(token.tokens)}</h6>;
        }
      }
      case 'paragraph':
        return <p key={key}>{renderInlineTokens(token.tokens)}</p>;
      case 'blockquote':
        return <blockquote key={key}>{renderBlockTokens(token.tokens)}</blockquote>;
      case 'hr':
        return <hr key={key} />;
      case 'code':
        return (
          <pre key={key}>
            <code>{token.text}</code>
          </pre>
        );
      case 'list': {
        const ListTag = token.ordered ? 'ol' : 'ul';
        const getItemKey = createSiblingKeyFactory(`${key}-item`);

        return (
          <ListTag key={key}>
            {token.items.map((item: Tokens.ListItem) => (
              <li key={getItemKey(getTokenKey(item, `${key}-item`))}>{renderBlockTokens(item.tokens)}</li>
            ))}
          </ListTag>
        );
      }
      case 'table':
        {
          const getHeaderKey = createSiblingKeyFactory(`${key}-header`);
          const getRowKey = createSiblingKeyFactory(`${key}-row`);

        return (
          <table key={key}>
            <thead>
              <tr>
                {token.header.map((cell: Tokens.TableCell) => (
                  <th key={getHeaderKey(cell.text)}>{renderInlineTokens(cell.tokens)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {token.rows.map((row: Tokens.TableCell[]) => {
                const rowKey = getRowKey(row.map((cell) => cell.text).join('|'));
                const getCellKey = createSiblingKeyFactory(`${rowKey}-cell`);

                return (
                <tr key={rowKey}>
                  {row.map((cell: Tokens.TableCell) => (
                    <td key={getCellKey(cell.text)}>
                      {renderInlineTokens(cell.tokens)}
                    </td>
                  ))}
                </tr>
              )})}
            </tbody>
          </table>
        );
      }
      case 'text':
        return token.tokens ? <p key={key}>{renderInlineTokens(token.tokens)}</p> : <p key={key}>{token.text}</p>;
      default:
        return null;
    }
  });
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isSafeSlug(slug)) {
    notFound();
  }

  let markdown: string;

  try {
    const translatedFilePath = path.join(TRANSLATED_NOTES_DIRECTORY, locale, `${slug}.md`);
    const originalFilePath = path.join(NOTES_DIRECTORY, `${slug}.md`);

    markdown =
      locale === 'en'
        ? await readFile(translatedFilePath, 'utf8')
        : await readFile(originalFilePath, 'utf8');
  } catch {
    notFound();
  }

  const t = await getTranslations('notesPage');
  const tokens = marked.lexer(markdown, {
    gfm: true,
    breaks: true,
  });

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

            {locale === 'en' ? (
              <div className="mt-8 rounded-2xl border border-warning/30 bg-warning/10 p-5 text-sm text-foreground sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
                  <div>
                    <p className="font-medium leading-7 text-warning">{t('translationNotice')}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl rounded-[32px] border border-border bg-card px-6 py-7 shadow-[0_12px_50px_rgba(0,0,0,0.2)] sm:mt-12 sm:px-8 sm:py-9">
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4 text-primary" />
            <span>{slug}.md</span>
          </div>

          <article className="markdown-content">{renderBlockTokens(tokens)}</article>
        </section>
      </div>
    </TutorialLayout>
  );
}
