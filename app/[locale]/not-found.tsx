import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * 404 DENTRO de un idioma (`/es/loquesea`, `/en/whatever`).
 *
 * Vive bajo `[locale]`, así que hereda su layout: sale con cabecera, pie y las
 * tipografías del sitio, y el texto en el idioma de la URL. El 404 de la raíz
 * (`app/not-found.tsx`) queda solo para lo que cae fuera de los dos idiomas,
 * que es donde no hay idioma que elegir.
 */
export default function NotFoundLocale() {
  const t = useTranslations('notFound');

  return (
    <section className="section surface-black notfound">
      <div className="container notfound-inner">
        <p className="notfound-code">404</p>
        <h1>{t('title')}</h1>
        <p className="lead">{t('text')}</p>
        <div className="btn-row">
          <Link href="/" className="btn btn-blue">
            {t('cta')}
          </Link>
          <Link href="/contacto" className="btn btn-outline-white">
            {t('ctaContact')}
          </Link>
        </div>
      </div>
    </section>
  );
}
