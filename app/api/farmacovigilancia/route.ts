import { NextResponse } from 'next/server';
import { pvSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';
import { devolverGolpe, ipDe, limitar } from '@/lib/rate-limit';
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
  const clave = `pv:${ipDe(request)}`;
  const veredicto = limitar(clave, LIMITE);
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
    const destino = await guardarReporteHuerfano({
      received,
      motivo: result.reason,
      datos: d,
    });

    // Sin correo configurado el reintento no puede funcionar: no gasta cupo.
    // Aquí importa más que en contacto —quien notifica una RAM no puede
    // quedarse fuera por un fallo del servidor—.
    if (result.reason === 'notConfigured') devolverGolpe(clave);

    /**
     * GUARDADO NO ES LO MISMO QUE PERDIDO, y el usuario merece saber cuál de
     * las dos le tocó.
     *
     * Hasta aquí las dos cosas se contestaban igual —«no se pudo enviar»—
     * aunque el reporte SÍ hubiera quedado en disco. Quien acababa de escribir
     * una sospecha de reacción adversa entendía que se había perdido y tenía
     * que redactarla otra vez en un correo; muchos no lo harán, y esa
     * notificación se pierde de verdad por cómo se lo contamos.
     *
     * Cuando el respaldo llegó a ARCHIVO, la respuesta es 202 («aceptado, aún
     * sin procesar») y lleva la hora de recepción, que es lo que el formulario
     * enseña como acuse. Ojo con lo que promete: el archivo hay que
     * recuperarlo A MANO y no hay aviso a nadie, así que la interfaz dice
     * «quedó registrado» y empuja al correo, no «lo revisaremos».
     *
     * Si el respaldo acabó en `stderr` no hay nada que prometer: eso sigue
     * siendo un error como antes.
     */
    if (destino === 'archivo') {
      return NextResponse.json(
        { ok: true, stored: true, delivered: false, received },
        { status: 202 },
      );
    }

    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'notConfigured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true, received });
}
