import type { Config } from 'tailwindcss';

/**
 * PALETA ESTRICTA (brief del cliente): SOLO #3D89FD, negro y blanco.
 * Toda la profundidad (navy, tints, grises) se logra con opacidad/rgba de esos
 * tres colores — aquí no se declara ningún otro hex, y no debe declararse.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Único color de marca. Negro/blanco vienen de Tailwind por defecto.
        blue: '#3D89FD',
      },
      /**
       * El preflight de Tailwind pinta TODOS los bordes de gris #e5e7eb, que
       * es un cuarto color fuera de la paleta. Lo llevamos a un derivado de
       * negro para que cualquier borde sin color explícito siga en paleta.
       */
      borderColor: {
        DEFAULT: 'rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Narrow', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
