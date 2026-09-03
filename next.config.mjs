import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/**
 * Cabeceras de seguridad. No había ninguna: la respuesta salía sin HSTS, sin
 * `X-Content-Type-Options`, sin `Referrer-Policy` y sin CSP, y encima anunciaba
 * `X-Powered-By: Next.js`.
 *
 * La CSP es la única con truco. `'unsafe-inline'` en `style-src` es inevitable
 * mientras haya `style={{...}}` en los componentes y Next inyecte su CSS así.
 * En `script-src`, `'unsafe-inline'` lo pide el arranque de Next (los scripts
 * de hidratación) y `'unsafe-eval'` SOLO el modo desarrollo; por eso la
 * directiva se arma distinta según el entorno y en producción no lo lleva.
 *
 * `worker-src blob:` es de MapLibre, que crea su worker desde un blob.
 * `img-src data:` lo necesitan las teselas y los sprites del mapa.
 * `connect-src` tiene que dejar salir a OpenFreeMap, que es de donde bajan.
 */
const dev = process.env.NODE_ENV !== 'production';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  // `next/font/google` descarga las fuentes EN EL BUILD y las sirve desde
  // `/_next/static/media`: no hay ni una petición a gstatic en el HTML
  // servido, así que la política no tiene por qué abrirles la puerta.
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://tiles.openfreemap.org",
  "connect-src 'self' https://tiles.openfreemap.org",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // Un año, con subdominios. Solo tiene efecto sobre HTTPS.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Igual que el sitio actual: artefacto autocontenido para el VPS (build local).
  output: 'standalone',
  reactStrictMode: true,
  // No anunciar el framework ni su versión.
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  /**
   * Redirecciones permanentes de rutas que dejaron de existir tras la junta
   * de sep 2026. Con y sin prefijo de idioma: sin él, el middleware de
   * next-intl añadiría el idioma y ENTONCES caería aquí, que son dos saltos.
   */
  async redirects() {
    return [
      // El portafolio Rx pasó a ser el índice de áreas terapéuticas.
      {
        source: '/portafolio',
        destination: '/es/areas-terapeuticas',
        permanent: true,
      },
      {
        source: '/:locale(es|en)/portafolio',
        destination: '/:locale/areas-terapeuticas',
        permanent: true,
      },
      // Fichas de producto: nunca llegaron a publicarse, pero si algún enlace
      // viejo las busca, que caiga en el índice de áreas y no en un 404.
      {
        source: '/:locale(es|en)/productos/:path*',
        destination: '/:locale/areas-terapeuticas',
        permanent: true,
      },
      // /medicos era un alta de perfil médico; eso vive en el portal.
      { source: '/medicos', destination: '/es/proximamente', permanent: true },
      {
        source: '/:locale(es|en)/medicos',
        destination: '/:locale/proximamente',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
