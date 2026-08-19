import type { ReactNode } from 'react';

/**
 * Layout raíz "passthrough" (patrón next-intl): el <html>/<body> reales los
 * renderiza app/[locale]/layout.tsx con el idioma correcto.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
