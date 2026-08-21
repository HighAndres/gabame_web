'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Video decorativo en bucle. Un solo componente para los dos del sitio.
 *
 * Tres reglas, y las tres existen por un motivo medido:
 *
 * 1. **Con `prefers-reduced-motion` NO se reproduce**: queda el póster (o, si
 *    no lo hay, el fondo del marco que lo contiene). Un video en bucle a
 *    pantalla completa es justo lo que esa preferencia pide evitar, y CSS por
 *    sí solo no puede frenar el autoplay.
 *
 * 2. **El MP4 solo se descarga si se va a reproducir.** `preload="metadata"`
 *    no basta: con `autoPlay` el navegador se lo baja entero igualmente.
 *
 * 3. **`lazy` difiere la descarga hasta que el video se acerca a pantalla.**
 *    La Home pesaba 6 MB, de los cuales 5,7 eran los dos videos, y el del
 *    portafolio (3 MB) está muy por debajo del pliegue: se descargaba entero
 *    en móvil aunque nadie bajara hasta él.
 *
 * Con `lazy`, si el JS no llega a correr el video no se carga nunca. Es
 * deliberado: esto es decoración —va `aria-hidden`— y el marco que lo aloja
 * tiene su propio fondo, así que no queda ningún hueco negro. El de la
 * portada NO es `lazy` por eso mismo: ahí sí se ve desde el primer píxel.
 */
export function AutoVideo({
  src,
  poster,
  lazy = false,
  className,
}: {
  src: string;
  poster?: string;
  /** Espera a que el video se acerque a pantalla para descargarlo. */
  lazy?: boolean;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [animar, setAnimar] = useState(true);
  const [cerca, setCerca] = useState(!lazy);

  // Preferencia de movimiento reducido, en vivo: si se cambia en el sistema
  // con la página abierta, el video se para.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      setAnimar(!mq.matches);
      if (mq.matches) video.current?.pause();
    };
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  // Carga diferida.
  useEffect(() => {
    if (!lazy) return;
    const el = video.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setCerca(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setCerca(true);
        io.disconnect();
      },
      // Un pantallazo de margen: llega cargado, no cargando.
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  const cargar = animar && cerca;

  return (
    <video
      ref={video}
      className={className}
      poster={poster}
      src={cargar ? src : undefined}
      autoPlay={cargar}
      muted
      loop
      playsInline
      preload={cargar ? 'metadata' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
