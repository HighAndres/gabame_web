# GABAME Human Health — sitio (gabame_v2)

Implementación del diseño v9 sobre Next 14. Estructura completa en local: 5
páginas × 2 idiomas, cabecera y pie globales, dos formularios con su API,
sitemap y robots.

## Comandos

```bash
npm install
npm run dev
```

`http://localhost:3010` (puerto propio, no choca con `gabame_principal`).

```bash
npm run build && npm start
```

> En dev, espera a que termine la hidratación antes de hacer clic: el primer
> compilado tarda unos segundos y los clics anteriores no responden.

## Dónde se edita cada cosa

**Todo el texto vive en `i18n/messages/es.json` y `en.json`.** Ningún componente
tiene copy escrito a mano: si cambias una frase, cámbiala ahí y aparece en las
dos versiones del sitio.

### Home — `app/[locale]/page.tsx`

| Sección | Componente | Claves i18n |
|---|---|---|
| Portada (video + panel azul + cifras) | `components/home/Hero.tsx` | `home.hero`, `home.nosotros.stats` |
| Áreas terapéuticas | `components/home/Areas.tsx` | `home.areas`, `productos.areaBlurb` |
| Portafolio Rx | `components/home/Portfolio.tsx` | `home.portafolio` |
| Nosotros | `components/home/About.tsx` | `home.nosotros` |
| Ecosistema | `components/home/Ecosystem.tsx` | `home.ecosistema` |
| Socios + farmacovigilancia | `components/home/Partners.tsx` | `home.socios` |

Para reordenar las secciones, cambia el orden en `app/[locale]/page.tsx`.

### Páginas

| Ruta | Archivo | Claves i18n |
|---|---|---|
| `/[locale]/portafolio` | `app/[locale]/portafolio/page.tsx` | `productos` |
| `/[locale]/nosotros` | `app/[locale]/nosotros/page.tsx` | `nosotros` |
| `/[locale]/farmacovigilancia` | `app/[locale]/farmacovigilancia/page.tsx` | `farmacovigilancia` |
| `/[locale]/contacto` | `app/[locale]/contacto/page.tsx` | `home.contacto`, `contactForm` |

### Globales

- Cabecera: `components/layout/SiteHeader.tsx` · menú en `lib/nav.ts`
- Pie: `components/layout/Footer.tsx`
- Aviso de privacidad (modal): `components/legal/PrivacyModal.tsx`, texto en
  `content/legal.ts`
- Asistente (placeholder): `components/assistant/AssistantButton.tsx`
- Sistema visual completo: `app/globals.css`

### Datos

- `content/products.ts` — portafolio. **Vacío a propósito**: sin validación
  COFEPRIS no se publican marcas, moléculas ni posología. Al llenarlo, las
  fichas aparecen solas en `/portafolio` y desaparece el estado «en preparación».
- `content/media.ts` — inventario de la media del cliente.
- `lib/nav.ts` — rutas, menú y datos de contacto.

## Sistema visual

- **Paleta de tres valores**: `#3D89FD`, negro, blanco. Todo gris o profundidad
  sale de `rgba()` de esos tres. El gris por defecto de Tailwind está anulado en
  `tailwind.config.ts` para que ningún borde se escape de la paleta.
- **El azul domina**: 37,7% de la superficie de la Home, contra 42,5% de negro y
  19,7% de blanco.
- **Sobre azul, el texto va en negro** (6,19:1, AA a cualquier tamaño). Blanco
  sobre azul es 2,6:1 y no pasa: no usarlo para texto.
- **Tipografías**: Barlow Condensed (titulares, nav, etiquetas, cifras) + Inter
  (cuerpo). Son las aprobadas con el cliente.
- Esquinas rectas, sin sombras, filetes de 2 y 6px. Un solo tema.
- **Atmósfera** (`components/shared/Atmosphere.tsx`): dos manchas a la deriva,
  heredadas del v1, en tres tonos. `light` y `dark` son auroras **azules**
  sobre claro y sobre negro. `blue` va sobre el propio color de marca, donde el
  azul no se vería: ahí la profundidad se hace con **luz blanca y sombra
  negra**.
  El tono `blue` tiene un presupuesto de contraste que hay que respetar al
  tocarlo: sobre azul el texto va en negro, así que **aclarar sube el contraste
  y oscurecer lo baja**, y un velo del 18% ya rompe AA (4,37:1). Por eso la
  mancha grande que se mueve es la blanca. Medido en lo pintado, no en lo
  declarado: el azul recorre de 5,12:1 a 9,64:1 en las cinco superficies.
  La sección que la aloje necesita `position: relative`; para
  `.section > .container` ya está resuelto en `globals.css`.

Comprobación de paleta antes de cada entrega:

```bash
grep -rnE "#(?!3[Dd]89[Ff][Dd]\b)[0-9A-Fa-f]{3,8}\b" app components lib
```

## Mapa del pie

`components/ui/map.tsx` es un envoltorio mínimo de **MapLibre GL** con la
misma API que [mapcn](https://github.com/AnmolSaini16/mapcn)
(`<Map center zoom><MapMarker/></Map>`); su archivo completo puede sustituirlo
sin tocar a quien lo usa. Diferencias deliberadas:

- **Teselas de OpenFreeMap** (`styles/dark`, monocromo de fábrica) en vez de
  CARTO: las de CARTO exigen licencia Enterprise para uso comercial.
- **Carga diferida**: el motor (~250 KB gz) no se importa hasta que el pie
  entra en pantalla.
- **Worker como estático.** MapLibre 6 deduce la URL de su worker de
  `import.meta.url` y con webpack eso no es servible: el mapa se queda sin
  teselas **sin ningún error en consola**. `scripts/copy-maplibre-worker.mjs`
  (corre en `postinstall`) copia el worker a `public/vendor/maplibre/` y el
  componente lo declara con `setWorkerUrl`. Si el mapa sale vacío, mirar ahí
  primero.

**⚠ Las coordenadas del pin son PROVISIONALES** (`CONTACT.map` en
`lib/nav.ts`): el número de Av. de la Palma no está geocodificado en OSM y el
pin está en el centro de la zona. Sustituir por las exactas del cliente.

## Formularios

Dos canales **separados**, cada uno con su destino:

- `/api/contacto` → `MAIL_TO_CONTACT`
- `/api/farmacovigilancia` → `MAIL_TO_PV`

Ambos validan con zod en el servidor, llevan honeypot anti-spam y muestran el
aviso de privacidad en el punto de recolección (LFPDPPP). Si faltan las
variables SMTP responden 503 y la interfaz enseña el correo de respaldo en vez
de fallar en silencio. Ver `.env.example`.

**Los dos comparten presentación y comportamiento**, y esa es la regla a
mantener: tarjeta `.form-card`, campos emparejados en `.form-row`, validación
en línea por campo en el cliente ANTES de tocar el servidor (con `noValidate`,
para que los mensajes salgan en el idioma del sitio y no en el del sistema
operativo), botón a todo el ancho y aviso de privacidad cerrando la tarjeta.

El tratamiento visual es `.form-v1` en la sección que los contiene. Sus
rellenos y filetes van en variables (`--fill`, `--hairline`, `--placeholder`)
que se redefinen por superficie, así el mismo CSS sirve sobre negro (contacto)
y sobre claro (farmacovigilancia). Los radios (`--r-card`, `--r-field`,
`--r-tile`) son locales de este bloque: el resto del sistema sigue con esquinas
rectas.

## Estado

- Copy real del cliente en ES y EN, sin datos inventados.
- Pendiente del cliente: texto legal definitivo del aviso de privacidad,
  fotografía de equipo e instalaciones, SVG de redes sociales, y el lockup en
  `#3D89FD` (el actual es azul acero, fuera de paleta).
- `robots.ts` bloquea la indexación. **Al publicar en gabame.com hay que
  permitirla** y fijar `NEXT_PUBLIC_SITE_URL`.

## Referencia

- `docs/design-v9/` — prototipo original de Claude Design.
- `docs/REVISION-DISENO-V9.md` — revisión del prototipo y qué se corrigió.
- `docs/PROMPT-CLAUDE-DESIGN.md` — brief que lo generó.
