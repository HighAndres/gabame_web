'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CONTACT } from '@/lib/nav';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'notConfigured';
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

  function validate(d: Record<string, string>) {
    const e: FieldErrors = {};
    if (!d.reporterName?.trim()) e.reporterName = t('invalidName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.reporterEmail ?? ''))
      e.reporterEmail = t('invalidEmail');
    if (!d.product?.trim()) e.product = t('invalidProduct');
    // El mínimo de 10 caracteres venía del `minLength` nativo: un reporte de
    // farmacovigilancia con tres letras no sirve para nada.
    if ((d.description ?? '').trim().length < 10)
      e.description = t('invalidDescription');
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
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
        form.reset();
      } else if (res.status === 503) setStatus('notConfigured');
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
    <form className="form-card form-grid" onSubmit={onSubmit} noValidate>
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
            />
            {errors.reporterName && (
              <span className="field-error">{errors.reporterName}</span>
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
            />
            {errors.reporterEmail && (
              <span className="field-error">{errors.reporterEmail}</span>
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
          />
          {errors.product && (
            <span className="field-error">{errors.product}</span>
          )}
        </label>

        <label className="field">
          <span className="field-label">{t('description')}</span>
          <textarea
            name="description"
            required
            placeholder={t('descriptionPlaceholder')}
            aria-invalid={errors.description ? 'true' : undefined}
          />
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </label>
      </fieldset>

      {status === 'error' && !hasFieldErrors && (
        <p className="form-status" role="alert">
          {t('errorGeneric')}
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
