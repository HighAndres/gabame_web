import type { Metadata } from 'next';
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

/** Nombre del sitio, tal y como debe salir en las tarjetas al compartir. */
export const SITE_NAME = 'GABAME Human Health';

/**
 * Imagen de las tarjetas al compartir. 1200×630, que es la proporción que
 * piden WhatsApp, LinkedIn, Facebook y X.
 *
 * El archivo llevaba en `public/media/` desde el principio SIN QUE NADIE LO
 * USARA: no había ni un solo `meta property="og:*"` en el sitio, así que cada
 * enlace compartido salía en gris, sin imagen ni título.
 */
const OG_IMAGE = {
  url: '/media/og.png',
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Mapa de `locale` a la etiqueta que quieren Facebook y compañía. */
const OG_LOCALE: Record<string, string> = {
  es: 'es_MX',
  en: 'en_US',
};

/**
 * Metadatos comunes de una página: canonical, hreflang, Open Graph y Twitter.
 *
 * Se pasa el título YA COMPUESTO porque `title.template` del layout solo actúa
 * sobre `<title>`; `og:title` no lo hereda y saldría a medias.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const clean = path.replace(/^\/+/, '');
  const url = `${SITE_URL}/${locale}${clean ? `/${clean}` : ''}`;

  return {
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? locale,
      url,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
