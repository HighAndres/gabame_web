'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Video de portada.
 *
 * - Siempre hay póster: la portada pinta al instante en vez de arrancar en
 *   negro mientras se descargan los 2,6 MB del MP4.
 * - Con `prefers-reduced-motion` NO se reproduce: se queda el póster fijo.
 *   Un video en bucle a pantalla completa es justo lo que esa preferencia
 *   pide evitar, y CSS por sí solo no puede frenar el autoplay.
 * - El MP4 solo se carga si se va a reproducir.
 */
export function HeroVideo({ poster, src }: { poster: string; src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [animar, setAnimar] = useState(true);

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

  return (
    <video
      ref={video}
      poster={poster}
      src={animar ? src : undefined}
      autoPlay={animar}
      muted
      loop
      playsInline
      preload={animar ? 'metadata' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
