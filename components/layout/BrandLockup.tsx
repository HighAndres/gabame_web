/**
 * Lockup de marca: el símbolo hexagonal del cliente + el nombre compuesto en
 * Barlow Condensed.
 *
 * El símbolo se pinta con `mask-image` sobre un fondo `#3D89FD`: se usa solo el
 * canal alfa del PNG, así que la silueta es EXACTA la del cliente pero la tinta
 * es la de marca. El archivo original venía en azul acero (~#5B7FA8), un cuarto
 * color fuera de la paleta; y como PNG con el nombre incrustado, la bajada
 * «HUMAN HEALTH» dejaba de leerse por debajo de 56px.
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
