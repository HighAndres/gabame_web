import { Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { NAV, CONTACT } from '@/lib/nav';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { BrandLockup } from './BrandLockup';
import { FooterMap } from './FooterMap';

/**
 * Pie global: marca y redes, contacto, mapa del sitio y legal.
 *
 * Una columna por bloque. Antes «Sitio» y «Legal» compartían columna —siete
 * enlaces apilados— mientras la de marca se quedaba vacía en un 40%, y las
 * redes vivían solas en la cuarta con el horario repetido debajo.
 */
export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="site-footer">
      <Atmosphere tone="dark" />

      <div className="container">
        {/* Fila principal: el mapa es el ancla de la izquierda y ocupa toda la
            altura; a su lado, contacto, sitio y legal. Con el mapa dentro de
            la columna de contacto esa columna medía el doble que las otras y
            el pie quedaba cojo. */}
        <div className="footer-grid">
          <FooterMap />

          <div>
            <h4>{t('contactTitle')}</h4>
            <div className="footer-list">
              <a href={`tel:${CONTACT.phoneHref}`}>{t('phone')}</a>
              <a href={`mailto:${CONTACT.email}`}>{t('email')}</a>
              {/* El horario vive AQUÍ y solo aquí: la columna de redes lo
                  repetía con su propio título y otra redacción. */}
              <span>{t('hours')}</span>
              <span>{t('address')}</span>
            </div>
          </div>

          <div>
            <h4>{t('linksTitle')}</h4>
            <div className="footer-list">
              {NAV.filter((i) => !i.anchor).map((i) => (
                <Link key={i.key} href={i.href}>
                  {tNav(i.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>{t('legalTitle')}</h4>
            <div className="footer-list">
              <PrivacyModal
                className="footer-privacy-link"
                // El botón hereda el aspecto de enlace del pie
              />
              <Link href="/farmacovigilancia">{t('pharmacovigilance')}</Link>
              <span>
                {t('clientPortal')} · {t('comingSoon')}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de cierre en dos líneas a propósito: marca y redes se miran
            en la primera; el copyright, que es letra pequeña, va solo debajo.
            Las tres piezas en una línea no caben en 880px sin encoger algo. La
            marca ya no necesita columna propia —el lockup y una frase no
            llenan una— y aquí firma el pie, que es lo que hace un lockup al
            final. El eslogan («Grupo mexicano de salud desde 2013») ya no está
            en el pie: es literalmente la entradilla de la portada. */}
        <div className="footer-bottom">
          {/* Mismo lockup que la cabecera: una sola pieza de marca. */}
          <BrandLockup className="footer-lockup" />

          <span className="footer-social">
            <span className="footer-social-note">{t('socialPending')}</span>
            <a
              className="social-tile social-tile-active"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('linkedin')}
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
          </span>

          <span className="footer-rights">
            {t('rights', { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
}
