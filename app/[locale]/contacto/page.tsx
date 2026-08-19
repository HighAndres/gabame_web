import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { ContactForm } from '@/components/forms/ContactForm';
import { buildAlternates } from '@/lib/seo';
import { CONTACT } from '@/lib/nav';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'home.contacto',
  });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: buildAlternates(params.locale, 'contacto'),
  };
}

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <ContactBody />;
}

function ContactBody() {
  const t = useTranslations('home.contacto');
  const tForm = useTranslations('contactForm');

  const rows = [
    {
      icon: <Phone size={20} aria-hidden="true" />,
      k: t('phoneLabel'),
      v: t('phone'),
      href: `tel:${CONTACT.phoneHref}`,
    },
    {
      icon: <Mail size={20} aria-hidden="true" />,
      k: t('emailLabel'),
      v: t('email'),
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: <Clock size={20} aria-hidden="true" />,
      k: t('hoursLabel'),
      v: t('hours'),
    },
    {
      icon: <MapPin size={20} aria-hidden="true" />,
      k: t('addressLabel'),
      v: t('address'),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Superficie oscura, como el bloque de contacto del sitio v1. */}
      <section className="section surface-black form-v1">
        <Atmosphere tone="dark" />

        <div className="container form-layout">
          <div>
            <ul className="contact-info">
              {rows.map((r) => (
                <li key={r.k} className="contact-item">
                  <span className="ic">{r.icon}</span>
                  <span className="tx">
                    <span className="k">{r.k}</span>
                    {r.href ? (
                      <a className="v" href={r.href}>
                        {r.v}
                      </a>
                    ) : (
                      <span className="v">{r.v}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* Deriva las sospechas de RAM al canal correcto. */}
            <div className="pv-redirect" style={{ marginTop: 40 }}>
              <p className="lead">{tForm('pvRedirect')}</p>
              <Link
                href="/farmacovigilancia"
                className="btn btn-blue"
                style={{ marginTop: 18 }}
              >
                {tForm('pvRedirectCta')}
              </Link>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
