# Prompt para Claude Design — GABAME Human Health

Copia todo el bloque de abajo. **Antes de enviarlo, reemplaza el bloque
`## 1. LA IDEA` con tu concepto** — es lo único que falta; el resto ya está
cerrado con el cliente.

---

Eres director de arte y diseñador de producto digital. Diseña un sitio web
corporativo para **GABAME Human Health**, grupo farmacéutico mexicano.

## 1. LA IDEA (reemplaza este bloque)

> Describe aquí tu concepto. Si sirve de guía, responde estas cuatro:
>
> - **Estructura**: ¿scroll largo narrativo, una sola pantalla, secciones tipo
>   revista, catálogo navegable, algo interactivo?
> - **Primera impresión**: ¿qué es lo primero que ve quien entra y qué debe
>   sentir?
> - **Secciones**: revisa el inventario de la sección 5 y di cuáles conservas,
>   cuáles fusionas y en qué orden van.
> - **Referencia**: si tienes un sitio o estética de referencia, nómbrala.

## 2. Marca — NO NEGOCIABLE

**Paleta estricta: solo tres valores.**

- Azul de marca: `#3D89FD`
- Negro: `#000000`
- Blanco: `#FFFFFF`

Cualquier gris, navy, tinte, sombra o profundidad se construye **con `rgba()` de
esos tres colores** — nunca con un hex nuevo. Cero excepciones: si el diseño
necesita un gris medio, es `rgba(255,255,255,0.72)` sobre negro o
`rgba(0,0,0,0.72)` sobre blanco. Sin degradados a otros colores.

**El azul manda.** `#3D89FD` es el color dominante del sitio, no un acento: es
lo que el cliente pidió y lo primero que debe leerse de la marca. Llévalo a
superficie —bloques y secciones enteras en azul, cabecera, tarjetas, franjas,
gráficos, tratamientos de imagen—, no lo dejes reducido a botones y subrayados.
Negro y blanco son el soporte que lo hace respirar y sostienen la lectura larga.
Si al ver una pantalla el azul no es lo primero que registras, todavía no está
resuelta.

**Contraste verificado — respétalo:**

- **Negro sobre azul `#3D89FD` = 6.19:1** → AA a cualquier tamaño. Es la
  combinación de trabajo: sobre superficies azules, el texto va en negro.
- Blanco sobre azul = 2.6:1 → **no pasa AA**. Solo para display muy grande y
  decorativo, nunca para copy, etiquetas ni navegación.
- Azul como *texto* sobre blanco tampoco pasa AA en tamaño pequeño: en fondos
  blancos, el azul va en títulos grandes, gráficos, bordes y superficies — el
  párrafo va en negro.

Traducido: mientras más azul pongas en el fondo, más negro va encima. Ese par
—azul de superficie, negro de texto— es el que debe dominar el sitio.

**Tipografía:**

- Títulos, navegación y etiquetas: **Barlow Condensed**, pesos 600/700, en
  MAYÚSCULAS, `line-height` cerrado (~1), tracking ligero.
- Cuerpo: **Inter**, pesos 400/500.
- El contraste entre la condensada en caja alta y la Inter neutra es el sello
  tipográfico de la marca. Mantenlo.

## 3. Quién es el cliente

Grupo mexicano de salud fundado en **2013**, ~**250 colaboradores**, **6 áreas
terapéuticas**. Desarrolla productos Rx de alto valor y los convierte en marcas
sólidas, apoyado en capacidades propias de construcción de marca y distribución
en todo México. Es la puerta de entrada a un ecosistema que se conectará con
**Medinter, Ordan y A7** (en fases posteriores).

**Audiencia**: médicos y profesionales de la salud, distribuidores, socios
estratégicos, instituciones. **No** es un sitio para pacientes finales.

**Tono**: institucional, sobrio, con autoridad clínica. Nada de lenguaje
publicitario, ni promesas de eficacia, ni emoción de campaña de consumo.

## 4. Copy real del cliente — úsalo textual, no inventes

**Posicionamiento**
- Título: «Salud que impacta de verdad»
- Bajada: «Desarrollamos productos de alto valor y los transformamos en marcas
  sólidas y relevantes para todo México.»
- Etiqueta: «Grupo mexicano de salud · Desde 2013»

**Propósito**: «Impactamos de forma real y positiva en las personas,
fortaleciendo su salud y bienestar integral a través de productos y servicios
responsables.»

**Visión**: «Ser un referente mexicano que inspire orgullo, empodere a las
personas, y demuestre que el esfuerzo y la pasión convierten cualquier sueño en
realidad.»

**Qué hacemos**: «Somos un grupo especializado en salud, enfocado en desarrollar
productos de alto valor y transformarlos en marcas sólidas y relevantes. A
través de nuestras capacidades incorporadas en construcción de marca y
distribución, garantizamos operaciones eficientes y un crecimiento escalable en
todo el mercado mexicano.»

**Cifras**: 2013 (fundación) · ~250 (colaboradores) · 6 (áreas terapéuticas)

**Las 6 áreas terapéuticas y su descriptor:**

| Área | Descriptor |
|---|---|
| Cardiometabólico | Soluciones para el manejo de enfermedades cardiovasculares y metabólicas. |
| Oncología | Terapias de apoyo al tratamiento oncológico. |
| Hospitalario | Productos para el entorno hospitalario y de cuidado agudo. |
| Urología | Tratamientos para la salud urológica. |
| Sistema Nervioso Central | Terapias para trastornos del sistema nervioso central. |
| Oftalmología | Productos para el cuidado de la salud visual. |

**Farmacovigilancia** (sección propia, canal separado del contacto comercial):
- «Tu reporte nos ayuda a vigilar la seguridad de nuestros productos. Notifica
  cualquier sospecha de reacción adversa relacionada con un producto de GABAME.»
- Aviso obligatorio: «Este no es un canal de urgencias. Si tú o alguien más
  presenta una emergencia médica, acude de inmediato a servicios de salud o
  llama a emergencias.»

**Contacto**
- Teléfono: 55 5548 7579
- Correo: contacto@gabame.com
- Horario: Lunes a viernes, 8:00–18:00 h
- Dirección: Av. de la Palma 8, primer piso, Villa de las Palmas, CP 52787,
  Huixquilucan, Estado de México
- LinkedIn: GABAME Human Health

## 5. Secciones y páginas que existen hoy

Este es el inventario real del sitio actual. **El orden, el agrupamiento y qué
vive en la Home contra qué vive en página propia lo define mi idea (sección 1)**
— puedes fusionar, partir o reordenar. Lo que no puedes es perder contenido ni
inventar secciones sin material que las sostenga.

**Navegación principal**: Inicio · Áreas · Portafolio · Nosotros · Ecosistema ·
Socios · Contacto. CTA persistente: «Contáctanos».

**Bloques de la Home, con su copy real:**

| Bloque | Etiqueta | Título | Bajada | CTAs |
|---|---|---|---|---|
| Hero | Grupo mexicano de salud · Desde 2013 | Salud que impacta de verdad | Desarrollamos productos de alto valor y los transformamos en marcas sólidas y relevantes para todo México. | Ver portafolio Rx · Contáctanos |
| Áreas | Portafolio · Áreas terapéuticas | Seis áreas, una misión | Cubrimos las necesidades del sistema de salud mexicano con un portafolio Rx especializado. | Ver portafolio · Conócenos |
| Portafolio | Portafolio Rx destacado | Un portafolio Rx especializado | Cada marca con su posicionamiento; la ficha completa se desarrolla en su propia página. | Fichas de producto · Solicitar información |
| Nosotros | Nosotros | Un referente mexicano en salud | (texto «Qué hacemos» de la sección 4) + cifras 2013 / ~250 / 6 | Contáctanos · Nuestro ecosistema |
| Ecosistema | Ecosistema del grupo | Cuatro marcas, un estándar | GABAME es la puerta de entrada a un ecosistema que se conectará con Medinter, Ordan y A7. | Explorar ecosistema · Ser socio |
| Socios | Compromiso · Colaboración | Contigo en cada etapa | Reporta una sospecha de reacción adversa o únete a nuestra red de distribución y socios estratégicos en todo México. | Farmacovigilancia · Quiero ser socio |
| Contacto | Contacto | Hablemos | Escríbenos y te responderemos dentro de nuestro horario de atención. | Formulario + datos de contacto |

**Páginas propias:**

- **Portafolio Rx** — las 6 áreas terapéuticas con su descriptor, índice lateral
  por área y fichas de producto. Hoy sin fichas: estado «Fichas en preparación»
  por área. Nota fija: «Datos clínicos, molécula y posología se incorporan a
  cada ficha tras validación regulatoria (COFEPRIS).»
- **Nosotros** — Propósito, Visión, Qué hacemos, En cifras, Ecosistema del grupo
  (con nota de que Medinter, Ordan y A7 se habilitan en fases posteriores) y
  cierre «¿Trabajamos juntos?».
- **Farmacovigilancia** — qué se puede reportar, el aviso de que no es canal de
  urgencias, la nota de confidencialidad y el formulario de reporte (nombre,
  correo, teléfono opcional, tipo de notificador: paciente/cuidador ·
  profesional de la salud · otro, producto sospechoso, descripción).
- **Aviso de privacidad** — se abre como modal. Texto preliminar: el definitivo
  está pendiente de validación legal del cliente.

**Elementos globales:**

- Cabecera con logo, navegación y selector de idioma ES/EN.
- Pie de página en cuatro columnas: marca y tagline («Grupo mexicano de salud
  desde 2013.»), Contacto, Sitio, Legal (Aviso de privacidad · Farmacovigilancia
  · Portal de clientes *próximamente*) y Síguenos (LinkedIn; WhatsApp y otras
  redes *próximamente*).
- Asistente conversacional flotante — **placeholder, aún no funciona**.
  Etiqueta «Beta · Próximamente». Diséñalo como algo que anuncia lo que viene,
  sin fingir que responde.

## 6. Assets disponibles

- Logo/lockup en PNG con fondo transparente, tinta azul y oscura. Sobre fondos
  negros se invierte a blanco puro.
- Video institucional horizontal 16:9 (mudo, apto para fondo).
- Video vertical 9:16 del portafolio Rx (mudo, loop).
- Fotografía de laboratorio de bioprocesos.
- Organigrama del grupo.

No hay fotografía de equipo ni de instalaciones todavía: si el diseño las
necesita, márcalas como espacio reservado explícito, no las simules con stock.

## 7. Restricciones duras

- **Regulatorio (crítico)**: está prohibido inventar nombres comerciales,
  moléculas, presentaciones, posología, datos clínicos o claims de eficacia.
  Nada de eso puede publicarse sin validación COFEPRIS. **El portafolio hoy está
  vacío**: diseña un estado honesto y digno de «Fichas en preparación» por área,
  con un camino a «Solicitar información». No rellenes con productos ficticios.
- **Bilingüe** ES/EN: el diseño debe aguantar que el inglés sea ~15% más corto y
  el español rompa líneas distinto. Nada de textos que solo caben en un idioma.
- **Accesibilidad AA**: contraste según la sección 2, foco visible en todo lo
  interactivo, respeta `prefers-reduced-motion`, jerarquía de encabezados real.
- **Responsive** de 360px a 1920px.
- **Un solo tema.** No hay modo claro/oscuro ni selector de tema: define una
  sola apariencia, con el azul dominante, y resuélvela bien.

## 8. Qué espero de vuelta

1. El concepto en una frase y por qué encaja con esta marca.
2. La estructura de la página, sección por sección, con su jerarquía.
3. El diseño visual: retícula, escala tipográfica, cómo se reparte el azul a lo
   largo de la página y componentes (botones, tarjetas, navegación).
4. Cómo se comporta en móvil.
5. Los estados vacíos y reservados (portafolio sin fichas, fotos pendientes).

Trabaja el desktop primero y luego el móvil. Si una decisión mía compromete la
accesibilidad o la paleta, dímelo en vez de resolverlo por tu cuenta.
