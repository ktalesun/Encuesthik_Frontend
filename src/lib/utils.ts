import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de manera inteligente
 * Evita conflictos entre clases y permite sobrescritura
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
