import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { HcpGate } from '@/components/medicos/HcpGate';
import { MedicoForm } from '@/components/forms/MedicoForm';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.medicos',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'medicos',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

export default function MedicosPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <MedicosBody />;
}

/**
 * Espacio para profesionales de la salud. El sitio no tiene base de datos por
 * diseño, así que el «perfil médico» no es una cuenta con sesión: es un alta
 * —cédula y especialidad incluidas— que viaja por el mismo canal server-side
 * que los demás formularios y que el equipo valida a mano. El día que haya
 * cuentas de verdad, esta página ya es la puerta.
 *
 * Todo el bloque va tras `HcpGate`: la declaración de profesional se pide
 * antes de enseñar el contenido, que es el estándar del sector.
 */
function MedicosBody() {
  const t = useTranslations('medicos');

  return (
    <>
      <PageHero eyebrow={t('kicker')} title={t('title')} subtitle={t('subtitle')} />

      {/* Superficie oscura, como el bloque de contacto: mismo trato de canal. */}
      <section className="section surface-black form-v1">
        <Atmosphere tone="dark" />

        <div className="container">
          <HcpGate>
            <div className="form-layout">
              <div>
                <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                  {t('whatTitle')}
                </h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  {t('whatText')}
                </p>

                {/* Lo que activa el alta. Lista corta: son compromisos, no
                    marketing, y ninguno afirma nada pendiente de COFEPRIS. */}
                <ul className="medicos-benefits">
                  <li>{t('benefit1')}</li>
                  <li>{t('benefit2')}</li>
                  <li>{t('benefit3')}</li>
                </ul>

                <p className="note" style={{ marginTop: 28 }}>
                  {t('reviewNote')}
                </p>
              </div>

              <div>
                <h2 className="sr-only">{t('formTitle')}</h2>
                <MedicoForm />
              </div>
            </div>
          </HcpGate>
        </div>
      </section>
    </>
  );
}
