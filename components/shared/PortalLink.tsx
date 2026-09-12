import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PORTAL, isExternal, type PortalDestino } from '@/lib/nav';

/**
 * Enlace al portal de GABAME. Aquí se resuelve UNA vez la diferencia entre
 * una ruta del sitio y una URL de fuera:
 *
 * - ruta interna → `Link` de next-intl (prefijo de idioma, sin recarga);
 * - URL externa → `<a>` a pestaña nueva, con la flecha diagonal y el aviso
 *   oculto que ya usa el resto del sitio para salir de él.
 *
 * Quien lo usa no sabe cuál de las dos está pasando, que es la idea: al
 * cambiar `PORTAL` en `lib/nav.ts` no hay que tocar ningún CTA.
 *
 * `destino` es OBLIGATORIO a propósito. El portal tiene dos puertas y el
 * botón dice a cuál va; si esto tuviera un valor por defecto, un «Portal de
 * clientes» apuntando al área médica compilaría sin una queja.
 */
export function PortalLink({
  destino,
  className,
  children,
  onClick,
}: {
  /** Qué puerta del portal: profesionales de la salud o clientes. */
  destino: PortalDestino;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const tA11y = useTranslations('a11y');
  const href = PORTAL[destino];

  if (isExternal(href)) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        <span>{children}</span>
        <ArrowUpRight size={18} aria-hidden="true" />
        <span className="sr-only"> ({tA11y('newTab')})</span>
      </a>
    );
  }

  return (
    <Link className={className} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}
