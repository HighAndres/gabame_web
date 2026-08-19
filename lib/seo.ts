import { routing } from '@/i18n/routing';

/** Dominio del sitio. En build se fija con NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3010';

/** Canonical + hreflang para una ruta dada (sin prefijo de idioma). */
export function buildAlternates(locale: string, path = '') {
  const clean = path.replace(/^\/+/, '');
  const suffix = clean ? `/${clean}` : '';

  return {
    canonical: `${SITE_URL}/${locale}${suffix}`,
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${suffix}`]),
    ),
  };
}
