import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { HealthyEyesVisual } from '@/components/shared/HealthyEyesVisual';
import { PortalLink } from '@/components/shared/PortalLink';
import { HEALTHY_EYES_PATH } from '@/content/healthy-eyes';

/**
 * Bloque destacado de Healthy Eyes en la Home (junta sep 2026). Ocupa el
 * lugar —y la rejilla `pf-grid`— de la antigua sección «Portafolio Rx»:
 * visual a un lado, texto y dos acciones al otro. Las acciones son la página
 * pública del dispositivo y la puerta al área médica del portal; aquí no hay
 * fichas, listados ni claims.
 *
 * El video vertical del portafolio Rx que vivía aquí (`portafoliorx.mp4`) no
 * se usa: enseñaba producto Rx en una ruta pública.
 */
export function HealthyEyes() {
  const t = useTranslations('home.healthyEyes');

  return (
    <section id="healthy-eyes" className="section surface-black">
      <Atmosphere tone="dark" />

      <div className="container pf-grid">
        <Reveal className="pf-frame-wrap">
          <HealthyEyesVisual />
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow" style={{ color: 'var(--blue)' }}>
            {t('kicker')}
          </p>
          <h2 style={{ marginTop: 12 }}>{t('title')}</h2>
          <p className="lead" style={{ marginTop: 18 }}>
            {t('subtitle')}
          </p>

          <p className="note" style={{ marginTop: 32 }}>
            {t('legend')}
          </p>

          <div className="btn-row" style={{ marginTop: 32 }}>
            <Link href={HEALTHY_EYES_PATH} className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <PortalLink className="btn btn-outline-white">
              {t('ctaSecondary')}
            </PortalLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
