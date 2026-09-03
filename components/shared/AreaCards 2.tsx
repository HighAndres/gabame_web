import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AREAS } from '@/content/areas';
import { SHOW_BRAND_NAMES } from '@/lib/flags';
import { Reveal } from '@/components/shared/Reveal';

/**
 * Vitrina de las seis áreas terapéuticas: una tarjeta por área con icono,
 * nombre, intro de posicionamiento general, chips de marca (solo con el flag
 * `SHOW_BRAND_NAMES`, y solo el nombre) y «Conocer más» a su página.
 *
 * La misma pieza en la Home (sobre el fondo inmersivo) y en el índice
 * `/areas-terapeuticas` (sobre blanco): `tone` elige el botón, el resto
 * hereda la tinta de la superficie.
 */
export function AreaCards({ tone = 'immersive' }: { tone?: 'immersive' | 'white' }) {
  const t = useTranslations('areas');
  const btn = tone === 'white' ? 'btn-black' : 'btn-blue';

  return (
    <div className="area-cards">
      {AREAS.map((area, i) => {
        const Icon = area.icon;
        return (
          <Reveal key={area.slug} className="area-card" delay={60 * i}>
            <span className="area-card-icon" aria-hidden="true">
              <Icon size={30} strokeWidth={1.75} />
            </span>
            <h3>{t(`list.${area.slug}.name`)}</h3>
            <p className="area-card-text">{t(`list.${area.slug}.blurb`)}</p>

            {SHOW_BRAND_NAMES && area.brands.length > 0 && (
              <ul className="area-card-brands" aria-label={t('brandsLabel')}>
                {area.brands.map((b) => (
                  <li key={b} className="chip chip-blue">
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/areas-terapeuticas/${area.slug}`}
              className={`btn ${btn} area-card-cta`}
              aria-label={`${t('cta')}: ${t(`list.${area.slug}.name`)}`}
            >
              {t('cta')}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
