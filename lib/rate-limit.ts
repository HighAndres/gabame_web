/**
 * Límite de peticiones por IP, en memoria.
 *
 * Los dos formularios del sitio son relés a correo abiertos: el honeypot solo
 * frena bots ingenuos, y sin límite un script trivial inunda los buzones. El de
 * farmacovigilancia es el que no puede saturarse, porque es el que alguien
 * necesita leer.
 *
 * EN MEMORIA, con lo que eso implica: el contador se pierde al reiniciar y NO
 * se comparte entre procesos. Vale para el despliegue actual —`output:
 * standalone`, un solo proceso Node en el VPS— y hay que cambiarlo por un
 * almacén compartido (Redis) el día que haya más de una instancia detrás del
 * balanceador.
 */

type Registro = { golpes: number[]; };

const registros = new Map<string, Registro>();

/** Cada cuánto se barre el mapa de IPs que ya no cuentan. */
const BARRIDO_MS = 10 * 60 * 1000;
let ultimoBarrido = 0;

/**
 * IP del cliente. Detrás de nginx la real viene en `x-forwarded-for`; el
 * primer valor de la lista es el cliente y el resto son los proxies.
 *
 * Si no llega ninguna cabecera todas las peticiones caen en el mismo cubo:
 * es deliberado. Preferimos limitar de más —el sitio recibe un puñado de
 * envíos al día— que dejar la puerta abierta porque el proxy esté mal
 * configurado.
 */
export function ipDe(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'desconocida';
}

export type Veredicto =
  | { permitido: true }
  | { permitido: false; reintentarEn: number };

/**
 * ¿Puede pasar esta IP? `ventanaMs` es la ventana deslizante y `maximo` los
 * envíos permitidos dentro de ella.
 */
export function limitar(
  clave: string,
  { maximo, ventanaMs }: { maximo: number; ventanaMs: number },
): Veredicto {
  const ahora = Date.now();

  // Barrido perezoso: sin esto el mapa crece con cada IP que pase por aquí.
  if (ahora - ultimoBarrido > BARRIDO_MS) {
    ultimoBarrido = ahora;
    // `forEach` y no `for...of`: el `target` del proyecto es ES5 y iterar un
    // Map directamente necesitaría `downlevelIteration`.
    registros.forEach((v, k) => {
      if (v.golpes.every((t: number) => ahora - t > ventanaMs)) {
        registros.delete(k);
      }
    });
  }

  const registro = registros.get(clave) ?? { golpes: [] };
  const vigentes = registro.golpes.filter((t) => ahora - t < ventanaMs);

  if (vigentes.length >= maximo) {
    const masViejo = Math.min(...vigentes);
    registros.set(clave, { golpes: vigentes });
    return {
      permitido: false,
      reintentarEn: Math.ceil((ventanaMs - (ahora - masViejo)) / 1000),
    };
  }

  vigentes.push(ahora);
  registros.set(clave, { golpes: vigentes });
  return { permitido: true };
}

/**
 * Devuelve el golpe más reciente de una clave.
 *
 * El limitador cuenta ANTES de saber si el envío sirvió de algo, que es lo
 * correcto para no dejar la puerta abierta. Pero hay un caso en el que contar
 * castiga a quien no tiene culpa: cuando el servidor NO TIENE CORREO
 * CONFIGURADO. Ahí el envío no puede funcionar por mucho que se reintente, y
 * el formulario —que además invita a reintentar— dejaba al visitante bloqueado
 * al tercer intento con un «demasiados envíos desde esta conexión».
 *
 * Solo para ese caso. Un fallo de SMTP de verdad (`failed`) SÍ sigue contando:
 * ahí hubo conexión, trabajo del servidor y puede funcionar al siguiente
 * intento, así que no hay razón para regalar cupo.
 */
export function devolverGolpe(clave: string): void {
  const registro = registros.get(clave);
  if (!registro || registro.golpes.length === 0) return;

  // El último de la lista es el que acaba de anotar `limitar`.
  registro.golpes.pop();
  if (registro.golpes.length === 0) registros.delete(clave);
  else registros.set(clave, registro);
}
