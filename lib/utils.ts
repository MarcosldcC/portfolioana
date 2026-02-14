import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIconName(name: string): string {
  if (!name) return "";

  // Caso especial para LinkedIn (Lucide usa 'Linkedin' com 'i' minúsculo)
  if (name.toLowerCase() === "linkedin") return "Linkedin";

  // Converte kebab-case, snake_case ou espaços para PascalCase
  // Ex: shopping-bag -> ShoppingBag, palette -> Palette
  return name
    .replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}
