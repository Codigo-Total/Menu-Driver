import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * This is the standard way to handle conditional classes in modern Tailwind projects.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
