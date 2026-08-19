# Handoff: Sitio web GABAME Human Health (v9)

## Overview
Sitio institucional bilingüe (ES/EN) de GABAME Human Health, grupo mexicano de salud fundado en 2013 (~250 colaboradores, 6 áreas terapéuticas). Público: médicos y profesionales de la salud, distribuidores, socios estratégicos e instituciones. No es un sitio para pacientes finales. Tono institucional y sobrio, sin lenguaje publicitario ni claims de eficacia.

Alcance: Inicio (portada con video, áreas, portafolio Rx, nosotros, ecosistema, socios), Portafolio Rx, Nosotros, Farmacovigilancia, Contacto, modal de Aviso de privacidad, pie global y botón flotante de asistente (placeholder «Beta · Próximamente»).

## About the Design Files
Los archivos de este paquete son **referencias de diseño creadas en HTML**: prototipos que muestran la apariencia y el comportamiento previstos, no código de producción para copiar tal cual. La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Next.js, Vue, WordPress, etc.) siguiendo sus patrones y librerías. Si aún no existe entorno, elige el framework más adecuado (recomendado: Next.js + i18n) e implementa allí.

El prototipo está escrito con estilos en línea y un pequeño runtime propio; no reutilices esa estructura: extrae de él la maqueta, las medidas, los colores, la tipografía y el copy.

## Fidelity
**Alta fidelidad.** Colores, tipografía, escalas, espaciados y copy son definitivos (salvo el aviso de privacidad, pendiente de validación legal, y las fichas de producto, pendientes de COFEPRIS). Recrear pixel a pixel con las librerías del codebase.

## Restricciones duras (no negociables)
1. **Regulatorio**: prohibido inventar nombres comerciales, moléculas, presentaciones, posología, datos clínicos o claims. El portafolio va vacío, con estado «Fichas en preparación» por área y ruta a «Solicitar información». Nota fija: «Datos clínicos, molécula y posología se incorporan a cada ficha tras validación regulatoria (COFEPRIS).»
2. **Paleta de tres valores**: azul #3D89FD, negro #000000, blanco #FFFFFF. Cualquier gris o profundidad se construye con rgba() de esos tres. Sin hex nuevos, sin degradados a otros colores.
3. **Contraste**: negro sobre azul = 6.19:1 (par de trabajo). Blanco sobre azul NO pasa AA: solo display decorativo. Azul como texto solo sobre blanco/negro en tamaños grandes o como superficie. Texto pequeño sobre azul siempre negro sólido (nunca rgba con alpha < .8).
4. **Bilingüe ES/EN** con conmutador en la cabecera; el inglés es ~15% más corto, la maqueta no puede depender de la longitud de un idioma.
5. **Accesibilidad AA**: foco visible en todo lo interactivo, jerarquía real de encabezados, respeto a prefers-reduced-motion.
6. **Responsive 360–1920px**, un solo tema (sin modo claro/oscuro).

## Design Tokens
- Colores: `--blue: #3D89FD`, `--black: #000000`, `--white: #FFFFFF`. Derivados permitidos: rgba(0,0,0,.82) (cuerpo sobre blanco/azul), rgba(255,255,255,.86) (cuerpo sobre negro), rgba(0,0,0,.2) (reglas), rgba(255,255,255,.24) (reglas sobre negro).
- Tipografía: **Roboto Condensed** (Google Fonts) en todo el sitio. 700 para titulares y navegación en MAYÚSCULAS con line-height ~0.96–1; 600 para etiquetas; 400 para cuerpo.
  - Titular portada: clamp(40px, 6vw, 88px), uppercase, line-height .94
  - H2 de sección: clamp(34px, 5vw, 64px), uppercase, line-height .98
  - H3 de tarjeta/fila: clamp(22px, 2.4vw, 32px)
  - Etiquetas (eyebrow): 16px, uppercase, letter-spacing .16–.18em
  - Cuerpo: 18–21px, line-height 1.5–1.6 (subido respecto a una tipografía normal por el ancho estrecho de la condensada)
  - Navegación: 18px, 600, uppercase, letter-spacing .06em
- Espaciado: secciones 96px vertical / 40px horizontal (72px en páginas internas); contenedor máx. 1440–1600px; gaps 20/24/56px.
- Bordes: reglas de 1px rgba negra, filetes de 2px y 6px sólidos en negro o azul. **Sin border-radius** (v9 es de esquinas rectas) salvo el botón circular del asistente (999px).
- Sombras: ninguna.

## Screens / Views

### 1. Cabecera global
- Barra blanca, borde inferior de 3px azul. Contenedor 1600px, padding 14px 40px, flex.
- Logo (assets/gabame-logo.png) a 64px de alto, enlaza a Inicio.
- Navegación a la derecha: Inicio · Áreas · Portafolio · Nosotros · Ecosistema · Socios · Contacto (18px, 600, uppercase, negro; la página activa lleva subrayado azul de 3px).
- Botón de idioma ES/EN (borde negro 1px, 15px, uppercase) y CTA «Contáctanos» (fondo azul, texto negro, 12px 24px).
- Áreas / Ecosistema / Socios son anclas de la home; el resto son páginas.

### 2. Inicio — portada
- Banda de video a sangre: `height: clamp(320px, 42vw, 560px)`, fondo negro. **No usar aspect-ratio junto a min-height** (infla el ancho y genera scroll horizontal). Aquí va el video institucional 16:9, mudo, en bucle, sin controles.
- Panel azul montado sobre el video: contenedor 1600px, `margin-top: -140px`, ancho máx. 1000px, padding 44px 48px.
  - Etiqueta: «Grupo mexicano de salud · Desde 2013»
  - H1: «Salud que impacta de verdad»
  - Bajada: «Desarrollamos productos de alto valor y los transformamos en marcas sólidas y relevantes para todo México.»
  - CTAs: «Ver portafolio Rx» (negro/blanco) y «Contáctanos» (contorno negro)
- Franja de cifras: flex con wrap, gap 20px 48px, borde inferior negro de 2px. 2013 Fundación · ~250 Colaboradores · 6 Áreas terapéuticas (números en azul, 700; etiquetas en negro, uppercase).

### 3. Inicio — Áreas (ancla #areas)
- Fondo blanco. Etiqueta «Portafolio · Áreas terapéuticas», H2 «Seis áreas, una misión», bajada «Cubrimos las necesidades del sistema de salud mexicano con un portafolio Rx especializado.», CTAs «Ver portafolio» y «Conócenos».
- Tabla de seis filas (no tarjetas): grid 70px | 1fr | 1.2fr | auto, borde superior negro de 2px, filas separadas por 1px rgba(0,0,0,.2).
  - Columna 1: numeral 01–06 (negro, 700, letter-spacing .14em)
  - Columna 2: nombre del área en uppercase
  - Columna 3: descriptor
  - Columna 4: chip azul «Fichas en preparación» (texto negro)
- Áreas y descriptores: Cardiometabólico («Soluciones para el manejo de enfermedades cardiovasculares y metabólicas.»), Oncología («Terapias de apoyo al tratamiento oncológico.»), Hospitalario («Productos para el entorno hospitalario y de cuidado agudo.»), Urología («Tratamientos para la salud urológica.»), Sistema Nervioso Central («Terapias para trastornos del sistema nervioso central.»), Oftalmología («Productos para el cuidado de la salud visual.»).

### 4. Inicio — Portafolio Rx
- Sección negra. Grid: columna izquierda `minmax(260px,.62fr)` con marco vertical 9:16 (borde blanco 1px, patrón de líneas diagonales al 5% de blanco) para el **video vertical del portafolio Rx**, con botón circular azul de 74px y etiqueta monoespaciada del hueco; columna derecha 1.38fr con:
  - Etiqueta «Portafolio Rx destacado», H2 «Un portafolio Rx especializado», bajada «Cada marca con su posicionamiento; la ficha completa se desarrolla en su propia página.»
  - Seis filas área + chip azul «Fichas en preparación», separadas por 1px rgba blanco
  - Nota COFEPRIS con filete azul de 3px a la izquierda
  - CTAs «Fichas de producto» (azul) y «Solicitar información» (contorno blanco)

### 5. Inicio — Nosotros
- Banda azul a sangre con el símbolo de marca (assets/gabame-mark.png) como marca de agua: posición absoluta, right -60px, ancho 460px, opacidad .16, sin eventos de puntero.
- Etiqueta «Nosotros», H2 «Un referente mexicano en salud», párrafo «Qué hacemos» a clamp(19px,2vw,26px), CTAs «Contáctanos» (negro) y «Nuestro ecosistema» (contorno negro).
- Cifras en línea sobre borde superior negro de 2px.

### 6. Inicio — Ecosistema (ancla #ecosistema)
- Fondo blanco. Etiqueta «Ecosistema del grupo», H2 «Cuatro marcas, un estándar», bajada «GABAME es la puerta de entrada a un ecosistema que se conectará con Medinter, Ordan y A7.»
- Cuatro tarjetas en grid de 4 columnas, cada una con **filete superior azul de 6px** (el conector debe vivir en cada tarjeta, no en un elemento absoluto del contenedor: al envolver la rejilla, un conector único deja nodos huérfanos) y un punto de 16px:
  - GABAME: fondo azul, punto negro, chip «Activo» sobre azul
  - Medinter / Ordan / A7: fondo blanco con borde negro de 2px, punto azul, chip «Fase posterior» en contorno
- CTAs «Explorar ecosistema» (azul) y «Ser socio» (contorno negro).

### 7. Inicio — Socios (ancla #socios)
- Composición asimétrica, grid 1.6fr | 1fr sin gap:
  - Bloque negro: etiqueta «Compromiso · Colaboración», H2 «Contigo en cada etapa», bajada, y dentro —sobre regla blanca— el bloque de Farmacovigilancia con su intro y CTA «Reportar» (azul).
  - Bloque azul: «Quiero ser socio» + «Súmate a nuestra red de distribución y socios estratégicos en todo México.» + CTA negro.

### 8. Página Portafolio Rx
Cabecera azul con título y bajada; índice lateral pegajoso de 260px con las seis áreas y, a la derecha, fichas por área con descriptor, chip «Fichas en preparación» y enlace «Solicitar información». Cierra con la nota COFEPRIS.

### 9. Página Nosotros
Cabecera azul; tarjetas Propósito (contorno negro) y Visión (negra con título azul); bloque azul «Qué hacemos»; «En cifras» (2013 / ~250 / 6); «Ecosistema del grupo» con las cuatro marcas y la nota «Medinter, Ordan y A7 se habilitan en fases posteriores»; cierre negro «¿Trabajamos juntos?» con CTA.

### 10. Página Farmacovigilancia
Cabecera negra con etiqueta azul; aviso obligatorio en bloque azul: «Este no es un canal de urgencias. Si tú o alguien más presenta una emergencia médica, acude de inmediato a servicios de salud o llama a emergencias.»; formulario de reporte: nombre, correo, teléfono (opcional), tipo de notificador (paciente o cuidador / profesional de la salud / otro), producto sospechoso, descripción; nota de confidencialidad; botón «Enviar reporte» (azul). Canal separado del contacto comercial.

### 11. Página Contacto
Cabecera azul «Hablemos» + «Escríbenos y te responderemos dentro de nuestro horario de atención.». Columna izquierda con datos: teléfono 55 5548 7579, correo contacto@gabame.com, horario «Lunes a viernes, 8:00–18:00 h», dirección «Av. de la Palma 8, primer piso, Villa de las Palmas, CP 52787, Huixquilucan, Estado de México», más un bloque negro que deriva las sospechas de reacción adversa a farmacovigilancia. Formulario: nombre, correo, institución u organización, perfil (profesional de la salud / distribuidor / socio estratégico / institución), mensaje, botón «Enviar».

### 12. Pie de página
Fondo negro, cuatro columnas: marca (símbolo + «GABAME / HUMAN HEALTH» + «Grupo mexicano de salud desde 2013.»), Contacto, Sitio, Legal (Aviso de privacidad, Farmacovigilancia, «Portal de clientes · próximamente») y bloque **Síguenos** con mosaicos de 46px: LinkedIn activo (fondo azul, texto negro) y WhatsApp en contorno, más la nota «WhatsApp y otras redes · próximamente». Los mosaicos actuales son monogramas tipográficos: sustituir por los SVG oficiales de cada red.

### 13. Asistente conversacional (placeholder)
Botón circular fijo de 60px, abajo a la derecha: fondo negro, borde azul de 2px, «IA» en azul y «Beta» en blanco. No responde; anuncia lo que viene. Un elemento fijo con texto largo en esa esquina tapa los CTAs y se recorta: mantenerlo circular y compacto.

### 14. Modal Aviso de privacidad
Se abre desde el pie sobre fondo negro al 76%. Tarjeta blanca de 720px con título, aviso azul «Texto preliminar. La versión definitiva está pendiente de validación legal.» y el texto provisional. Bloquear scroll de fondo y cerrar con Escape en la implementación real.

## Interactions & Behavior
- Navegación por páginas sin recarga; `window.scrollTo(0,0)` al cambiar de página. En producción, rutas reales por URL (/, /portafolio, /nosotros, /farmacovigilancia, /contacto) e idioma en la ruta o subdominio.
- Anclas de Áreas / Ecosistema / Socios: si el usuario no está en Inicio, navega a Inicio y luego desplaza con offset por la cabecera pegajosa.
- Conmutador ES/EN: cambia todo el copy; el estado debe persistir (cookie o preferencia de usuario) y reflejarse en `<html lang>`.
- Formularios: son maquetas; el botón solo cambia a «Enviado». Implementar validación real, honeypot/anti-spam y, en farmacovigilancia, registro trazable con acuse.
- Hover: los enlaces bajan a rgba(0,0,0,.62); foco visible con outline negro de 3px y offset 3px.
- Respetar prefers-reduced-motion (sin animaciones ni autoplay que moleste; el video va mudo y en bucle).

## Responsive
- ≤1180px: la navegación envuelve; rejillas de 3 y 4 columnas bajan a 2; el índice lateral del portafolio deja de ser pegajoso. La franja de cifras usa flex-wrap, no grid (con grid deja huecos).
- ≤900px: el split de portafolio y las composiciones asimétricas pasan a una columna.
- ≤760px: todo a una columna, padding lateral 18–20px.
- Verificar en 360, 768, 1180 y 1920 que `scrollWidth === clientWidth`.

## State Management
- `lang`: "es" | "en" — diccionario completo de copy en ambos idiomas.
- `page`: "home" | "portfolio" | "about" | "pv" | "contact".
- `privacy`: boolean — modal de aviso de privacidad.
- `sent`: boolean — estado del envío de formulario (maqueta).
- Datos: lista de 6 áreas (nombre + descriptor), 3 cifras, 4 marcas del ecosistema con su estado. Sin productos.

## Assets
- `assets/gabame-logo.png` — lockup horizontal (símbolo + GABAME HUMAN HEALTH), tinta azul-oscura, fondo transparente. Sobre fondos oscuros hace falta la versión invertida en blanco (no incluida): pedirla al cliente o colocar el lockup sobre placa blanca.
- `assets/gabame-mark.png` — solo el símbolo hexagonal; usado como marca de agua y en el pie.
- Pendientes de entregar por el cliente: video institucional 16:9 (mudo, apto para fondo), video vertical 9:16 del portafolio Rx, fotografía de laboratorio de bioprocesos, organigrama del grupo, SVG de las redes sociales. No hay fotografía de equipo ni de instalaciones: mantener los huecos marcados como espacio reservado, no sustituir por stock.

## Files
- `Gabame v9.dc.html` — diseño de referencia (versión vigente, esta es la que hay que implementar).
- `Tipografias condensadas.dc.html` — prueba tipográfica; se eligió Roboto Condensed.
- `assets/` — logo y símbolo.
