/**
 * Healthy Eyes — dispositivo médico, el ÚNICO producto con página pública.
 *
 * Aquí va la estructura que no es texto (dónde encontrarlo, imagen). El copy
 * es bilingüe y vive en `i18n/messages/*.json` bajo `healthyEyes`, TODO él
 * marcado [SUJETO A VALIDACIÓN REGULATORIA] hasta que lo apruebe GABAME.
 *
 * REGULATORIO: enfoque conservador. Sin claims de eficacia, cifras,
 * comparativos ni eslóganes; sin precios. «Dónde encontrarlo» son enlaces a
 * farmacias, nada más.
 */

import { EXTERNAL } from '@/lib/nav';

export const HEALTHY_EYES_PATH = '/areas-terapeuticas/oftalmologia/healthy-eyes';

export type Retailer = {
  name: string;
  /** Sin URL = placeholder a la espera del enlace de la cadena. */
  url?: string;
};

/** Puntos de venta. [PENDIENTE: cadenas y enlaces confirmados por GABAME] */
export const WHERE_TO_FIND: Retailer[] = [
  { name: 'Farmacias GABAME', url: EXTERNAL.farmacias },
  { name: '[PENDIENTE: cadena participante]' },
  { name: '[PENDIENTE: cadena participante]' },
];

/**
 * Imagen del producto. Hoy NO hay foto entregada: el sitio pinta el marco de
 * media vacío del sistema (trama diagonal) con el icono del área. Al llegar
 * la foto, poner aquí su ruta y `HealthyEyesVisual` la usa sola.
 * [PENDIENTE: fotografía de presentación de Healthy Eyes, aprobada]
 */
export const HEALTHY_EYES_IMAGE: { src: string; alt: string } | null = null;
