import { NextResponse } from 'next/server';
import { medicoSchema } from '@/lib/schemas';
import { sendMail } from '@/lib/mailer';
import { devolverGolpe, ipDe, limitar } from '@/lib/rate-limit';

/**
 * Alta de perfil médico. Mismo contrato que /api/contacto; va al buzón
 * comercial (MAIL_TO_CONTACT) con el asunto marcado: no amerita buzón propio
 * mientras el alta la valide a mano el mismo equipo. Si algún día se separa,
 * es una variable de entorno.
 */
const LIMITE = { maximo: 5, ventanaMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const clave = `medicos:${ipDe(request)}`;
  const veredicto = limitar(clave, LIMITE);
  if (!veredicto.permitido) {
    return NextResponse.json(
      { error: 'rateLimit' },
      { status: 429, headers: { 'Retry-After': String(veredicto.reintentarEn) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = medicoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  // Honeypot lleno = bot. Respondemos 200 para no darle señal.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const result = await sendMail({
    to: process.env.MAIL_TO_CONTACT,
    subject: `[Web] Alta de médico — ${d.name}`,
    replyTo: d.email,
    text: [
      `Nombre: ${d.name}`,
      `Correo: ${d.email}`,
      `Teléfono: ${d.phone || '—'}`,
      `Cédula profesional: ${d.cedula}`,
      `Especialidad: ${d.specialty}`,
      `Institución / consultorio: ${d.institution || '—'}`,
      '',
      d.comment || '(sin comentario)',
    ].join('\n'),
  });

  if (!result.ok) {
    // Sin correo configurado no hay reintento que valga: que no gaste cupo.
    if (result.reason === 'notConfigured') devolverGolpe(clave);

    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'notConfigured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
