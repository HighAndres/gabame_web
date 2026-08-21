'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CONTACT } from '@/lib/nav';
import { LIMITES, RE_EMAIL } from '@/lib/schemas';

type Status =
  | 'idle'
  | 'sending'
  | 'sent'
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
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const form = useRef<HTMLFormElement>(null);

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
        setStatus('sent');
        elemento.reset();
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
        <p className="form-status" role="status">
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
        <p className="form-status" role="alert">
          {t('errorGeneric')}
        </p>
      )}
      {status === 'rateLimit' && (
        <p className="form-status" role="alert">
          {t('errorRateLimit')}
        </p>
      )}
      {status === 'notConfigured' && (
        <p className="form-status" role="alert">
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
