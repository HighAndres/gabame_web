import { Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';

/* Este 404 pinta su propio <html>, así que no hereda el de `[locale]/layout`:
   sin esto salía con la tipografía de respaldo del navegador. */
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

/**
 * 404 para rutas SIN idioma (fuera de /es y /en). Las que sí lo llevan las
 * atiende `app/[locale]/not-found.tsx`, que sale traducido y con el layout
 * completo; aquí no hay idioma que elegir, así que va en español.
 */
export default function NotFound() {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div>
            <h1 style={{ fontSize: 64, color: 'var(--blue)' }}>404</h1>
            <p style={{ color: 'var(--on-white)', marginTop: 12 }}>
              Página no encontrada.{' '}
              <a href="/es" style={{ color: 'var(--blue)' }}>
                Ir al inicio
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
