'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type * as MapLibre from 'maplibre-gl';

/**
 * Mapa mínimo sobre MapLibre GL, con la misma forma de API que `mapcn`
 * (<Map center zoom><MapMarker longitude latitude/></Map>) para que su
 * archivo completo pueda sustituir a este sin tocar a quien lo usa.
 *
 * Difiere de mapcn en tres cosas, todas deliberadas:
 *
 * - **Teselas**: mapcn usa CARTO por defecto, y el uso comercial exige
 *   licencia Enterprise. Aquí van las de OpenFreeMap (gratuitas, uso
 *   comercial permitido, sin clave). Cualquier estilo compatible con MapLibre
 *   entra por `mapStyle`.
 * - **Carga diferida**: el motor pesa ~250 KB gz. No se importa hasta que el
 *   contenedor entra en pantalla, así ninguna página lo paga al abrir.
 * - **Sin interacción por defecto**: un mapa que captura la rueda del ratón
 *   dentro del pie secuestra el scroll de la página. Se activa con
 *   `interactive` cuando haga falta.
 */

/* Estilos de OpenFreeMap. `dark` es monocromo de fábrica (grises puros, sin
   un solo tono): entra en la paleta sin filtros. `positron` es el claro
   equivalente. */
export const MAP_STYLES = {
  dark: 'https://tiles.openfreemap.org/styles/dark',
  light: 'https://tiles.openfreemap.org/styles/positron',
} as const;

const MapCtx = createContext<MapLibre.Map | null>(null);

export function Map({
  center,
  zoom = 14,
  mapStyle = MAP_STYLES.dark,
  interactive = false,
  className,
  children,
}: {
  center: [number, number];
  zoom?: number;
  mapStyle?: string;
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre.Map | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    let instance: MapLibre.Map | null = null;
    let cancelado = false;

    const montar = async () => {
      const lib = await import('maplibre-gl');
      if (cancelado) return;
      // MapLibre 6 deduce la URL de su worker de `import.meta.url`; con
      // webpack eso no es servible y el mapa se queda sin teselas SIN error.
      // El worker se sirve como estático (ver `scripts/copy-maplibre-worker`).
      lib.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
      instance = new lib.Map({
        container: el,
        style: mapStyle,
        center,
        zoom,
        interactive,
        attributionControl: { compact: true },
      });
      // Los estilos de OpenFreeMap piden algún patrón de sprite que no
      // traen (p. ej. `wood-pattern`); MapLibre lo avisa en consola en cada
      // carga. Se resuelve con un píxel transparente y la consola queda
      // limpia para lo que sí importa.
      instance.setMissingStyleImageResolver((id) => {
        if (!instance || instance.hasImage(id)) return;
        instance.addImage(id, { width: 1, height: 1, data: new Uint8Array(4) });
      });
      setMap(instance);
    };

    // Solo cuando se ve: el pie está al final de todas las páginas.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void montar();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);

    return () => {
      cancelado = true;
      io.disconnect();
      instance?.remove();
      setMap(null);
    };
    // El mapa se crea una vez; cambiar centro/zoom después es un `flyTo`,
    // no una recreación. Para este uso (pin fijo) no hace falta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={box} className={className}>
      <MapCtx.Provider value={map}>{map ? children : null}</MapCtx.Provider>
    </div>
  );
}

export function MapMarker({
  longitude,
  latitude,
  children,
}: {
  longitude: number;
  latitude: number;
  /** Elemento propio para el pin. Sin él, el marcador nativo de MapLibre. */
  children?: ReactNode;
}) {
  const map = useContext(MapCtx);
  // El nodo del pin lo crea este componente y lo mueve MapLibre; React pinta
  // dentro por portal. Si React fuera el dueño del nodo, MapLibre lo sacaría
  // de su sitio y React fallaría al desmontarlo (portal, como en mapcn).
  const [el] = useState(() =>
    typeof document !== 'undefined' ? document.createElement('div') : null,
  );

  useEffect(() => {
    if (!map || !el) return;
    let marker: MapLibre.Marker | null = null;
    let cancelado = false;
    void import('maplibre-gl').then((lib) => {
      if (cancelado) return;
      marker = new lib.Marker(children ? { element: el } : undefined)
        .setLngLat([longitude, latitude])
        .addTo(map);
    });
    return () => {
      cancelado = true;
      marker?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, el, longitude, latitude]);

  return children && el ? createPortal(children, el) : null;
}
