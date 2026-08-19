import nodemailer from 'nodemailer';

/**
 * Envío por SMTP. Si las variables no están configuradas, `sendMail` devuelve
 * `notConfigured` en vez de reventar: el formulario muestra el correo de
 * respaldo y el usuario no se queda sin vía.
 *
 * Variables (.env.local / entorno del VPS):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 *   MAIL_TO_CONTACT, MAIL_TO_PV
 */
export type MailResult = { ok: true } | { ok: false; reason: 'notConfigured' | 'failed' };

function isConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.MAIL_FROM,
  );
}

export async function sendMail(opts: {
  to: string | undefined;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  if (!isConfigured() || !opts.to) return { ok: false, reason: 'notConfigured' };

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      replyTo: opts.replyTo,
    });

    return { ok: true };
  } catch (err) {
    console.error('[mailer] envío fallido:', err);
    return { ok: false, reason: 'failed' };
  }
}
