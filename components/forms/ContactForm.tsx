'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CONTACT } from '@/lib/nav';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'notConfigured';
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

/**
 * Formulario de contacto. Retoma el patrón del sitio v1: tarjeta delimitada,
 * nombre y correo en una fila, mensaje a todo el ancho, botón de envío a todo
 * el ancho y validación en línea por campo antes de tocar el servidor.
 *
 * Envía siempre al Route Handler (/api/contacto) — nunca credenciales en el
 * cliente. Honeypot antispam incluido.
 */
export function ContactForm() {
  const t = useTranslations('contactForm');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(d: { name: string; email: string; message: string }) {
    const e: FieldErrors = {};
    if (!d.name.trim()) e.name = t('invalidName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = t('invalidEmail');
    if (!d.message.trim()) e.message = t('invalidMessage');
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd) as Record<string, string>;

    const found = validate({
      name: data.name ?? '',
      email: data.email ?? '',
      message: data.message ?? '',
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contacto', {
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
      {/* Honeypot antispam — invisible para personas, atractivo para bots */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span className="field-label">{t('name')}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={t('name')}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label className="field">
          <span className="field-label">{t('email')}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t('email')}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span className="field-label">
            {t('org')} · {t('orgOptional')}
          </span>
          <input
            type="text"
            name="org"
            autoComplete="organization"
            placeholder={t('org')}
          />
        </label>

        <label className="field">
          <span className="field-label">{t('profile')}</span>
          <select name="profile" defaultValue="">
            <option value="">{t('profileChoose')}</option>
            <option value="hcp">{t('profileHcp')}</option>
            <option value="distributor">{t('profileDistributor')}</option>
            <option value="partner">{t('profilePartner')}</option>
            <option value="institution">{t('profileInstitution')}</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field-label">{t('message')}</span>
        <textarea
          name="message"
          placeholder={t('message')}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </label>

      {status === 'error' && hasFieldErrors && (
        <p className="form-status" role="alert">
          {t('errorValidation')}
        </p>
      )}
      {status === 'error' && !hasFieldErrors && (
        <p className="form-status" role="alert">
          {t('errorGeneric')}
        </p>
      )}
      {status === 'notConfigured' && (
        <p className="form-status" role="alert">
          {t('errorGeneric')}{' '}
          <a href={`mailto:${CONTACT.email}`} style={{ textDecoration: 'underline' }}>
            {CONTACT.email}
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

      {/* Aviso de privacidad EN EL PUNTO DE RECOLECCIÓN (LFPDPPP).
          La cadena del cliente ya nombra el aviso, así que la frase entera
          es el disparador: sin repetir «Aviso de privacidad» dos veces. */}
      <p className="form-privacy">
        <PrivacyModal className="form-privacy-link" label={t('privacyNote')} />
      </p>
    </form>
  );
}
