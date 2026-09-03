# Farmacovigilancia — verificación de aislamiento (3 sep 2026)

Regla de la junta: el canal de farmacovigilancia **no comparte componente,
action, endpoint, storage ni analytics de leads** con Contacto ni con nada
comercial, y su página **no lleva CTAs comerciales**. Esta es la comprobación,
hecha sobre `feat/ajustes-junta` con `grep` sobre `app/`, `components/` y
`lib/`.

## Qué es exclusivo del canal

| Pieza | Archivo | Comparte con Contacto |
|---|---|---|
| Página | `app/[locale]/farmacovigilancia/page.tsx` | No |
| Formulario | `components/forms/PvForm.tsx` | No (Contacto usa `ContactForm.tsx`) |
| Esquema de validación | `pvSchema` en `lib/schemas.ts` | No: mismo archivo, esquemas distintos; solo comparten las cifras `LIMITES` y la expresión de correo |
| Endpoint | `app/api/farmacovigilancia/route.ts` | No (Contacto usa `/api/contacto`) |
| Buzón de destino | `MAIL_TO_PV` | No (`MAIL_TO_CONTACT` es otro) |
| Respaldo en disco | `lib/pv-fallback.ts` → `.pv-reportes/huerfanos.jsonl` | No; Contacto no tiene respaldo. Directorio en `.gitignore` |
| Límite por IP | `lib/rate-limit.ts`, clave `pv:` | Módulo compartido, contadores separados (`contacto:` / `pv:`), ventana propia (8 envíos / 10 min) |
| Envío SMTP | `lib/mailer.ts` | Utilidad genérica de transporte; no guarda ni mezcla nada |
| Analytics de leads | — | **No existe ningún analytics en el sitio** (`gtag`, `dataLayer`, `plausible`, `posthog`, `hotjar`: 0 resultados) |

Ningún otro archivo importa `PvForm`, `pvSchema` ni `pv-fallback`.

## CTAs en la página

Los únicos enlaces y botones dentro de `<main>` en `/farmacovigilancia` son:

- «Enviar reporte» (el propio formulario);
- el correo `farmacovigilancia@gabame.com` (respaldo cuando el envío no sale,
  y `mailto:` ya escrito con el reporte si quedó guardado sin entregar);
- el aviso de privacidad (modal);
- «Volver al inicio».

No hay enlace a Contacto, al portal, a Promociones, a Farmacias ni a ninguna
área terapéutica. La cabecera y el pie son globales y salen en todas las
páginas: llevan los botones al portal y el menú; no son CTAs de la página.

Contacto sí deriva a Farmacovigilancia (bloque «¿Vas a notificar una
sospecha…?»): la regla prohíbe el sentido contrario, no este.

## Campos del formulario

El formulario existía antes de la junta y se conserva tal cual: notificador
(nombre, correo, teléfono opcional, tipo), producto sospechoso y descripción
libre. Los campos de la lista «si no existe» de la junta (iniciales/edad/sexo
del paciente, lote, fecha de inicio, desenlace) **no** están como campos
propios: hoy caben en la descripción. Añadirlos es trabajo aparte y afecta a
`PvForm`, `pvSchema`, la ruta y el correo; se deja anotado, no se hizo.

No hay teléfono de farmacovigilancia en la página porque el cliente no ha
dado uno; solo el correo.

## Único cambio de código en este bloque

En el commit del fondo inmersivo (sección A) el aviso «Este no es un canal de
urgencias» perdió la clase `surface-blue`, que nunca lo pintaba (su fondo lo
pone `.notice-card`) y que con la tinta blanca del fondo nuevo lo habría
dejado ilegible. Nada más se tocó en el canal.
