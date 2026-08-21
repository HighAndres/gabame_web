import { NextResponse } from 'next/server';
import { pvSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';
import { ipDe, limitar } from '@/lib/rate-limit';
import { guardarReporteHuerfano } from '@/lib/pv-fallback';

/**
 * Más holgado que el de contacto: alguien puede tener que notificar varias
 * sospechas seguidas, y aquí el coste de bloquear de más es alto.
 */
const LIMITE = { maximo: 8, ventanaMs: 10 * 60 * 1000 };

/**
 * Canal de farmacovigilancia — SEPARADO del contacto comercial.
 * Destino propio (MAIL_TO_PV) y asunto marcado para trazabilidad.
 */
export async function POST(request: Request) {
  const veredicto = limitar(`pv:${ipDe(request)}`, LIMITE);
  if (!veredicto.permitido) {
    return NextResponse.json(
      { error: 'rateLimit' },
      { status: 429, headers: { 'Retry-After': String(veredicto.reintentarEn) } },
    );
  }

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
    // El correo se cayó: antes de rendirnos, el reporte se guarda. Un fallo de
    // SMTP no puede ser lo que borre una sospecha de reacción adversa.
    await guardarReporteHuerfano({ received, motivo: result.reason, datos: d });

    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'notConfigured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, received });
}
