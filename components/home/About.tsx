import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Stats } from '@/components/shared/Stats';
import { mediaLibrary } from '@/content/media';

/**
 * Nosotros, según la referencia del cliente: foto a un lado con marco y un
 * sello de marca montado en la esquina; al otro, entradilla, titular, texto,
 * las tres cifras y los botones.
 *
 * Sigue en azul —es donde el cliente quiere el peso— pero deja de ser un
 * bloque de solo texto con una filigrana: gana la foto real de laboratorio
 * (`bg1_clean.webp`, la única foto entregada) y las cifras, que estaban
 * duplicadas en la portada y ahora viven aquí, en su sección.
 */
export function About() {
  const t = useTranslations('home.nosotros');
  const lab = mediaLibrary.lab;

  return (
    <section id="nosotros" className="section surface-blue">
      <Atmosphere tone="blue" />

      <div className="container about-layout">
        <div className="about-visual">
          <div className="about-photo">
            <Image
              src={lab.src}
              alt={lab.alt}
              width={2352}
              height={1536}
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          {/* Sello: el símbolo sobre negro, montado en la esquina del marco. */}
          <div className="about-seal" aria-hidden="true">
            <Image
              src={mediaLibrary.mark.src}
              alt=""
              width={600}
              height={600}
              className="about-seal-mark"
            />
          </div>
        </div>

        <div className="about-copy">
          <p className="eyebrow">{t('kicker')}</p>
          <h2>{t('title')}</h2>
          <p className="about-text">{t('subtitle')}</p>

          <Stats />

          <div className="btn-row">
            <Link href="/contacto" className="btn btn-black">
              {t('ctaPrimary')}
            </Link>
            <Link href="/nosotros" className="btn btn-outline-black">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
