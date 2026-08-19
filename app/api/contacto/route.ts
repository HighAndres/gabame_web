import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';

export async function POST(request: Request) {
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
