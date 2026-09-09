import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { BrandCard } from '@/components/shared/BrandCard';
import { GROUP_BRANDS } from '@/content/brands';

export function Ecosystem() {
  const t = useTranslations('home.ecosistema');

  return (
    <section id="ecosistema" className="section surface-white">
      {/* La otra superficie clara grande de la Home: sin esto el tratamiento
          del hero quedaba como una excepción. */}
      <Atmosphere />

      {/* Texto a un lado, tira de tarjetas al otro (referencia del cliente):
          la sección pasa de apilar cabecera + rejilla + nota + botones a una
          sola banda, y baja de ~750px a ~500. */}
      <div className="container eco-layout">
        {/* Entrada texto → desfile. Reveal ES el item de la rejilla: lleva la
            clase del div al que sustituye. */}
        <Reveal className="eco-intro">
          <p className="eyebrow">{t('kicker')}</p>
          <h2>{t('title')}</h2>
          <p className="lead">{t('subtitle')}</p>
          <div className="btn-row">
            <Link href="/nosotros" className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <Link href="/contacto" className="btn btn-outline-black">
              {t('ctaSecondary')}
            </Link>
          </div>
        </Reveal>

        {/* Carrusel circular: la pista lleva el juego de tarjetas DOS veces y
            se desplaza exactamente la mitad de su ancho, así el final de la
            primera copia coincide con el principio de la segunda y el bucle
            no tiene costura. Se detiene al pasar el cursor o al enfocar (las
            tarjetas enlazadas reciben el foco), y se queda quieto con
            `prefers-reduced-motion`. */}
        <Reveal className="eco-marquee" delay={120}>
          <div className="eco-track">
            {GROUP_BRANDS.map((b, i) => (
              <BrandCard key={b.name} brand={b} index={i} />
            ))}
            {GROUP_BRANDS.map((b, i) => (
              <BrandCard key={`${b.name}-bis`} brand={b} index={i} decorativa />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
