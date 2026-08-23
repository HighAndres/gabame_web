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
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

/**
 * Formulario de contacto. Retoma el patrón del sitio v1: tarjeta delimitada,
 * nombre y correo en una fila, mensaje a todo el ancho, botón de envío a todo
 * el ancho y validación en línea por campo antes de tocar el servidor.
 *
 * Envía siempre al Route Handler (/api/contacto) — nunca credenciales en el
 * cliente. Honeypot antispam incluido.
 *
 * SIN `placeholder` (ago 2026): repetían literalmente la etiqueta que tienen
 * justo encima —«Nombre» sobre «Nombre»— y el formulario de farmacovigilancia
 * no los llevaba, así que los dos canales del sitio ni siquiera se parecían.
 * El único que queda en el sitio es el de la descripción de la reacción
 * adversa, y ese sí aporta: explica qué escribir, no repite el rótulo.
 */
export function ContactForm() {
  const t = useTranslations('contactForm');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const form = useRef<HTMLFormElement>(null);

  /**
   * Las mismas cifras que usa el servidor (`LIMITES` en `lib/schemas.ts`). Si
   * el cliente pide menos que el servidor, el envío pasa la validación en
   * línea, el servidor devuelve 400 y el formulario solo puede enseñar el
   * error genérico: el usuario no sabe qué campo arreglar.
   */
  function validate(d: { name: string; email: string; message: string }) {
    const e: FieldErrors = {};
    if (d.name.trim().length < LIMITES.name.min) e.name = t('invalidName');
    if (!RE_EMAIL.test(d.email.trim())) e.email = t('invalidEmail');
    if (d.message.trim().length < LIMITES.message.min) {
      e.message = t('invalidMessage');
    }
    return e;
  }

  /** Al fallar, el foco va al primer campo con problema. */
  function enfocarPrimerError(e: FieldErrors) {
    const orden: Array<keyof FieldErrors> = ['name', 'email', 'message'];
    const primero = orden.find((k) => e[k]);
    if (!primero) return;
    form.current
      ?.querySelector<HTMLElement>(`[name="${primero}"]`)
      ?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const elemento = e.currentTarget;
    const fd = new FormData(elemento);
    const data = Object.fromEntries(fd) as Record<string, string>;

    const found = validate({
      name: data.name ?? '',
      email: data.email ?? '',
      message: data.message ?? '',
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      enfocarPrimerError(found);
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
          <span className="field-label">
            {t('org')} · {t('orgOptional')}
          </span>
          <input
            type="text"
            name="org"
            autoComplete="organization"
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
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'err-message' : undefined}
        />
        {errors.message && (
          <span className="field-error" id="err-message">
            {errors.message}
          </span>
        )}
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
      {status === 'rateLimit' && (
        <p className="form-status" role="alert">
          {t('errorRateLimit')}
        </p>
      )}
      {/* 503: el correo del servidor no está configurado. NO es «inténtalo de
          nuevo» —reintentar no puede funcionar, y encima gasta el cupo del
          limitador—: es «escríbenos a esta dirección». Decía lo contrario
          porque `errorNotConfigured` no existía en el diccionario y esta rama
          caía en `errorGeneric`. */}
      {status === 'notConfigured' && (
        <p className="form-status" role="alert">
          {t('errorNotConfigured')}{' '}
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
