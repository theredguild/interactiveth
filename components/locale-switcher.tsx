'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    startTransition(() => {
      const segments = pathname.split('/');
      segments[1] = newLocale;
      router.replace(segments.join('/'));
    });
  };

  return (
    <select
      value={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
