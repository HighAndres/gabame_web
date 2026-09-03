import Image from 'next/image';
import { Eye } from 'lucide-react';
import { HEALTHY_EYES_IMAGE } from '@/content/healthy-eyes';

/**
 * Visual de Healthy Eyes: la foto si existe; si no, el marco de media vacío
 * del sistema (trama diagonal, como el hueco del video que hubo aquí) con el
 * icono del área. Mismo componente en la Home y en la página del producto.
 */
export function HealthyEyesVisual({ className = '' }: { className?: string }) {
  return (
    <div className={`pf-frame he-frame ${className}`}>
      {HEALTHY_EYES_IMAGE ? (
        <Image
          src={HEALTHY_EYES_IMAGE.src}
          alt={HEALTHY_EYES_IMAGE.alt}
          fill
          sizes="(max-width: 900px) 100vw, 40vw"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="pf-frame-slot" aria-hidden="true">
          <span className="pf-play he-mark">
            <Eye size={34} strokeWidth={1.75} />
          </span>
        </div>
      )}
    </div>
  );
}
