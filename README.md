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
| Franja Farmacias GABAME | `components/home/Pharmacies.tsx` | `home.farmacias` |
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
  A la derecha van el conmutador de idioma y el botón a **Farmacias
  GABAME** (`EXTERNAL.farmacias` en `lib/nav.ts`, hoy el preview tras
  autenticación básica). El botón late: halo con `outline` + pulso en dos
  tiempos, que se detiene al pasar el cursor, al enfocar y con
  `prefers-reduced-motion`. El teléfono ya NO está en la cabecera; vive en el
  pie y en `/contacto`.
- Pie: `components/layout/Footer.tsx`
- Aviso de privacidad (modal): `components/legal/PrivacyModal.tsx`, texto en
  `content/legal.ts`
- Asistente (placeholder): `components/assistant/AssistantButton.tsx`
- Sistema visual completo: `app/globals.css`

### Datos

### Franja de Farmacias GABAME

Banda estrecha entre la portada y Áreas, sobre negro (las dos piezas que la
rodean son azules y una tercera azul las fundiría). Enlaza fuera del sitio, a
`EXTERNAL.farmacias` en `lib/nav.ts`.

**⚠ `home.farmacias.kicker` y `home.farmacias.subtitle` están marcados como
`[PENDIENTE]` en los dos idiomas.** El título y el botón sí son definitivos: no
afirman nada que haya que validar. Al llegar el texto del cliente se sustituyen
esas dos claves y ya.

Animaciones, todas apagadas con `prefers-reduced-motion`:

- Entrada escalonada (cruz → texto → botón) al llegar a pantalla, una sola vez,
  con `IntersectionObserver`.
- La cruz entra girada 45° —una equis— y se endereza.
- La cruz late con el halo de `outline` del sistema, a 3,4s: distinto del botón
  de la cabecera (2,6s) y del lanzador del asistente (2,8s), a propósito.

El estado escondido lo enciende el **componente**, nunca el CSS, y la entrada
es una **transición**, no una `animation`. Las dos cosas por lo mismo: que no
exista ningún camino —JS caído, observador que no dispara, animación que no
avanza— por el que la franja pueda quedarse invisible.

Ese mismo patrón, hecho pieza reutilizable, es
`components/shared/Reveal.tsx`: las secciones de la Home y las de `/nosotros`
entran con él al llegar a pantalla (suben 14px y se asientan, escalonadas con
`delay`). `<Reveal className="section-head">` ocupa en la maquetación el lugar
exacto del `div` al que sustituye, así ninguna rejilla gana envoltorios. Lo que
ya está en pantalla al cargar entra puesto, y todo se apaga con
`prefers-reduced-motion`.

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
  (cuerpo). Son las aprobadas con el cliente. Cinzel se usa SOLO en el lockup
  de marca (es la serif del logotipo definitivo de ago-2026; máster en
  `_assets_originales/logo_gabame_render_2026.jpg`, assets derivados con
  `scripts/derive-brand-assets.mjs`).
- **La caja alta es de etiqueta, no de lectura** (ago 2026). Titulares, nav y
  botones van en caja alta y baja; las mayúsculas se quedan en `.eyebrow`,
  `.stat-label`, `.field-label`, `.chip`, `.eco-status`, los `h4` del pie y el
  lockup. Antes iba en mayúsculas entre el 47% y el 61% de los nodos de texto
  de cada página; hoy, entre el 18% y el 26%. La regla vive en `globals.css`,
  en el bloque de `h1…h4`.
- **Dos formas y ninguna más**: pastilla (`--r-btn`/`--r-chip`, 999px) para
  botones, chips y conmutadores; **recto (0)** para toda superficie —secciones,
  tarjetas, campos, tablas—. Llegaron a convivir seis radios distintos (0, 10,
  12, 14, 18 y 999): las tarjetas del ecosistema y los formularios parecían de
  otro sistema. Los tokens locales (`--r-eco`, `--r-card`, `--r-field`,
  `--r-tile`) siguen existiendo, valen 0, y devolverles 14/18/10/12px revierte
  el cambio en una línea.
- Sin sombras, filetes de 2 y 6px. Un solo tema.
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
grep -rnEi "#(?!3d89fd\b|fff\b|ffffff\b|000\b|000000\b)[0-9a-f]{3,8}\b" app components lib
```

La versión anterior de este grep marcaba `#fff` y `#000` como violaciones
cuando son dos de los tres valores de la paleta: devolvía decenas de falsos
positivos, y por eso no lo miraba nadie. Con la corrección, hoy no devuelve
nada.

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

**Límite de envíos** (`lib/rate-limit.ts`): 5 por IP cada 10 min en contacto, 8
en farmacovigilancia. El honeypot solo frena bots ingenuos y los dos endpoints
son relés a correo: sin límite, un script inunda los buzones. El contador va
EN MEMORIA, así que se pierde al reiniciar y no se comparte entre procesos;
vale para el despliegue actual (un solo proceso Node) y hay que cambiarlo por
Redis el día que haya más de una instancia.

Un 503 por **falta de correo configurado NO gasta cupo** (`devolverGolpe`): el
envío no puede funcionar por mucho que se reintente, y como el formulario
invita a reintentar, el visitante quedaba bloqueado al tercer intento con un
«demasiados envíos desde esta conexión». Un fallo de SMTP de verdad (`failed`)
sí sigue contando: ahí hubo conexión y el siguiente intento puede funcionar. El
efecto secundario asumido es que, mientras no haya SMTP, ese endpoint acepta
peticiones sin tope —cuestan una validación y nada más, porque ni se abre
conexión de correo—; el día que haya SMTP, el límite vuelve a aplicarse entero.

⚠ El cupo es POR IP: detrás del NAT de un hospital o una distribuidora, esos 5
envíos son de todo el edificio.

**Respaldo de farmacovigilancia** (`lib/pv-fallback.ts`): si el envío falla, el
reporte se guarda en `PV_LOG_DIR` (por defecto `.pv-reportes/huerfanos.jsonl`)
y, si el disco no deja, en `stderr`. Antes se perdía: la ruta devolvía 502 y no
quedaba rastro en ningún lado, lo que para un canal de farmacovigilancia no es
una molestia sino un problema de trazabilidad (NOM-220).

**Y el notificador se entera de cuál de las dos le tocó.** Cuando el respaldo
llega a ARCHIVO, la ruta responde **202** con la hora de recepción en vez de un
error; el formulario enseña esa hora como acuse, **conserva lo escrito** y
ofrece un `mailto:` YA REDACTADO con el reporte completo. Hasta aquí las dos
situaciones se contaban igual —«no se pudo enviar»— y con un `mailto:` vacío:
quien acababa de describir una sospecha entendía que se había perdido y tenía
que redactarla otra vez, y muchos no lo harán.

Cuidado con lo que promete esa pantalla. El archivo **se recupera a mano y no
avisa a nadie**, así que dice «quedó registrado» y empuja al correo; no dice
«lo revisaremos». Si algún día hay aviso automático al equipo, ese es el
momento de cambiar el texto (`farmacovigilancia.form.storedNotice`). Si el
respaldo acabó en `stderr` no hay nada que prometer y sigue siendo un error.

La descripción del `mailto:` se recorta a 1.500 caracteres —los `mailto:`
largos los cortan algunos clientes— y cuando eso pasa el cuerpo lo dice; el
texto completo sigue en el formulario, en pantalla.
⚠ Ese archivo lleva datos personales SENSIBLES en claro. Está en `.gitignore`;
en el servidor hay que darle permisos restringidos, vaciarlo en cuanto el
reporte esté recuperado, e incluirlo en la política de retención.

Los mínimos y máximos de cada campo viven en `LIMITES` (`lib/schemas.ts`) y los
usan LOS DOS lados. Antes no coincidían —el cliente solo pedía «no vacío», el
servidor `min(2)` y `min(10)`—, así que un nombre de una letra pasaba la
validación en línea y volvía como error genérico sin decir qué campo era.

**Los dos comparten presentación y comportamiento**, y esa es la regla a
mantener: tarjeta `.form-card`, campos emparejados en `.form-row`, validación
en línea por campo en el cliente ANTES de tocar el servidor (con `noValidate`,
para que los mensajes salgan en el idioma del sitio y no en el del sistema
operativo), botón a todo el ancho y aviso de privacidad cerrando la tarjeta.

El tratamiento visual es `.form-v1` en la sección que los contiene. Sus
rellenos y filetes van en variables (`--fill`, `--hairline`, `--placeholder`)
que se redefinen por superficie, así el mismo CSS sirve sobre negro (contacto)
y sobre claro (farmacovigilancia). Los radios (`--r-card`, `--r-field`,
`--r-tile`) son locales de este bloque y hoy valen 0: el sistema tiene dos
formas, pastilla y recto.

## Despliegue (preview: gabame.mirmiapps.com)

**El build se hace en local y al VPS se sube el artefacto.** No hay repo ni
`npm install` en el servidor: `output: 'standalone'` produce una carpeta
autocontenida que se copia tal cual.

| | |
|---|---|
| Servidor | `andresadmin@69.6.207.137 -p 22022` |
| Directorio | `/var/www/gabame` |
| Proceso | pm2 `gabame` (id 3), `fork`, arranca `/var/www/gabame/server.js` |
| Puerto | 3007, y **`PORT` vive en el entorno de pm2**, no en un `.env` |
| nginx | `/etc/nginx/conf.d/gabame.mirmiapps.com.conf` |

`/media/` lo sirve nginx directo desde `/var/www/gabame/public/media/`, sin
pasar por Node.

### Preparar el paquete (en local)

```bash
NEXT_PUBLIC_SITE_URL=https://gabame.mirmiapps.com npm run build
```

**Esa variable tiene que estar EN EL BUILD, no en el arranque**: se hornea en el
bundle. Compilar sin ella deja las `og:image` y `og:url` apuntando a
`localhost:3010` y las tarjetas al compartir salen rotas.

Después hay que armar la carpeta a mano, porque `standalone` **no** copia solo
ni los estáticos ni `public/` — y sin ellos el sitio arranca pero sale sin CSS,
sin imágenes y sin videos:

```
gabame/                        <- contenido de .next/standalone/
gabame/.next/static/           <- copiado de .next/static/
gabame/public/                 <- copiado de public/
```

### Subir y reemplazar

```bash
scp -P 22022 gabame-v2.tar.gz andresadmin@69.6.207.137:~/
```

En el servidor, mismo patrón de siempre (renombrar el viejo, poner el nuevo):

```bash
cd ~ && tar -xzf gabame-v2.tar.gz   && sudo mv /var/www/gabame /var/www/gabame_old_$(date +%Y%m%d-%H%M)   && sudo mv ~/gabame /var/www/gabame   && sudo chown -R andresadmin:andresadmin /var/www/gabame   && pm2 restart gabame && pm2 logs gabame --lines 20 --nostream
```

La vuelta atrás es mover de nuevo el `gabame_old_…` y reiniciar pm2.

### Pendientes del servidor

- **No hay SMTP configurado** (`pm2 env 3` no tiene ninguna `SMTP_*` ni
  `MAIL_*`). Los dos formularios responden 503 desde el primer despliegue: la
  interfaz enseña el correo de respaldo, pero **no se ha entregado ni un
  mensaje**. Los reportes de farmacovigilancia que fallen quedan ahora en
  `/var/www/gabame/.pv-reportes/huerfanos.jsonl`.
- Al publicar en gabame.com, la indexación está bloqueada en **tres** sitios:
  `app/robots.ts`, el `robots:` de `app/[locale]/layout.tsx` y el
  `add_header X-Robots-Tag` del nginx.

## Seguridad y cabeceras

`next.config.mjs` sirve CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` y `Permissions-Policy`, y apaga `X-Powered-By`. Antes no salía
ninguna.

En la CSP, `'unsafe-inline'` es inevitable mientras haya `style={{…}}` en los
componentes y Next inyecte sus scripts de arranque así; `'unsafe-eval'` lo lleva
SOLO el modo desarrollo. Los únicos hosts externos permitidos son los del mapa
(`tiles.openfreemap.org`); las tipografías no necesitan a Google porque
`next/font` las descarga en el build y las sirve locales.

**El bloque de nginx tiene que pasar las cabeceras de proxy** (`X-Real-IP`,
`X-Forwarded-For`, `X-Forwarded-Proto`). Sin `X-Forwarded-Proto`, next-intl no
sabe que está detrás de TLS y emite los `Link` de hreflang como `http://`; sin
las de IP, el límite de envíos mete a todos los visitantes en el mismo cubo y
pasa de ser por IP a ser de 5 cada 10 minutos para todo el sitio. Aplicado en
el preview el 21-ago-2026; al montar gabame.com hay que repetirlo.

## Compartir en redes

`pageMetadata()` (`lib/seo.ts`) arma canonical, hreflang, Open Graph y Twitter
Card de cada página. La imagen es `public/media/og.png` (1200×630), que llevaba
en el repo desde el principio **sin que ninguna etiqueta la usara**: hasta ahora
no había ni un solo `og:*` y cada enlace compartido salía en gris.

`og:title` se pasa ya compuesto porque `title.template` solo actúa sobre
`<title>` y no lo hereda.

## Rendimiento

La Home pesaba 6,0 MB, de los cuales 5,7 eran los dos videos. Ahora pesa 2,7 MB
(medido sobre el build de producción). Qué cambió:

- `components/shared/AutoVideo.tsx` sustituye al antiguo `HeroVideo` y sirve a
  los dos videos. Respeta `prefers-reduced-motion` y **no descarga el MP4 si no
  se va a reproducir** (`preload="metadata"` no basta: con `autoPlay` el
  navegador se lo baja entero igual).
- El video del portafolio va `lazy`: son 3 MB muy por debajo del pliegue que se
  descargaban aunque nadie bajara hasta ahí. Mientras no carga se ve la trama
  diagonal de `.pf-frame`, que en este sistema ya significa «hueco de media».
- `sizes` en el símbolo del ecosistema y en el sello de Nosotros: se pintan a
  ~200px y Next servía la variante de 1200.

Sigue pendiente: `public/media/favicon.png` pesa 189 KB, y
`gabame_header.mp4` (2,6 MB), `gabame_header_poster.jpg` y `gabame_org_sf.png`
solo aparecen en el inventario de `content/media.ts` —no los renderiza nadie—
pero se despliegan igual.

**⚠ `sharp` no está en las dependencias y el despliegue es `standalone`.** Sin
él, el optimizador de imágenes de Next falla en producción (`'sharp' is
required to be installed in standalone mode`): las fotos se sirven sin
optimizar, y `sizes` deja de servir para nada. En el servidor no hay
`npm install`, así que no basta con instalarlo allí: o entra como dependencia
del proyecto **compilada para linux/x64** (el build se hace en local), o se
asume y se pone `images: { unoptimized: true }` en `next.config.mjs`, que para
este sitio —cuatro imágenes, ya comprimidas, servidas por nginx— es defendible.
Hay que decidirlo antes de publicar.

**⚠ `portafoliorx.mp4` no tiene póster.** Con `prefers-reduced-motion` el video
no se reproduce nunca, y sin póster el marco se queda vacío de forma
permanente: medio metro de negro en la Home para quien navegue con esa
preferencia. Se arregla con un fotograma:

```bash
ffmpeg -ss 1.5 -i public/media/portafoliorx.mp4 -frames:v 1 -q:v 4 \
  public/media/portafoliorx_poster.jpg
```

y pasándoselo al componente: `<AutoVideo src="…" poster="/media/portafoliorx_poster.jpg" lazy />`.

## Accesibilidad

- Los errores de cada campo se enlazan con `aria-describedby`, y al fallar el
  envío el foco salta al primer campo con problema. Cuando quien contesta es el
  SERVIDOR (enviado, 429, 503), el foco va al aviso: al pasar a «enviado» el
  formulario entero se sustituye por el mensaje y el botón que estaba enfocado
  desaparece, así que el foco caía en el `body`.
- **Trampa de foco** (`lib/focus-trap.ts`): las tres piezas que tapan la página
  —panel de menú, aviso de privacidad y panel del asistente— retienen el
  tabulador. Antes se escapaba al contenido de detrás, que está oculto a la
  vista pero sigue siendo enfocable. El hook acepta VARIAS zonas porque el
  botón de cerrar del menú vive en la cabecera, fuera del panel, y tiene que
  seguir siendo alcanzable.
- El enlace «Saltar al contenido» mueve el foco de verdad: `<main>` lleva
  `tabIndex={-1}`. Sin eso solo desplazaba la página y el siguiente tabulador
  devolvía a la cabecera.
- 404 traducido con el layout del sitio (`app/[locale]/not-found.tsx`, más el
  cazatodo que lo dispara). El de la raíz queda para lo que cae fuera de los dos
  idiomas.
- Los enlaces del pie tienen 44px de alto en móvil; medían 22.

## Estado

- Copy real del cliente en ES y EN, sin datos inventados.
- Pendiente del cliente: texto legal definitivo del aviso de privacidad,
  fotografía de equipo e instalaciones, SVG de redes sociales, y el lockup en
  `#3D89FD` (el actual es azul acero, fuera de paleta).
- `robots.ts` bloquea la indexación. **Al publicar en gabame.com hay que
  permitirla** y fijar `NEXT_PUBLIC_SITE_URL`. Ojo: el bloqueo está en DOS
  sitios, `app/robots.ts` y el `robots: { index: false }` de
  `generateMetadata` en `app/[locale]/layout.tsx`. Hay que quitarlo en los dos.
- **El aviso de privacidad sigue siendo un placeholder** (`content/legal.ts`) y
  el sitio ya recauda datos de salud por el formulario de farmacovigilancia,
  que bajo la LFPDPPP son datos sensibles. Es un bloqueante para publicar, no
  un pendiente más.

## Referencia

- `docs/design-v9/` — prototipo original de Claude Design.
- `docs/REVISION-DISENO-V9.md` — revisión del prototipo y qué se corrigió.
- `docs/PROMPT-CLAUDE-DESIGN.md` — brief que lo generó.
