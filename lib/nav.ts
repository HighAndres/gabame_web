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
 * Ningún enlace del menú se deja muerto entre commits.
 */
export const NAV: NavItem[] = [
  { key: 'inicio', href: '/' },
  { key: 'nosotros', href: '/nosotros' },
  { key: 'areas', href: '/areas-terapeuticas' },
  { key: 'promociones', href: '/promociones' },
  { key: 'farmacovigilancia', href: '/farmacovigilancia' },
  { key: 'contacto', href: '/contacto' },
];

/**
 * Los dos botones secundarios de la cabecera. Cada uno tiene su puerta en el
 * portal (`PORTAL`), que no es la misma: el botón ya dice a quién atiende.
 */
export const PORTAL_CTAS = [
  { key: 'areaMedica', destino: 'medicos' },
  { key: 'portalClientes', destino: 'clientes' },
] as const satisfies readonly { key: string; destino: PortalDestino }[];

/** Rutas reales (sin anclas) — para sitemap y comprobaciones. */
export const ROUTES: readonly string[] = [
  '/',
  '/nosotros',
  '/areas-terapeuticas',
  ...AREA_ORDER.map((slug) => `/areas-terapeuticas/${slug}`),
  '/areas-terapeuticas/oftalmologia/healthy-eyes',
  '/promociones',
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
 * Portal de GABAME. ÚNICO sitio donde se cambia: todos los CTAs pasan por
 * `PortalLink`, que lee estas constantes.
 *
 * Son DOS destinos distintos, no uno: el portal no reparte por su cuenta según
 * quién entra, cada público tiene su puerta. `?origen=gabame` es lo que le
 * dice al portal que la visita llegó desde este sitio; va en la URL, no en el
 * código, así que no hay nada que mantener aquí cuando cambie.
 *
 * `PortalLink` mira si la URL sale del sitio: externa → `<a>` a pestaña nueva;
 * interna → `Link` con prefijo de idioma. Por eso volver a `/proximamente` —si
 * el portal se cae o aún no atiende a un público— es cambiar la cadena y ya.
 *
 * ⚠ ES EL PREVIEW (`clientesgabame.mirmiapps.com`), igual que
 * `EXTERNAL.farmacias`. Sustituir por el dominio definitivo al publicar.
 *
 * El dominio importa más de lo que parece: estuvo un rato apuntando a
 * `clientes.gabame.com`, que NO RESUELVE, y los siete botones del sitio
 * llevaban a un error de DNS sin que nada en el sitio lo delatara. Al cambiar
 * esta constante, comprobar que el destino responde ANTES de desplegar.
 */
export const PORTAL = {
  /** Profesionales de la salud. CTAs «Área médica» e «Información para
      profesionales de la salud». */
  medicos: 'https://clientesgabame.mirmiapps.com/medicos?origen=gabame',
  /** Clientes y distribuidores. CTA «Portal de clientes». */
  clientes: 'https://clientesgabame.mirmiapps.com/clientes?origen=gabame',
} as const;

export type PortalDestino = keyof typeof PORTAL;

/** ¿Sale del sitio? Decide entre `Link` con idioma y `<a>` externo. */
export const isExternal = (href: string) => /^https?:\/\//i.test(href);
