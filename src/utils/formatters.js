import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price, lang = 'fr') => {
  const currency = lang === 'ar' ? 'د.م.' : 'DH';
  return `${price} ${currency}`;
};
