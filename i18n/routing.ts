import { defineRouting } from 'next-intl/routing';

/**
 * Ruteo bilingüe indexable: /es/… y /en/…
 * `localePrefix: 'always'` garantiza URLs limpias por idioma para SEO/hreflang.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
