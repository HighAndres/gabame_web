'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Entrada al llegar a pantalla, genérica: el mismo patrón de la franja de
 * farmacias (ver la nota larga en `Pharmacies.tsx`) hecho pieza reutilizable.
 *
 * Las reglas no se negocian:
 * - QUIEN ESCONDE ES EL JS. Sin JS no hay `is-armed` y no hay nada escondido.
 * - Lo que ya está en pantalla al montar no se esconde: entra puesto.
 * - Si el observador no dispara en 3s, se destapa igual.
 * - El movimiento es una TRANSICIÓN (salta al estado final si no corre) y se
 *   apaga entera con `prefers-reduced-motion` en `globals.css`.
 *
 * `className` se fija al propio contenedor: `<Reveal className="section-head">`
 * ocupa en la maquetación el lugar exacto del `<div>` al que sustituye, así
 * ninguna rejilla gana envoltorios de más. `delay` (ms) escalona hermanos y
 * solo actúa al destapar, nunca al esconder.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<'quieto' | 'armado' | 'dentro'>('quieto');

  useEffect(() => {
    const el = caja.current;
    if (!el || !('IntersectionObserver' in window)) {
      setEstado('dentro');
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setEstado('dentro');
      return;
    }

    setEstado('armado');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setEstado('dentro');
        io.disconnect();
      },
      // Que arranque cuando ya se ve de verdad, no al asomar el primer píxel.
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);

    const red = setTimeout(() => setEstado('dentro'), 3000);
    return () => {
      clearTimeout(red);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={caja}
      className={`reveal${estado !== 'quieto' ? ' is-armed' : ''}${
        estado === 'dentro' ? ' is-in' : ''
      }${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
