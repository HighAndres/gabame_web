'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CONTACT } from '@/lib/nav';
import { LIMITES, RE_CEDULA, RE_EMAIL } from '@/lib/schemas';

type Status =
  | 'idle'
  | 'sending'
  | 'sent'
  | 'error'
  | 'notConfigured'
  | 'rateLimit';
type FieldErrors = Partial<
  Record<'name' | 'email' | 'cedula' | 'specialty', string>
>;

/**
 * Alta de perfil médico. Mismo esqueleto que `ContactForm` (tarjeta, filas de
 * dos, validación en línea con las cifras del servidor, honeypot, foco al
 * aviso al responder el servidor). Cambian los campos: cédula profesional y
 * especialidad obligatorias — son lo que el equipo valida antes del alta.
 */
export function MedicoForm() {
  const t = useTranslations('medicoForm');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const form = useRef<HTMLFormElement>(null);

  /** Ver la nota en `ContactForm`: al responder el servidor, el foco va al aviso. */
  const aviso = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const respondioElServidor =
      status === 'sent' ||
      status === 'notConfigured' ||
      status === 'rateLimit' ||
      (status === 'error' && Object.keys(errors).length === 0);
    if (respondioElServidor) aviso.current?.focus();
  }, [status, errors]);

  function validate(d: {
    name: string;
    email: string;
    cedula: string;
    specialty: string;
  }) {
    const e: FieldErrors = {};
    if (d.name.trim().length < LIMITES.name.min) e.name = t('invalidName');
    if (!RE_EMAIL.test(d.email.trim())) e.email = t('invalidEmail');
    if (!RE_CEDULA.test(d.cedula.replace(/\s+/g, ''))) {
      e.cedula = t('invalidCedula');
    }
    if (d.specialty.trim().length < LIMITES.specialty.min) {
      e.specialty = t('invalidSpecialty');
    }
    return e;
  }

  function enfocarPrimerError(e: FieldErrors) {
    const orden: Array<keyof FieldErrors> = [
      'name',
      'email',
      'cedula',
      'specialty',
    ];
    const primero = orden.find((k) => e[k]);
    if (!primero) return;
    form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const elemento = e.currentTarget;
    const fd = new FormData(elemento);
    const data = Object.fromEntries(fd) as Record<string, string>;

    const found = validate({
      name: data.name ?? '',
      email: data.email ?? '',
      cedula: data.cedula ?? '',
      specialty: data.specialty ?? '',
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      enfocarPrimerError(found);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/medicos', {
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
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
          {errors.name && (
            <span className="field-error" id="err-name">
              {errors.name}
            </span>
          )}
        </label>

        <label className="field">
          <span className="field-label">{t('email')}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'err-email' : undefined}
          />
          {errors.email && (
            <span className="field-error" id="err-email">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span className="field-label">{t('cedula')}</span>
          <input
            type="text"
            name="cedula"
            inputMode="numeric"
            aria-invalid={errors.cedula ? 'true' : undefined}
            aria-describedby={errors.cedula ? 'err-cedula' : undefined}
          />
          {errors.cedula && (
            <span className="field-error" id="err-cedula">
              {errors.cedula}
            </span>
          )}
        </label>

        <label className="field">
          <span className="field-label">{t('specialty')}</span>
          <input
            type="text"
            name="specialty"
            aria-invalid={errors.specialty ? 'true' : undefined}
            aria-describedby={errors.specialty ? 'err-specialty' : undefined}
          />
          {errors.specialty && (
            <span className="field-error" id="err-specialty">
              {errors.specialty}
            </span>
          )}
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span className="field-label">
            {t('phone')} · {t('optional')}
          </span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>

        <label className="field">
          <span className="field-label">
            {t('institution')} · {t('optional')}
          </span>
          <input type="text" name="institution" autoComplete="organization" />
        </label>
      </div>

      <label className="field">
        <span className="field-label">
          {t('comment')} · {t('optional')}
        </span>
        <textarea name="comment" />
      </label>

      {status === 'error' && hasFieldErrors && (
        <p className="form-status" role="alert">
          {t('errorValidation')}
        </p>
      )}
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
      {/* 503: correo del servidor sin configurar. Ver la nota en ContactForm. */}
      {status === 'notConfigured' && (
        <p className="form-status" role="alert" ref={aviso} tabIndex={-1}>
          {t('errorNotConfigured')}{' '}
          <a
            href={`mailto:${CONTACT.email}`}
            style={{ textDecoration: 'underline' }}
          >
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

      {/* Aviso de privacidad EN EL PUNTO DE RECOLECCIÓN (LFPDPPP). */}
      <p className="form-privacy">
        <PrivacyModal className="form-privacy-link" label={t('privacyNote')} />
      </p>
    </form>
  );
}
