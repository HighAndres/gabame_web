import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { Stats } from '@/components/shared/Stats';
import { BrandLockup } from '@/components/layout/BrandLockup';
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
        {/* Entrada foto → texto. Reveal ES el item de la rejilla: lleva la
            clase del div al que sustituye. */}
        <Reveal className="about-visual">
          <div className="about-photo">
            <Image
              src={lab.src}
              alt={lab.alt}
              width={2352}
              height={1536}
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          {/* Sello: el símbolo en azul sobre el disco negro, montado en la
              esquina del marco. Misma pieza que el logotipo de la cabecera
              (máscara del PNG + tinta de marca), no una imagen: el PNG del
              símbolo cambió en ago-2026 —ya viene sin aire— y el recorte al
              190 % que había aquí dejaba un manchón blanco. Gira despacio y
              respira (ver `.about-seal` en globals.css). */}
          <div className="about-seal" aria-hidden="true">
            <BrandLockup variant="mark" className="about-seal-lockup" />
          </div>
        </Reveal>

        <Reveal className="about-copy" delay={100}>
          <p className="eyebrow">{t('kicker')}</p>
          <h2>{t('title')}</h2>
          <p className="about-text">{t('subtitle')}</p>

          <Stats />

          <div className="btn-row">
            <Link href="/contacto" className="btn btn-blue">
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
