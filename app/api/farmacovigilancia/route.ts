import { NextResponse } from 'next/server';
import { pvSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';

/**
 * Canal de farmacovigilancia — SEPARADO del contacto comercial.
 * Destino propio (MAIL_TO_PV) y asunto marcado para trazabilidad.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = pvSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  if (parsed.data.website) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const received = new Date().toISOString();

  const result = await sendMail({
    to: process.env.MAIL_TO_PV,
    subject: `[FV] Sospecha de RAM — ${d.product}`,
    replyTo: d.reporterEmail,
    text: [
      `Recibido: ${received}`,
      `Notificador: ${d.reporterName} (${d.reporterType})`,
      `Correo: ${d.reporterEmail}`,
      `Teléfono: ${d.reporterPhone || '—'}`,
      `Producto sospechoso: ${d.product}`,
      '',
      'Descripción:',
      d.description,
    ].join('\n'),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'notConfigured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, received });
}
