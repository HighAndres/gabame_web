import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';

/** Las cuatro marcas del grupo. GABAME activa; el resto, fase posterior. */
const BRANDS = [
  { name: 'GABAME', active: true },
  { name: 'Medinter', active: false },
  { name: 'Ordan', active: false },
  { name: 'A7', active: false },
] as const;

export function Ecosystem() {
  const t = useTranslations('home.ecosistema');

  /* Una tarjeta. `decorativa` marca la copia que hace el bucle: existe solo
     para que el desfile no tenga costura, así que no se anuncia dos veces. */
  const Card = ({
    brand,
    index,
    decorativa = false,
  }: {
    brand: (typeof BRANDS)[number];
    index: number;
    decorativa?: boolean;
  }) => (
    <div
      className={`eco-card ${brand.active ? 'eco-card-active' : 'eco-card-later'}`}
      aria-hidden={decorativa || undefined}
    >
      {/* Zona visual: la marca activa lleva su símbolo; las demás, la trama de
          «todavía no» con el ordinal. Cuando lleguen sus logotipos, entran
          aquí. */}
      <div className="eco-media" aria-hidden="true">
        {brand.active ? (
          <Image
            src="/media/logo_gabame_sf.png"
            alt=""
            width={600}
            height={600}
            className="eco-mark"
          />
        ) : (
          <span className="eco-num">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <div className="eco-body">
        <h3>{brand.name}</h3>
        <span className="eco-status">
          <span className="eco-dot" aria-hidden="true" />
          {brand.active ? t('statusActive') : t('statusLater')}
        </span>
      </div>
    </div>
  );

  return (
    <section id="ecosistema" className="section surface-white">
      {/* La otra superficie clara grande de la Home: sin esto el tratamiento
          del hero quedaba como una excepción. */}
      <Atmosphere />

      {/* Texto a un lado, tira de tarjetas al otro (referencia del cliente):
          la sección pasa de apilar cabecera + rejilla + nota + botones a una
          sola banda, y baja de ~750px a ~500. */}
      <div className="container eco-layout">
        <div className="eco-intro">
          <p className="eyebrow">{t('kicker')}</p>
          <h2>{t('title')}</h2>
          <p className="lead">{t('subtitle')}</p>
          <p className="note">{t('note')}</p>
          <div className="btn-row">
            <Link href="/nosotros" className="btn btn-blue">
              {t('ctaPrimary')}
            </Link>
            <Link href="/contacto" className="btn btn-outline-black">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Carrusel circular: la pista lleva el juego de tarjetas DOS veces y
            se desplaza exactamente la mitad de su ancho, así el final de la
            primera copia coincide con el principio de la segunda y el bucle
            no tiene costura. Se detiene al pasar el cursor o al enfocar, y se
            queda quieto con `prefers-reduced-motion`. */}
        <div className="eco-marquee">
          <div className="eco-track">
            {BRANDS.map((b, i) => (
              <Card key={b.name} brand={b} index={i} />
            ))}
            {BRANDS.map((b, i) => (
              <Card key={`${b.name}-bis`} brand={b} index={i} decorativa />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
