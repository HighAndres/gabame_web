'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useTranslations } from 'next-intl';
import { Map, MapMarker } from '@/components/ui/map';
import { CONTACT } from '@/lib/nav';

/**
 * Mini mapa del pie: dónde está la oficina, con salida a «cómo llegar».
 *
 * No es interactivo —un mapa que captura la rueda dentro del pie secuestra el
 * scroll— y el enlace de encima lo convierte en un botón grande a Google
 * Maps, que es lo que la gente hace con un mapa pequeño de todas formas.
 *
 * Estilo `dark` de OpenFreeMap: monocromo de fábrica, entra en la paleta.
 */
export function FooterMap() {
  const t = useTranslations('footer');
  const { center, zoom, directionsUrl } = CONTACT.map;

  return (
    <div className="footer-map">
      <Map center={center} zoom={zoom} className="footer-map-canvas">
        <MapMarker longitude={center[0]} latitude={center[1]}>
          <span className="footer-map-pin" aria-hidden="true" />
        </MapMarker>
      </Map>
      <a
        className="footer-map-link"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{t('directions')}</span>
      </a>
    </div>
  );
}
