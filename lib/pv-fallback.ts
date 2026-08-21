import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Red de seguridad del canal de farmacovigilancia.
 *
 * El problema que resuelve: la ruta armaba el reporte, se lo pasaba al mailer
 * y, si el envío fallaba, devolvía 502 y NO QUEDABA RASTRO DEL REPORTE EN
 * NINGÚN LADO. Para un canal comercial es una molestia; para uno de
 * farmacovigilancia no, porque la NOM-220 pide poder demostrar la recepción de
 * cada notificación. Un fallo de SMTP no puede ser lo que borre una sospecha
 * de reacción adversa.
 *
 * Dos intentos, en este orden:
 *
 * 1. Un JSONL en `PV_LOG_DIR` (por defecto `.pv-reportes/` junto al proceso).
 *    Es lo que se quiere: el reporte queda en un archivo, no en el log general.
 * 2. Si el disco no deja escribir —sistema de solo lectura, permisos—, se
 *    vuelca a `stderr`, que en el VPS acaba en el log del gestor de procesos.
 *
 * ⚠ PRIVACIDAD. Un reporte de RAM lleva datos personales SENSIBLES (salud,
 * art. 3 fr. VI de la LFPDPPP). Este archivo y, en el peor caso, el log del
 * proceso, los contienen en claro. Es una decisión consciente: perder la
 * notificación es peor. Lo que hay que hacer en el servidor es tratar ese
 * directorio como lo que es —permisos restringidos, en la política de
 * retención y de borrado— y vaciarlo en cuanto el reporte esté recuperado.
 */
export async function guardarReporteHuerfano(reporte: {
  received: string;
  motivo: string;
  datos: Record<string, unknown>;
}): Promise<'archivo' | 'stderr'> {
  const dir = process.env.PV_LOG_DIR ?? path.join(process.cwd(), '.pv-reportes');
  const linea = JSON.stringify(reporte) + '\n';

  try {
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, 'huerfanos.jsonl'), linea, 'utf8');
    console.error(
      `[farmacovigilancia] envío fallido (${reporte.motivo}). Reporte guardado en ${dir}/huerfanos.jsonl — recuperarlo A MANO.`,
    );
    return 'archivo';
  } catch (err) {
    console.error(
      '[farmacovigilancia] envío fallido Y no se pudo escribir el respaldo:',
      err,
    );
    // Último recurso: que quede en el log del proceso antes que perderse.
    console.error('[farmacovigilancia] REPORTE SIN GUARDAR:', linea);
    return 'stderr';
  }
}
