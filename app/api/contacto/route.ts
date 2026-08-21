import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';
import { ipDe, limitar } from '@/lib/rate-limit';

/** 5 envíos por IP cada 10 minutos. De sobra para una persona; nada para un bot. */
const LIMITE = { maximo: 5, ventanaMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const veredicto = limitar(`contacto:${ipDe(request)}`, LIMITE);
  if (!veredicto.permitido) {
    return NextResponse.json(
      { error: 'rateLimit' },
      { status: 429, headers: { 'Retry-After': String(veredicto.reintentarEn) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  // Honeypot lleno = bot. Respondemos 200 para no darle señal.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const result = await sendMail({
    to: process.env.MAIL_TO_CONTACT,
    subject: `[Web] Contacto — ${d.name}`,
    replyTo: d.email,
    text: [
      `Nombre: ${d.name}`,
      `Correo: ${d.email}`,
      `Institución: ${d.org || '—'}`,
      `Perfil: ${d.profile || '—'}`,
      '',
      d.message,
    ].join('\n'),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'notConfigured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
