import type { ReactNode } from 'react';
import { Atmosphere } from '@/components/shared/Atmosphere';

/**
 * Cabecera de página interna. `tone` fija la superficie: azul o negra.
 *
 * Cada superficie lleva su tono de atmósfera: sobre negro, auroras azules;
 * sobre azul, luz blanca y sombra negra, porque el azul sobre azul no se ve.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  tone = 'blue',
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: 'blue' | 'black';
  children?: ReactNode;
}) {
  return (
    <section
      className={`section ${tone === 'blue' ? 'surface-blue' : 'surface-black'}`}
    >
      <Atmosphere tone={tone === 'black' ? 'dark' : 'blue'} />

      <div className="container">
        <p
          className="eyebrow"
          style={tone === 'black' ? { color: 'var(--blue)' } : undefined}
        >
          {eyebrow}
        </p>
        <h1 style={{ marginTop: 14 }}>{title}</h1>
        {subtitle && (
          <p className="lead" style={{ marginTop: 20 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
