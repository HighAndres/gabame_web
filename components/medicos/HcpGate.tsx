'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Puerta de acceso profesional de /medicos: el contenido del apartado está
 * dirigido a profesionales de la salud, así que antes de enseñarlo se pide la
 * declaración (el estándar del sector; la cédula se valida después, a mano,
 * con el alta que llega por el formulario).
 *
 * La declaración vive en `sessionStorage`: dura la visita, no persigue al
 * usuario entre sesiones. Esto NO es la regla de animaciones de la casa («el
 * JS no esconde contenido»): aquí ocultar ES la función, no un adorno — sin
 * JS la puerta queda cerrada, que es el lado seguro.
 *
 * Tres estados para que el servidor y el cliente pinten lo mismo en el primer
 * render (la puerta), y el `useEffect` decida después: sin él, con la sesión
 * ya declarada, el HTML del servidor traería la puerta y el cliente el
 * contenido, y React avisaría del desajuste.
 */
const CLAVE = 'gabame-hcp';

export function HcpGate({ children }: { children: ReactNode }) {
  const t = useTranslations('medicos');
  const [estado, setEstado] = useState<'puerta' | 'dentro'>('puerta');
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLAVE) === '1') setEstado('dentro');
    } catch {
      // Sin almacenamiento (navegación privada estricta): la puerta pregunta
      // en cada carga, que es molesto pero correcto.
    }
  }, []);

  function confirmar() {
    try {
      sessionStorage.setItem(CLAVE, '1');
    } catch {
      /* ídem: sin almacenamiento, la declaración vale solo esta página */
    }
    setEstado('dentro');
  }

  if (estado === 'dentro') return <>{children}</>;

  return (
    <div className="hcp-gate form-card" role="region" aria-labelledby="hcp-gate-title">
      <p className="eyebrow" style={{ color: 'var(--blue)' }}>
        {t('gateEyebrow')}
      </p>
      <h2
        id="hcp-gate-title"
        ref={titulo}
        style={{ fontSize: 'clamp(22px,2.4vw,32px)', marginTop: 10 }}
      >
        {t('gateTitle')}
      </h2>
      <p className="lead" style={{ marginTop: 12 }}>
        {t('gateText')}
      </p>
      <div className="btn-row" style={{ marginTop: 24 }}>
        <button type="button" className="btn btn-blue" onClick={confirmar}>
          {t('gateYes')}
        </button>
        <Link href="/" className="btn btn-outline-white">
          {t('gateNo')}
        </Link>
      </div>
    </div>
  );
}
