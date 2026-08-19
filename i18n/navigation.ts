import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** Link/router conscientes del idioma — usar siempre estos, no los de next/link. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
