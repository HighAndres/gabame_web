import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ROUTES } from '@/lib/nav';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route === '/' ? '' : route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${SITE_URL}/${l}${route === '/' ? '' : route}`,
          ]),
        ),
      },
    })),
  );
}
