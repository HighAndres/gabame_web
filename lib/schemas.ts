import { z } from 'zod';

/** Perfiles del formulario de contacto (segmentan la solicitud entrante). */
export const PROFILES = [
  'hcp',
  'distributor',
  'partner',
  'institution',
] as const;

/** Quién notifica una sospecha de reacción adversa. */
export const REPORTER_TYPES = ['paciente', 'profesional', 'otro'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  org: z.string().trim().max(160).optional().or(z.literal('')),
  profile: z.enum(PROFILES).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
  /** Trampa anti-spam: si viene con contenido, es un bot. */
  website: z.string().max(0).optional(),
});

export const pvSchema = z.object({
  reporterName: z.string().trim().min(2).max(120),
  reporterEmail: z.string().trim().email().max(160),
  reporterPhone: z.string().trim().max(40).optional().or(z.literal('')),
  reporterType: z.enum(REPORTER_TYPES),
  product: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(6000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type PvInput = z.infer<typeof pvSchema>;
