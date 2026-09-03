import { useTranslations } from 'next-intl';
import { AREA_ORDER } from '@/content/areas';

/**
 * Las seis áreas terapéuticas como tabla (no tarjetas): numeral + nombre +
 * descriptor. Sin chip de estado desde sep 2026: «Fichas en preparación»
 * hablaba de fichas de producto, que ya no existen en el sitio público.
 */
export function AreaRows() {
  const t = useTranslations('areas.list');

  return (
    <div className="area-table">
      {AREA_ORDER.map((area, i) => (
        <div key={area} className="area-row">
          <span className="area-num">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{t(`${area}.name`)}</h3>
          <p className="area-desc">{t(`${area}.blurb`)}</p>
        </div>
      ))}
    </div>
  );
}
