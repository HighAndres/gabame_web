# Pendientes marcados en el código (3 sep 2026)

Todo lo que el sitio enseña o guarda como placeholder, por archivo. Se
regenera con:

```bash
grep -rnoE '\[(PENDIENTE|PENDING|SUJETO A VALIDACIÓN REGULATORIA|SUBJECT TO REGULATORY VALIDATION)[^]]*\]' app components content lib i18n --include='*.ts' --include='*.tsx' --include='*.json'
```

Los marcadores **se pintan a la vista** en la Home (no: la franja de Farmacias
los oculta), en las páginas de área, en Healthy Eyes, en Promociones y en el
aviso de privacidad. Es a propósito: el cliente tiene que ver dónde falta su
texto. En cuanto llegue cada copy, se sustituye la cadena y el marcador
desaparece solo.

## `[SUJETO A VALIDACIÓN REGULATORIA]` — copy que valida el área regulatoria

| Archivo | Clave / línea | Qué falta |
|---|---|---|
| `i18n/messages/es.json`, `en.json` | `home.healthyEyes.subtitle` | Frase del bloque destacado de la Home |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.subtitle` | Bajada de la página |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.whatIsText` | Qué es (lenguaje general) |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.useText` | Para qué se usa (uso previsto del registro) |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.presentationText` | Presentación comercial |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.howToText` | Modo de uso resumido |
| `i18n/messages/es.json`, `en.json` | `healthyEyes.regulatoryNote` | Registro sanitario y leyendas del empaque |

## `[PENDIENTE: copy área médica]` — intro de cada área terapéutica

| Archivo | Clave | Qué falta |
|---|---|---|
| `i18n/messages/es.json`, `en.json` | `areas.list.cardiometabolico.intro` | 2–3 líneas de posicionamiento general, sin datos clínicos |
| ídem | `areas.list.oncologia.intro` | ídem |
| ídem | `areas.list.hospitalario.intro` | ídem |
| ídem | `areas.list.urologia.intro` | ídem |
| ídem | `areas.list.snc.intro` | ídem |
| ídem | `areas.list.oftalmologia.intro` | ídem |

Se pintan en `/areas-terapeuticas/[slug]`, bajo «Sobre el área».

## `[PENDIENTE]` — datos y media que entrega GABAME

| Archivo | Dónde | Qué falta |
|---|---|---|
| `content/areas.ts` | `AREAS[*].brands` | Nombres de marca aprobados por área (solo se enseñan con `NEXT_PUBLIC_SHOW_BRAND_NAMES=true`) |
| `content/healthy-eyes.ts` | `WHERE_TO_FIND` | Cadenas participantes y sus enlaces (dos entradas placeholder) |
| `content/healthy-eyes.ts` | `HEALTHY_EYES_IMAGE` | Fotografía de presentación aprobada (hoy `null` → marco vacío) |
| `content/promociones.json` | `promos[*].mechanics` | Redacción final de cada dinámica (es/en) |
| `content/promociones.json` | `promos[*].brands` | Marcas participantes y sus logotipos |
| `content/promociones.json` | `promos[*].chains` | Cadenas participantes |
| `content/promociones.json` | `promos[*].legal` | Legales completos (es/en) |
| `content/media.ts` | `heroImage` | Fotografía definitiva de portada 16:9 (hoy el fotograma del video) |
| `content/legal.ts` | secciones 2–8 del aviso | Texto legal definitivo (LFPDPPP), ES y EN. `pending: true` mientras tanto |
| `i18n/messages/*.json` | `home.farmacias.kicker`, `home.farmacias.subtitle` | Bajada y frase de Farmacias GABAME (anteriores a la junta; no se pintan mientras empiecen por «[») |

## Decisiones que quedan para el cliente

- **Tema del fondo inmersivo**: `a` (azul-noche) o `b` (gris azulado).
  `NEXT_PUBLIC_THEME` en el entorno; los valores viven en `:root` de
  `app/globals.css`.
- **Portal**: cuando exista, `PORTAL_URL` en `lib/nav.ts` pasa de
  `/proximamente` a `PORTAL_URL_DEFINITIVA`.
- **Farmacovigilancia**: campos de paciente, lote, fecha de inicio y desenlace
  (ver `docs/FARMACOVIGILANCIA.md`) y teléfono de reporte.
- **Pin del mapa** del pie: coordenadas exactas (`CONTACT.map` en `lib/nav.ts`,
  pendiente desde antes de la junta).
- **Indexación**: `robots.ts` y el layout siguen en `noindex`; se abre al
  publicar en gabame.com.
