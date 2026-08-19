import './globals.css';

/** 404 para rutas sin idioma (fuera de /es y /en). */
export default function NotFound() {
  return (
    <html lang="es">
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
            <p style={{ color: 'var(--fg-muted)', marginTop: 12 }}>
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
