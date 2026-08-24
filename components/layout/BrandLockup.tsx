/**
 * Lockup de marca: el símbolo hexagonal del cliente + el nombre compuesto en
 * Cinzel (la serif lapidaria del logotipo aprobado en ago-2026 — render en
 * `_assets_originales/logo_gabame_render_2026.jpg`).
 *
 * El símbolo se pinta con `mask-image` sobre un fondo `#3D89FD`: se usa solo el
 * canal alfa del PNG, así que la silueta es EXACTA la del cliente pero la tinta
 * es la de marca. El nombre va en HTML y no como imagen porque en el logotipo
 * «GABAME» es azul marino, ilegible sobre los fondos oscuros del sitio: aquí
 * la jerarquía se invierte (nombre blanco, bajada azul) sin salir de paleta.
 *
 * `variant="mark"` deja solo el símbolo (para el pie o espacios estrechos).
 */
export function BrandLockup({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'mark';
  className?: string;
}) {
  return (
    <span className={`lockup${className ? ` ${className}` : ''}`}>
      <span className="lockup-mark" aria-hidden="true" />
      {variant === 'full' && (
        <span className="lockup-words">
          <span className="lockup-name">GABAME</span>
          <span className="lockup-tag">Human Health</span>
        </span>
      )}
    </span>
  );
}
