import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(164,114,255,0.18),transparent_28%),linear-gradient(180deg,rgba(12,11,20,0.96),rgba(9,9,16,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(164,114,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
          {t('code')}
        </p>
        <h1 className="font-mono text-4xl font-semibold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/70 hover:bg-primary/20"
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
