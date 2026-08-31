/** Rutas y anclas del sitio. Fuente única para cabecera, pie y sitemap. */

export type NavItem = {
  /** Clave en `nav` del diccionario i18n. */
  key: string;
  /** Ruta sin prefijo de idioma; el `Link` de next-intl lo añade. */
  href: string;
  /** true = ancla dentro de la Home. */
  anchor?: boolean;
};

export const NAV: NavItem[] = [
  { key: 'inicio', href: '/' },
  { key: 'areas', href: '/#areas', anchor: true },
  { key: 'portafolio', href: '/portafolio' },
  { key: 'medicos', href: '/medicos' },
  { key: 'nosotros', href: '/nosotros' },
  { key: 'ecosistema', href: '/#ecosistema', anchor: true },
  { key: 'socios', href: '/#socios', anchor: true },
  { key: 'contacto', href: '/contacto' },
];

/** Rutas reales (sin anclas) — para sitemap y comprobaciones. */
export const ROUTES = [
  '/',
  '/portafolio',
  '/medicos',
  '/nosotros',
  '/farmacovigilancia',
  '/contacto',
] as const;

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
