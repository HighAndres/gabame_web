/**
 * Contenido del AVISO DE PRIVACIDAD, editable y por idioma.
 *
 * ESTADO: PLACEHOLDER. El texto legal definitivo está PENDIENTE de entrega y
 * validación por el cliente (LFPDPPP / su área legal). Aquí queda la estructura
 * lista: cuando llegue el texto aprobado, se rellena `body` de cada sección y se
 * pone `pending: false` (el modal deja de mostrar el aviso de "texto preliminar").
 *
 * Los datos del Responsable (nombre, domicilio, correo) son reales y ya
 * conocidos; el resto de secciones espera redacción legal.
 */

export interface LegalSection {
  heading: string;
  /** Párrafos de la sección. Vacío/placeholder mientras esté pendiente. */
  body: string[];
}

export interface PrivacyNotice {
  title: string;
  /** Fecha de última actualización (ISO o legible). `null` mientras pendiente. */
  updated: string | null;
  intro: string;
  sections: LegalSection[];
  /** `true` => el modal muestra el aviso de "texto preliminar / pendiente". */
  pending: boolean;
}

const PENDING_ES = '[Contenido pendiente de redacción y validación legal.]';
const PENDING_EN = '[Content pending legal drafting and validation.]';

export const privacyNotice: Record<'es' | 'en', PrivacyNotice> = {
  es: {
    title: 'Aviso de privacidad',
    updated: null,
    intro:
      'En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), ponemos a tu disposición este aviso de privacidad.',
    pending: true,
    sections: [
      {
        heading: 'Responsable',
        body: [
          'GABAME Human Health, con domicilio en Av. de la Palma 8, primer piso, Villa de las Palmas, CP 52787, Huixquilucan, Estado de México, es responsable del tratamiento de tus datos personales.',
          'Contacto para asuntos de privacidad: contacto@gabame.com.',
        ],
      },
      { heading: 'Datos personales que recabamos', body: [PENDING_ES] },
      { heading: 'Finalidades del tratamiento', body: [PENDING_ES] },
      { heading: 'Transferencias de datos', body: [PENDING_ES] },
      { heading: 'Derechos ARCO', body: [PENDING_ES] },
      { heading: 'Medios para ejercer tus derechos', body: [PENDING_ES] },
      { heading: 'Uso de cookies y tecnologías de rastreo', body: [PENDING_ES] },
      { heading: 'Cambios al aviso de privacidad', body: [PENDING_ES] },
    ],
  },
  en: {
    title: 'Privacy notice',
    updated: null,
    intro:
      'In compliance with Mexico’s Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP), we make this privacy notice available to you.',
    pending: true,
    sections: [
      {
        heading: 'Data controller',
        body: [
          'GABAME Human Health, with address at Av. de la Palma 8, first floor, Villa de las Palmas, CP 52787, Huixquilucan, State of Mexico, is responsible for the processing of your personal data.',
          'Privacy contact: contacto@gabame.com.',
        ],
      },
      { heading: 'Personal data we collect', body: [PENDING_EN] },
      { heading: 'Purposes of processing', body: [PENDING_EN] },
      { heading: 'Data transfers', body: [PENDING_EN] },
      { heading: 'ARCO rights', body: [PENDING_EN] },
      { heading: 'How to exercise your rights', body: [PENDING_EN] },
      { heading: 'Use of cookies and tracking technologies', body: [PENDING_EN] },
      { heading: 'Changes to this privacy notice', body: [PENDING_EN] },
    ],
  },
};
