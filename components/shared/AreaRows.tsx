import { useTranslations } from 'next-intl';
import { AREA_ORDER } from '@/content/products';

/**
 * Las seis áreas terapéuticas como tabla (no tarjetas).
 *
 * `variant`:
 *  - `full`   → numeral + nombre + descriptor + chip de estado
 *  - `compact` → nombre + chip (para bloques secundarios)
 *
 * El chip sale de `productos.emptyState`: mientras la colección de productos
 * esté vacía, el estado honesto es «Fichas en preparación».
 */
export function AreaRows({
  variant = 'full',
  showChip = true,
}: {
  variant?: 'full' | 'compact';
  showChip?: boolean;
}) {
  const t = useTranslations('home.areas.list');
  const tBlurb = useTranslations('productos.areaBlurb');
  const tProd = useTranslations('productos');

  if (variant === 'compact') {
    return (
      <div className="pf-rows">
        {AREA_ORDER.map((area) => (
          <div key={area} className="pf-row">
            <h3>{t(area)}</h3>
            {showChip && (
              <span className="chip chip-blue">{tProd('emptyState')}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="area-table">
      {AREA_ORDER.map((area, i) => (
        <div key={area} className="area-row">
          <span className="area-num">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{t(area)}</h3>
          <p className="area-desc">{tBlurb(area)}</p>
          {showChip && (
            <span className="chip chip-outline">{tProd('emptyState')}</span>
          )}
        </div>
      ))}
    </div>
  );
}
