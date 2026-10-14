import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveUrl(url: string | null | undefined, baseUrl: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url;
  if (url.startsWith('/') && !url.startsWith('//') && baseUrl) return baseUrl.replace(/\/$/, '') + url;
  return url;
}
