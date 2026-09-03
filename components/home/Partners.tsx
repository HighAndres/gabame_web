import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';

/**
 * Socios: composición asimétrica. Bloque negro con farmacovigilancia dentro,
 * bloque azul con la vía de socios. Sin gap entre ambos: los dos colores se
 * tocan, que es lo que hace la pieza.
 */
export function Partners() {
  const t = useTranslations('home.socios');

  return (
    <section id="socios">
      <div className="partners-grid">
        <div className="partners-main surface-black">
          <Atmosphere tone="dark" />

          {/* Entrada en dos tiempos: cabecera y luego el bloque de
              farmacovigilancia. Los Reveal son hijos directos del panel, así
              heredan el `z-index` de `.partners-main > *:not(.atmo)`. */}
          <Reveal>
            <p className="eyebrow" style={{ color: 'var(--blue)' }}>
              {t('kicker')}
            </p>
            <h2 style={{ marginTop: 12 }}>{t('title')}</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              {t('subtitle')}
            </p>
          </Reveal>

          <Reveal className="pv-block" delay={100}>
            <h3>{t('pvTitle')}</h3>
            <p className="lead">{t('pvText')}</p>
            <Link href="/farmacovigilancia" className="btn btn-blue">
              {t('pvCta')}
            </Link>
          </Reveal>
        </div>

        <div className="partners-side surface-blue">
          <Atmosphere tone="blue" />

          {/* Cada pieza en su Reveal: el panel es flex con `gap`, y un
              envoltorio único se comería los espacios. El botón pierde el
              `alignSelf` porque ahora quien flexa es su envoltorio. */}
          <Reveal delay={60}>
            <h3>{t('partnerTitle')}</h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead">{t('partnerText')}</p>
          </Reveal>
          <Reveal delay={180}>
            <Link href="/contacto" className="btn btn-blue">
              {t('partnerCta')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
