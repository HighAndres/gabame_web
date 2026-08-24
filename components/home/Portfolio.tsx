import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { AutoVideo } from '@/components/shared/AutoVideo';
import { Reveal } from '@/components/shared/Reveal';

/**
 * Portafolio Rx en la Home: video vertical 9:16 + entrada a la página completa.
 *
 * NO vuelve a listar las seis áreas: ya están arriba, en la sección Áreas.
 * Si se quieren repetir aquí, es una línea: <AreaRows variant="compact" />.
 */
export function Portfolio() {
  const t = useTranslations('home.portafolio');

  return (
    <section id="portafolio" className="section surface-black">
      <Atmosphere tone="dark" />

      <div className="container pf-grid">
        {/* Entrada video → texto. Reveal ES el item de la rejilla: lleva la
            clase del div al que sustituye. */}
        <Reveal className="pf-frame">
          {/* Diferido: son 3 MB muy por debajo del pliegue. Sin póster
              propio (no hay fotograma extraído); mientras no carga se ve la
              trama diagonal del marco, que en este sistema ya significa
              «hueco de media». */}
          <AutoVideo src="/media/portafoliorx.mp4" lazy />
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
            {t('note')}
          </p>

          <div className="btn-row" style={{ marginTop: 32 }}>
            <Link href="/portafolio" className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <Link href="/contacto" className="btn btn-outline-white">
              {t('ctaSecondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
