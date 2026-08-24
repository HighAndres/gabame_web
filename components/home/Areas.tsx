import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AreaRows } from '@/components/shared/AreaRows';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';

/**
 * Áreas terapéuticas. Va sobre AZUL: es el bloque de superficie más grande de
 * la Home y es lo que hace que el azul domine, como pidió el cliente.
 * Sobre azul todo el texto va en negro sólido (6.19:1).
 */
export function Areas() {
  const t = useTranslations('home.areas');

  return (
    <section id="areas" className="section surface-blue">
      <Atmosphere tone="blue" />

      <div className="container">
        {/* Entrada escalonada cabecera → filas → botones (Reveal ocupa el
            lugar del div al que sustituye, la rejilla no cambia). */}
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">{t('kicker')}</p>
            <h2>{t('title')}</h2>
          </div>
          <p className="lead">{t('subtitle')}</p>
        </Reveal>

        <Reveal delay={80}>
          <AreaRows variant="full" />
        </Reveal>

        <Reveal delay={160}>
          <div className="btn-row" style={{ marginTop: 48 }}>
            <Link href="/portafolio" className="btn btn-black">
              {t('ctaPrimary')}
            </Link>
            <Link href="/nosotros" className="btn btn-outline-black">
              {t('ctaSecondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
