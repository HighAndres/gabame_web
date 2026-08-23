'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CONTACT } from '@/lib/nav';
import { LIMITES, RE_EMAIL } from '@/lib/schemas';

type Status =
  | 'idle'
  | 'sending'
  | 'sent'
  /** Guardado en el servidor, pero SIN entregar: ver `stored` en la ruta. */
  | 'stored'
  | 'error'
  | 'notConfigured'
  | 'rateLimit';
type Campo = 'reporterName' | 'reporterEmail' | 'product' | 'description';
type FieldErrors = Partial<Record<Campo, string>>;

/**
 * Reporte de sospecha de reacción adversa. Canal separado del comercial.
 *
 * Mismo patrón que el formulario de contacto —tarjeta, campos emparejados,
 * validación en línea antes de tocar el servidor, botón a todo el ancho— para
 * que los dos formularios del sitio se lean como la misma pieza.
 *
 * Los mensajes de error por campo ya estaban en `i18n` (`invalidName`,
 * `invalidEmail`, `invalidProduct`, `invalidDescription`) pero nadie los usaba:
 * el formulario dependía de los globos del navegador, que no se pueden estilar
 * y salen en el idioma del sistema operativo, no en el del sitio.
 */
export function PvForm() {
  const t = useTranslations('farmacovigilancia.form');
  const tPv = useTranslations('farmacovigilancia');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  /** Lo último que se envió, para poder rearmarlo como correo si hace falta. */
  const [enviado, setEnviado] = useState<Record<string, string> | null>(null);
  /** Hora de recepción que devuelve el servidor: es el acuse del notificador. */
  const [acuse, setAcuse] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);

/**
 * Tras responder el servidor, EL FOCO VA AL AVISO. Al pasar a «enviado» el
 * formulario entero se sustituye por el mensaje, y con él desaparece el botón
 * que el usuario tenía enfocado: el foco caía en el `body` y quien navega con
 * teclado volvía al principio del documento sin saber qué había pasado. Los
 * errores POR CAMPO no entran aquí —esos ya llevan el foco al primer campo con
 * problema, que es más útil que el aviso general—.
 */
  const aviso = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const respondioElServidor =
      status === 'sent' ||
      status === 'stored' ||
      status === 'notConfigured' ||
      status === 'rateLimit' ||
      (status === 'error' && Object.keys(errors).length === 0);
    if (respondioElServidor) aviso.current?.focus();
  }, [status, errors]);

  /**
   * Las mismas cifras que el servidor (`LIMITES` en `lib/schemas.ts`). Un
   * reporte de farmacovigilancia con tres letras no sirve para nada, y si el
   * cliente lo deja pasar el servidor devuelve un 400 que aquí solo se puede
   * enseñar como error genérico.
   */
  function validate(d: Record<string, string>) {
    const e: FieldErrors = {};
    if ((d.reporterName ?? '').trim().length < LIMITES.name.min) {
      e.reporterName = t('invalidName');
    }
    if (!RE_EMAIL.test((d.reporterEmail ?? '').trim())) {
      e.reporterEmail = t('invalidEmail');
    }
    if ((d.product ?? '').trim().length < LIMITES.product.min) {
      e.product = t('invalidProduct');
    }
    if ((d.description ?? '').trim().length < LIMITES.description.min) {
      e.description = t('invalidDescription');
    }
    return e;
  }

  /**
   * Correo de respaldo YA ESCRITO.
   *
   * Cuando el envío automático no sale, la salida era un `mailto:` vacío: el
   * notificador tenía que volver a redactar la sospecha entera. Aquí se abre
   * con todo lo que acaba de escribir, que es la diferencia entre reenviarlo
   * de un toque y no reenviarlo.
   *
   * La descripción se recorta a 1.500 caracteres porque los `mailto:` largos
   * los cortan algunos clientes de correo, y un recorte silencioso en un
   * reporte de RAM sería peor que el aviso: cuando pasa, el propio cuerpo lo
   * dice y el formulario sigue en pantalla con el texto completo.
   */
  const TOPE_DESCRIPCION = 1500;

  function correoDeRespaldo(d: Record<string, string>) {
    const desc = d.description ?? '';
    const recortada = desc.length > TOPE_DESCRIPCION;
    const cuerpo = [
      t('mailIntro'),
      '',
      `${t('reporterName')}: ${d.reporterName} (${d.reporterType})`,
      `${t('reporterEmail')}: ${d.reporterEmail}`,
      `${t('reporterPhone')}: ${d.reporterPhone || '—'}`,
      `${t('product')}: ${d.product}`,
      '',
      `${t('mailDescription')}:`,
      recortada ? desc.slice(0, TOPE_DESCRIPCION) + ' […]' : desc,
      ...(recortada ? ['', t('mailTruncated')] : []),
    ].join('\n');

    const asunto = t('mailSubject', { producto: d.product });
    return `mailto:${CONTACT.pvEmail}?subject=${encodeURIComponent(
      asunto,
    )}&body=${encodeURIComponent(cuerpo)}`;
  }

  /** Al fallar, el foco va al primer campo con problema. */
  function enfocarPrimerError(e: FieldErrors) {
    const orden: Campo[] = [
      'reporterName',
      'reporterEmail',
      'product',
      'description',
    ];
    const primero = orden.find((k) => e[k]);
    if (!primero) return;
    form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const elemento = e.currentTarget;
    const data = Object.fromEntries(new FormData(elemento)) as Record<
      string,
      string
    >;

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      enfocarPrimerError(found);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/farmacovigilancia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // 202 = guardado pero SIN entregar. No se limpia el formulario: el
        // texto sigue en pantalla por si hay que copiarlo o completarlo.
        const cuerpo = await res.json().catch(() => null);
        setAcuse(cuerpo?.received ?? null);

        if (cuerpo?.stored && !cuerpo?.delivered) {
          setEnviado(data);
          setStatus('stored');
        } else {
          setStatus('sent');
          elemento.reset();
        }
      } else if (res.status === 503) setStatus('notConfigured');
      else if (res.status === 429) setStatus('rateLimit');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-card">
        <p className="form-status" role="status" ref={aviso} tabIndex={-1}>
          {t('success')}
        </p>
      </div>
    );
  }

  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={form}
      className="form-card form-grid"
      onSubmit={onSubmit}
      noValidate
    >
      <fieldset className="form-fieldset form-grid">
        <legend className="sr-only">{t('legend')}</legend>

        {/* Honeypot antispam — invisible para personas, atractivo para bots */}
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            <span className="field-label">{t('reporterName')}</span>
            <input
              name="reporterName"
              autoComplete="name"
              required
              aria-invalid={errors.reporterName ? 'true' : undefined}
              aria-describedby={errors.reporterName ? 'err-reporterName' : undefined}
            />
            {errors.reporterName && (
              <span className="field-error" id="err-reporterName">
                {errors.reporterName}
              </span>
            )}
          </label>

          <label className="field">
            <span className="field-label">{t('reporterEmail')}</span>
            <input
              name="reporterEmail"
              type="email"
              autoComplete="email"
              required
              aria-invalid={errors.reporterEmail ? 'true' : undefined}
              aria-describedby={errors.reporterEmail ? 'err-reporterEmail' : undefined}
            />
            {errors.reporterEmail && (
              <span className="field-error" id="err-reporterEmail">
                {errors.reporterEmail}
              </span>
            )}
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            <span className="field-label">{t('reporterPhone')}</span>
            <input name="reporterPhone" type="tel" autoComplete="tel" />
          </label>

          <label className="field">
            <span className="field-label">{t('reporterType')}</span>
            <select name="reporterType" defaultValue="paciente" required>
              <option value="paciente">{t('typePaciente')}</option>
              <option value="profesional">{t('typeProfesional')}</option>
              <option value="otro">{t('typeOtro')}</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">{t('product')}</span>
          <input
            name="product"
            required
            aria-invalid={errors.product ? 'true' : undefined}
            aria-describedby={errors.product ? 'err-product' : undefined}
          />
          {errors.product && (
            <span className="field-error" id="err-product">
                {errors.product}
              </span>
          )}
        </label>

        <label className="field">
          <span className="field-label">{t('description')}</span>
          <textarea
            name="description"
            required
            placeholder={t('descriptionPlaceholder')}
            aria-invalid={errors.description ? 'true' : undefined}
            aria-describedby={errors.description ? 'err-description' : undefined}
          />
          {errors.description && (
            <span className="field-error" id="err-description">
                {errors.description}
              </span>
          )}
        </label>
      </fieldset>

      {status === 'error' && !hasFieldErrors && (
        <p className="form-status" role="alert" ref={aviso} tabIndex={-1}>
          {t('errorGeneric')}
        </p>
      )}
      {status === 'rateLimit' && (
        <p className="form-status" role="alert" ref={aviso} tabIndex={-1}>
          {t('errorRateLimit')}
        </p>
      )}
      {/* Guardado, sin entregar. Dice exactamente eso —el archivo se recupera
          a mano y no avisa a nadie, así que aquí no se promete revisión— y
          ofrece el correo ya escrito, que es la vía que sí llega hoy. */}
      {status === 'stored' && enviado && (
        <div className="form-status form-stored">
          <p role="alert" ref={aviso} tabIndex={-1}>
            {t('storedNotice', {
              hora: acuse
                ? new Date(acuse).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—',
            })}
          </p>
          <a className="btn btn-blue" href={correoDeRespaldo(enviado)}>
            {t('storedCta')}
          </a>
        </div>
      )}

      {status === 'notConfigured' && (
        <p className="form-status" role="alert" ref={aviso} tabIndex={-1}>
          {t('errorNotConfigured')}{' '}
          <a
            href={`mailto:${CONTACT.pvEmail}`}
            style={{ textDecoration: 'underline' }}
          >
            {tPv('fallbackEmail')}
          </a>
        </p>
      )}

      <button
        type="submit"
        className="btn btn-blue form-submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>

      {/* Aviso de privacidad EN EL PUNTO DE RECOLECCIÓN (LFPDPPP). */}
      <p className="form-privacy">
        {t('privacyNote')} <PrivacyModal className="form-privacy-link" />.
      </p>
    </form>
  );
}
