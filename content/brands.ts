/**
 * Las cuatro marcas del grupo, en el orden en que se enseñan (Home →
 * Ecosistema y /nosotros). GABAME es este sitio y no enlaza; las otras tres
 * enlazan al suyo (sep 2026).
 *
 * Mismo patrón que `HEALTHY_EYES_IMAGE`: cada marca lleva su logotipo o
 * `null`. Con `null` la tarjeta pinta la trama de «todavía no» con el
 * ordinal; al poner aquí la ruta del archivo, el logotipo entra solo en las
 * dos páginas sin tocar componentes.
 *
 * Formato de los logotipos: PNG o SVG con fondo TRANSPARENTE y recortado a
 * su caja (el margen lo pone el CSS). Se pintan A COLOR, tal cual los
 * entregó cada marca (ver `.eco-logo` en `globals.css`).
 */

import { mediaLibrary } from '@/content/media';

export type GroupBrand = {
  name: string;
  /** `true` solo en GABAME: es la marca de este sitio. */
  active: boolean;
  /** Sin logotipo = placeholder (trama + ordinal). */
  logo: { src: string; alt: string } | null;
  /**
   * Sitio de la marca: la tarjeta entera es un enlace externo en pestaña
   * nueva con «Visitar sitio». Sin `url` (GABAME, la anfitriona) la tarjeta
   * es una caja con símbolo y nombre, sin etiqueta.
   */
  url?: string;
};

export const GROUP_BRANDS: readonly GroupBrand[] = [
  {
    name: 'GABAME',
    active: true,
    /* Sin `url`: es este sitio, enlazarlo sería redundante. */
    logo: { src: mediaLibrary.mark.src, alt: mediaLibrary.mark.alt },
  },
  {
    name: 'Medinter',
    active: false,
    /* ⚠ El único archivo entregado mide 213×40: se ve blando en pantallas
       de alta densidad. [PENDIENTE: MedInter en alta resolución o SVG] */
    logo: { src: '/media/logo_medinter.png', alt: 'MedInter' },
    url: 'https://mirmiapps.com/medinter/',
  },
  {
    name: 'Ordan',
    active: false,
    logo: { src: '/media/logo_ordan.png', alt: 'Ordan Health & Beauty' },
    url: 'https://mirmiapps.com/ordan/',
  },
  {
    name: 'A7',
    active: false,
    logo: { src: '/media/logo_a7.png', alt: 'A7 Pharmaceutical Distributor' },
    url: 'https://mirmiapps.com/a7/',
  },
];
