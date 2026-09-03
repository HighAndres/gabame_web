/** Rutas del sitio. Fuente única para cabecera, pie y sitemap. */

import { AREA_ORDER } from '@/content/areas';

export type NavItem = {
  /** Clave en `nav` del diccionario i18n. */
  key: string;
  /** Ruta sin prefijo de idioma; el `Link` de next-intl lo añade. */
  href: string;
  /** true = ancla dentro de la Home. */
  anchor?: boolean;
};

/**
 * Menú acordado en la junta (sep 2026):
 * Inicio · Nosotros · Áreas terapéuticas · Promociones · Farmacovigilancia ·
 * Contacto, más los dos CTAs al portal (`PORTAL_CTAS`) y el idioma.
 *
 * Promociones entra con su página; ningún enlace del menú se deja muerto.
 */
export const NAV: NavItem[] = [
  { key: 'inicio', href: '/' },
  { key: 'nosotros', href: '/nosotros' },
  { key: 'areas', href: '/areas-terapeuticas' },
  { key: 'farmacovigilancia', href: '/farmacovigilancia' },
  { key: 'contacto', href: '/contacto' },
];

/**
 * Los dos botones secundarios de la cabecera. Los dos van a `PORTAL_URL`:
 * el portal decide, por su cuenta, qué ve un médico y qué ve un cliente.
 */
export const PORTAL_CTAS = [
  { key: 'areaMedica' },
  { key: 'portalClientes' },
] as const;

/** Rutas reales (sin anclas) — para sitemap y comprobaciones. */
export const ROUTES: readonly string[] = [
  '/',
  '/nosotros',
  '/areas-terapeuticas',
  ...AREA_ORDER.map((slug) => `/areas-terapeuticas/${slug}`),
  '/farmacovigilancia',
  '/contacto',
  '/aviso-de-privacidad',
];

/** Datos de contacto, en un solo lugar. */
export const CONTACT = {
  phone: '55 5548 7579',
  phoneHref: '+525555487579',
  email: 'contacto@gabame.com',
  pvEmail: 'farmacovigilancia@gabame.com',
  linkedin: 'https://www.linkedin.com/company/gabame-human-health',
  /**
   * Pin del mapa del pie. [longitud, latitud], como lo pide MapLibre.
   *
   * ⚠ PROVISIONAL. El número «Av. de la Palma 8» no está geocodificado en
   * OpenStreetMap; esto es el centro de la zona (Hacienda de las Palmas /
   * Interlomas). Sustituir por las coordenadas exactas del cliente antes de
   * publicar: en Google Maps, clic derecho sobre el edificio → primera línea.
   */
  map: {
    center: [-99.2865, 19.3925] as [number, number],
    zoom: 15,
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Av.+de+la+Palma+8,+Villa+de+las+Palmas,+52787+Huixquilucan,+M%C3%A9x.',
  },
} as const;

/**
 * Propiedades del grupo que viven FUERA de este sitio. Van aparte de `NAV`
 * porque no son rutas de Next: no llevan prefijo de idioma, no entran en el
 * sitemap y se abren en pestaña nueva.
 *
 * ⚠ `farmacias` apunta hoy al preview (`farmaciasgabame.mirmiapps.com`, tras
 * autenticación básica). Sustituir por el dominio definitivo al publicar.
 */
export const EXTERNAL = {
  farmacias: 'https://farmaciasgabame.mirmiapps.com',
} as const;

/**
 * Portal de GABAME (área médica y portal de clientes). ÚNICO sitio donde se
 * cambia: todos los CTAs «Área médica» y «Portal de clientes» pasan por
 * `PortalLink`, que lee esta constante.
 *
 * Mientras el portal no exista apunta a `/proximamente`, dentro del sitio.
 * El día que exista, sustituir por `PORTAL_URL_DEFINITIVA` y nada más:
 * `PortalLink` detecta que es externa y la abre en pestaña nueva.
 */
export const PORTAL_URL_DEFINITIVA = 'https://portal.gabame.com/?m=gabame';
export const PORTAL_URL: string = '/proximamente';

/** ¿Sale del sitio? Decide entre `Link` con idioma y `<a>` externo. */
export const isExternal = (href: string) => /^https?:\/\//i.test(href);
