/**
 * Las seis áreas terapéuticas: la vitrina pública del sitio (junta sep 2026).
 *
 * Aquí va la ESTRUCTURA (slug, icono, marcas); el copy vive en
 * `i18n/messages/*.json` bajo `areas.list.<slug>` porque es bilingüe.
 *
 * REGULATORIO (COFEPRIS): en rutas públicas no se publica ningún dato clínico
 * —principios activos, dosis, eficacia, comparativos—. De cada marca se puede
 * enseñar SOLO EL NOMBRE, y solo con `NEXT_PUBLIC_SHOW_BRAND_NAMES=true`
 * (ver `lib/flags.ts`). La ficha para profesionales vive en el portal.
 */

import type { LucideIcon } from 'lucide-react';
import { Brain, Droplets, Eye, HeartPulse, Hospital, Ribbon } from 'lucide-react';

export type AreaSlug =
  | 'cardiometabolico'
  | 'oncologia'
  | 'hospitalario'
  | 'urologia'
  | 'snc'
  | 'oftalmologia';

export type Area = {
  slug: AreaSlug;
  icon: LucideIcon;
  /**
   * Marcas del área, SOLO por nombre. Vacío hasta que el cliente entregue la
   * lista aprobada: [PENDIENTE: nombres de marca aprobados por GABAME].
   */
  brands: string[];
};

/** Orden canónico: el de la Home, el índice y el sitemap. */
export const AREAS: Area[] = [
  { slug: 'cardiometabolico', icon: HeartPulse, brands: [] },
  { slug: 'oncologia', icon: Ribbon, brands: [] },
  { slug: 'hospitalario', icon: Hospital, brands: [] },
  { slug: 'urologia', icon: Droplets, brands: [] },
  { slug: 'snc', icon: Brain, brands: [] },
  /* Healthy Eyes es dispositivo médico: el único producto con página pública. */
  { slug: 'oftalmologia', icon: Eye, brands: ['Healthy Eyes'] },
];

export const AREA_ORDER: AreaSlug[] = AREAS.map((a) => a.slug);

export function areaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}
