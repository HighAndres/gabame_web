import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AreaRows } from '@/components/shared/AreaRows';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';

/**
 * Áreas terapéuticas. Va sobre el FONDO INMERSIVO (`.surface-blue`): es el
 * bloque de superficie más grande de la Home. Desde sep 2026 ese fondo es
 * azul-noche o gris azulado (ver `:root` en `globals.css`) y el texto va en
 * blanco; los botones negros que había aquí no se veían sobre él y pasan al
 * acento azul y al contorno blanco.
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
            <Link href="/portafolio" className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <Link href="/nosotros" className="btn btn-outline-white">
              {t('ctaSecondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
