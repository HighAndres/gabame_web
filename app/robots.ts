import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // En construcción: no indexar. Al publicar en gabame.com, cambiar a allow.
  return {
    rules: { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
