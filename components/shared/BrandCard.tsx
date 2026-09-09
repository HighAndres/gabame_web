import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { GroupBrand } from '@/content/brands';

/**
 * Tarjeta de una marca del grupo: zona visual arriba (logotipo u ordinal) y
 * etiqueta abajo. La usan el desfile de la Home y la rejilla de /nosotros.
 * Con `url` la tarjeta ENTERA es un enlace externo en pestaña nueva con
 * «Visitar sitio». GABAME es la anfitriona: sin enlace y sin etiqueta, que
 * enlazar a la página en la que ya estás es redundante.
 *
 * `decorativa` marca la copia que hace el bucle del desfile: existe solo
 * para que no tenga costura, así que no se anuncia ni recibe el foco.
 */
export function BrandCard({
  brand,
  index,
  sizes = '240px',
  decorativa = false,
}: {
  brand: GroupBrand;
  index: number;
  /** Ancho máximo al que se pinta el logotipo, para que Next sirva la variante justa. */
  sizes?: string;
  decorativa?: boolean;
}) {
  const t = useTranslations('home.ecosistema');
  const className = `eco-card ${brand.active ? 'eco-card-active' : 'eco-card-ext'}`;

  const inner = (
    <>
      {/* Zona visual: logotipo si lo hay; si no, el ordinal sobre la trama.
          Archivos en `content/brands.ts`. */}
      <div className="eco-media" aria-hidden="true">
        {brand.logo ? (
          <Image
            src={brand.logo.src}
            alt=""
            width={600}
            height={600}
            sizes={sizes}
            className={brand.active ? 'eco-mark' : 'eco-logo'}
          />
        ) : (
          <span className="eco-num">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <div className="eco-body">
        <h3>{brand.name}</h3>
        {brand.url && (
          <span className="eco-status">
            {t('statusVisit')}
            <span className="eco-arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        )}
      </div>
    </>
  );

  if (brand.url) {
    return (
      <a
        href={brand.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-hidden={decorativa || undefined}
        tabIndex={decorativa ? -1 : undefined}
        aria-label={`${brand.name}: ${t('statusVisit')}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={className} aria-hidden={decorativa || undefined}>
      {inner}
    </div>
  );
}
