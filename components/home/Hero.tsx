import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AutoVideo } from '@/components/shared/AutoVideo';

/**
 * Portada, según la referencia del cliente: video a sangre con velo oscuro y
 * el texto ENCIMA, centrado; debajo, una franja azul que monta sobre el borde
 * inferior del video con las tres cifras en tarjetas.
 *
 * Sustituye al panel azul montado sobre el video. Las cifras (2013 · ~250 · 6)
 * siguen en la portada: pasan del panel a la franja.
 *
 * El velo va a 0,62 de negro: sobre el fotograma más claro posible (blanco)
 * eso deja el texto blanco en 5,8:1, así que el contraste no depende del
 * fotograma. Sobre negro el blanco no cumple sobre azul, por eso el texto de
 * la portada NO va sobre la franja azul: va sobre el video oscurecido.
 */
export function Hero() {
  const t = useTranslations('home.hero');
  const tStats = useTranslations('home.nosotros.stats');

  const stats = [
    { value: tStats('foundedValue'), label: tStats('foundedLabel') },
    { value: tStats('peopleValue'), label: tStats('peopleLabel') },
    { value: tStats('areasValue'), label: tStats('areasLabel') },
  ];

  return (
    <section id="inicio" className="hero">
      {/* El texto va DENTRO de la caja negra del video, no como hermano: así
          su fondo real (negro + velo) es su ancestro, y en móvil el contenido
          puede fluir y crecer sin que la franja se le monte encima. */}
      <div className="hero-media">
        <div className="hero-bg" aria-hidden="true">
          <AutoVideo
            src="/media/vid_header.mp4"
            poster="/media/vid_header_poster.jpg"
          />
          <div className="hero-veil" />
        </div>

        <div className="container hero-content">
          <span className="hero-tag">{t('kicker')}</span>
          <h1>{t('title')}</h1>
          <p className="lead">{t('subtitle')}</p>
          <div className="btn-row">
            <Link href="/portafolio" className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <Link href="/contacto" className="btn btn-outline-white">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>

      {/* Franja azul montada sobre el borde inferior del video. Va al ancho
          del contenedor, no a sangre: así el video asoma a los lados y el
          solape se ve, como en la referencia. */}
      <div className="container">
        <dl className="hero-strip surface-blue">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <dd className="stat-value">{s.value}</dd>
              <dt className="stat-label">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
