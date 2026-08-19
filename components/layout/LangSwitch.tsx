'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * Conmuta ES↔EN conservando la ruta actual.
 * El idioma vive en la URL (`/es`, `/en`), así que no hace falta persistirlo:
 * la propia ruta es el estado, y `<html lang>` lo fija el layout.
 */
export function LangSwitch() {
  const locale = useLocale();
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <button
      type="button"
      className="lang-switch"
      lang={other}
      aria-label={`${t('label')}: ${other === 'es' ? t('esLong') : t('enLong')}`}
      onClick={() => {
        router.replace(
          // @ts-expect-error -- params dinámicos de la ruta actual
          { pathname, params },
          { locale: other },
        );
      }}
    >
      {other.toUpperCase()}
    </button>
  );
}
