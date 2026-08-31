import { z } from 'zod';

/**
 * Mínimos y máximos de los campos, EN UN SOLO SITIO.
 *
 * Los formularios del cliente los importan para validar con las mismas cifras
 * que el servidor. Antes no coincidían: el cliente solo pedía «no vacío» y el
 * servidor `min(2)` para el nombre y `min(10)` para el mensaje, así que un
 * nombre de una letra pasaba la validación en línea, el servidor devolvía 400
 * y el formulario enseñaba el error genérico en vez de señalar el campo.
 *
 * Aquí no se importa zod al cliente: solo estos números.
 */
export const LIMITES = {
  name: { min: 2, max: 120 },
  email: { max: 160 },
  org: { max: 160 },
  message: { min: 10, max: 4000 },
  product: { min: 2, max: 160 },
  description: { min: 10, max: 6000 },
  phone: { max: 40 },
  specialty: { min: 2, max: 120 },
  comment: { max: 2000 },
} as const;

/** Correo, con la misma forma en cliente y servidor. */
export const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Cédula profesional mexicana: 7 u 8 dígitos, se admite con espacios. */
export const RE_CEDULA = /^\d{7,8}$/;

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
  name: z.string().trim().min(LIMITES.name.min).max(LIMITES.name.max),
  email: z.string().trim().email().max(LIMITES.email.max),
  org: z.string().trim().max(LIMITES.org.max).optional().or(z.literal('')),
  profile: z.enum(PROFILES).optional().or(z.literal('')),
  message: z.string().trim().min(LIMITES.message.min).max(LIMITES.message.max),
  /** Trampa anti-spam: si viene con contenido, es un bot. */
  website: z.string().max(0).optional(),
});

export const pvSchema = z.object({
  reporterName: z.string().trim().min(LIMITES.name.min).max(LIMITES.name.max),
  reporterEmail: z.string().trim().email().max(LIMITES.email.max),
  reporterPhone: z
    .string()
    .trim()
    .max(LIMITES.phone.max)
    .optional()
    .or(z.literal('')),
  reporterType: z.enum(REPORTER_TYPES),
  product: z.string().trim().min(LIMITES.product.min).max(LIMITES.product.max),
  description: z
    .string()
    .trim()
    .min(LIMITES.description.min)
    .max(LIMITES.description.max),
  website: z.string().max(0).optional(),
});

/**
 * Alta de perfil médico (/medicos). El sitio no tiene base de datos por
 * diseño: el «perfil» viaja por el mismo canal server-side que los leads y
 * el equipo valida la cédula a mano antes de dar de alta.
 */
export const medicoSchema = z.object({
  name: z.string().trim().min(LIMITES.name.min).max(LIMITES.name.max),
  email: z.string().trim().email().max(LIMITES.email.max),
  phone: z.string().trim().max(LIMITES.phone.max).optional().or(z.literal('')),
  cedula: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, ''))
    .pipe(z.string().regex(RE_CEDULA)),
  specialty: z
    .string()
    .trim()
    .min(LIMITES.specialty.min)
    .max(LIMITES.specialty.max),
  institution: z
    .string()
    .trim()
    .max(LIMITES.org.max)
    .optional()
    .or(z.literal('')),
  comment: z
    .string()
    .trim()
    .max(LIMITES.comment.max)
    .optional()
    .or(z.literal('')),
  /** Trampa anti-spam: si viene con contenido, es un bot. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type PvInput = z.infer<typeof pvSchema>;
export type MedicoInput = z.infer<typeof medicoSchema>;
