# Revisión del diseño v9 (Claude Design) — 15 ago 2026

Prototipo revisado: `docs/design-v9/v9.html`, servido en local y medido en el
DOM (350 elementos, 4 anchos de viewport, las 5 vistas y los dos idiomas).

**Veredicto**: base sólida y publicable. El sistema visual es coherente y el
contenido es honesto. Hay 4 cosas que corregir antes de implementar y una lista
de ajustes de contenido.

---

## A. Corregir antes de implementar

### A1. El azul no domina — es el punto que pidió el cliente

Medición de superficie por color:

| Vista | Azul | Negro | Blanco |
|---|---|---|---|
| Inicio | **12.3%** | 21.0% | 66.7% |
| Portafolio Rx | **14.3%** | 14.6% | 71.0% |

El sitio es blanco con acentos azules. La instrucción era la contraria: el azul
a superficie, como color dominante. Hoy solo el panel del hero, la banda de
Nosotros y las cabeceras de página interna son azules.

**Qué pedir**: subir el azul a ~35-45% de superficie. Candidatas naturales sin
romper el ritmo: la sección Áreas (hoy blanca), las tarjetas del Ecosistema, la
cabecera del sitio, y la mitad de las cabeceras de página interna. Sobre azul el
texto se mantiene en negro, que es lo que ya está haciendo bien.

### A2. Cambió la tipografía sin que se lo pidiéramos

El prototipo usa **Roboto Condensed en todo el sitio**, incluido el cuerpo. Lo
cerrado con el cliente es **Barlow Condensed** (títulos, nav, etiquetas) +
**Inter** (cuerpo).

Además del incumplimiento, hay un problema de lectura: una condensada a 18-21px
para párrafos largos rinde peor que una neutra. El propio README lo admite al
subir el `line-height` a 1.5-1.6 «por el ancho estrecho de la condensada» —
está compensando un problema que se evita usando Inter.

**Qué hacer**: volver a Barlow Condensed + Inter. El cambio es directo y no
afecta la maqueta; sí hay que re-verificar altos de línea y anchos de columna.

### A3. Falta el aviso de privacidad en los formularios

Ni el formulario de contacto ni el de farmacovigilancia muestran el aviso ni el
enlace. Solo aparece en el pie. En México la LFPDPPP exige que el aviso esté
disponible **en el punto de recolección**.

El diccionario del cliente ya trae los textos: `contactForm.privacyNote` +
`privacyLink`, y `farmacovigilancia.form.privacyNote`. Hay que colocarlos junto
al botón de envío de cada formulario.

### A4. Desbordamiento horizontal en 360px

`scrollWidth` 385 vs `clientWidth` 360 → scroll lateral en móvil chico. El
README afirma que se verificó en 360; no pasa.

Culpables, en orden:

1. La marca de agua del símbolo en la banda azul de Nosotros — `position:
   absolute; right: -60px; width: 460px`. Llega a 420px. Necesita `overflow:
   hidden` en la banda o un ancho relativo.
2. Los dos bloques de Socios, hasta 384px.
3. El botón del asistente, 365px.

En 768, 1280 y 1920 no hay desbordamiento.

---

## B. Contenido y estructura

### B1. La Home repite sus propios bloques

Contado sobre el DOM de Inicio:

- Las **6 áreas terapéuticas aparecen dos veces** (sección Áreas y sección
  Portafolio Rx) → **12 chips «Fichas en preparación» en una sola página**.
  Repetido 12 veces, el estado honesto deja de leerse como transparencia y
  empieza a leerse como «esta empresa no tiene productos».
- Las **cifras aparecen dos veces** (franja del hero y banda de Nosotros).
- El **ecosistema aparece dos veces** (sección de Home y página Nosotros).

Y una tercera repetición de las áreas en la página Portafolio Rx.

**Qué pedir**: que la sección Áreas de la Home sea el listado, y que la sección
Portafolio Rx sea otra cosa —el video vertical con una sola llamada a la página
completa— sin volver a listar las seis áreas. Un solo lugar con las cifras.

### B2. La página Portafolio Rx reusa el copy de la Home

Muestra «Portafolio Rx destacado / Un portafolio Rx especializado / Cada marca
con su posicionamiento…», que es el copy de la sección de la Home. El cliente
tiene copy propio para esa página (`productos.title`, `.subtitle`, `.note`), y
además falta el `emptyHint`: «Estamos preparando las fichas de esta área.
Solicita información y te compartimos el detalle disponible.»

### B3. Farmacovigilancia: copy incompleto

- La etiqueta es «Compromiso · Colaboración» — esa es la de la sección Socios.
  La correcta es «Seguridad del paciente».
- Falta el bloque «¿Qué puedes reportar?» con su texto.
- Falta el correo de respaldo `farmacovigilancia@gabame.com`.

Lo que sí está y está bien: el aviso de que no es canal de urgencias, los campos
del formulario y la nota de confidencialidad.

### B4. El formulario de contacto agrega campos no aprobados

Suma «Institución u organización» y «Perfil» (profesional de la salud /
distribuidor / socio estratégico / institución). La idea es buena para segmentar
las solicitudes, pero no venía en el material del cliente: hay que aprobarla y,
si entra, ajustar el correo de destino, la API y el aviso de privacidad.

### B5. El copy en inglés está reescrito

El prototipo generó su propio inglés en vez de usar el `en.json` aprobado. Por
ejemplo «A SPECIALISED RX PORTFOLIO» (británico) contra «A specialized Rx
portfolio» del cliente. Al implementar se usa el diccionario, no el prototipo.

### B6. Falta el «Saltar al contenido»

El sitio actual lo tiene y está en el diccionario (`nav.skipToContent`). El
prototipo no lo incluye. Es un retroceso de accesibilidad.

### B7. Contacto sale de la Home

Pasa a página propia y la Home termina en Socios. Es una decisión defendible,
pero cambia el recorrido: hoy el usuario cierra el scroll con el formulario a la
vista. Confirmar con el cliente.

---

## C. Assets

### C1. El logo no está en el azul de marca

El lockup real es **azul acero (~#5B7FA8)**, no `#3D89FD`. En la cabecera blanca
del diseño eso mete de facto un cuarto color en pantalla, justo donde la regla
de paleta es más visible.

Hay que decidir con el cliente: pedir el lockup redibujado en `#3D89FD`, o
aceptar por escrito que el logo es la única excepción a la paleta.

### C2. Nombres de archivo engañosos — ya corregido de nuestro lado

- `gabame_org_sf.png` **no es el organigrama**: es el lockup horizontal.
- `logo_gabame_sf.png` **no es el lockup**: es solo el símbolo hexagonal.

Verificado abriendo los PNG. Ya está corregido en `content/media.ts` y en la
página base. No tenemos organigrama.

### C3. El README pide assets que ya tenemos

Lista como pendientes el video institucional 16:9, el video vertical 9:16 y la
foto de laboratorio. Los tres existen: `gabame_header.mp4`, `portafoliorx.mp4` y
`bg1_clean.webp`. Se los podemos entregar. Ojo: el video de header trae marca de
agua de IA abajo a la derecha y hay que recortarla al encuadrar.

Sí siguen faltando: foto de equipo, foto de instalaciones y los SVG de redes.

---

## D. Lo que está bien y hay que conservar

- **Paleta impecable**: cero hex fuera de los tres permitidos en 350 elementos.
  Toda la profundidad con `rgba()`, como se pidió.
- **Contraste sobre azul respetado**: cero casos de texto blanco sobre azul.
  Usa negro, que es el par que pasa AA.
- **Jerarquía de encabezados real**: un H1, H2 por sección, H3 por ítem.
- **Contenido honesto**: portafolio vacío, sin marcas ni moléculas inventadas,
  nota COFEPRIS presente, «Fase posterior» en Medinter/Ordan/A7, asistente
  marcado como placeholder.
- **Sistema visual coherente**: esquinas rectas, sin sombras, filetes de 2 y 6px,
  tablas en vez de tarjetas para las áreas. Sobrio y apropiado al sector.
- **Bilingüe funcional** y sin desbordamiento en 768, 1280 y 1920.
- La composición asimétrica de Socios y la marca de agua del símbolo son los dos
  mejores momentos de diseño de la pieza.
