import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PORTAL_URL, isExternal } from '@/lib/nav';

/**
 * Enlace a `PORTAL_URL`, que hoy es una ruta del sitio (`/proximamente`) y
 * mañana será el portal externo. Aquí se resuelve la diferencia UNA vez:
 *
 * - ruta interna → `Link` de next-intl (prefijo de idioma, sin recarga);
 * - URL externa → `<a>` a pestaña nueva, con la flecha diagonal y el aviso
 *   oculto que ya usa el resto del sitio para salir de él.
 *
 * Quien lo usa no sabe cuál de las dos está pasando, que es la idea: al
 * cambiar la constante en `lib/nav.ts` no hay que tocar ningún CTA.
 */
export function PortalLink({
  href = PORTAL_URL,
  className,
  children,
  onClick,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const tA11y = useTranslations('a11y');

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
