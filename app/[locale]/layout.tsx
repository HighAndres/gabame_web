import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { AssistantButton } from '@/components/assistant/AssistantButton';
import '../globals.css';

// Fuentes aprobadas: Barlow Condensed (títulos/nav) + Inter (cuerpo).
const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: '%s · GABAME Human Health',
    },
    description: t('description'),
    icons: {
      icon: [
        { url: '/media/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/media/favicon.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/media/favicon.png',
      apple: [{ url: '/media/apple-icon.png', sizes: '180x180' }],
    },
    ...pageMetadata({
      locale,
      title: t('title'),
      description: t('description'),
    }),
    // Base en construcción: no indexar hasta que el concepto esté aprobado.
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          {/* `tabIndex={-1}`: sin esto el enlace «Saltar al contenido» solo
              desplazaba la página —el foco se quedaba en el `body`— y el
              siguiente tabulador devolvía al usuario a la cabecera, que es
              justo lo que el enlace existe para saltar. */}
          <main id="contenido" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <AssistantButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
