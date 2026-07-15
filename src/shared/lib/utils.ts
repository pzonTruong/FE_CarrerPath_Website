import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = 'light' | 'dark' | 'system';

export function getTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'system';
}

export function setTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
}

export const handlePdfPreview = async (url: string) => {
  const toastId = toast.loading('Opening PDF preview...');
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch PDF');
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
    toast.dismiss(toastId);
  } catch (error) {
    console.error('Failed to preview PDF:', error);
    toast.error('Failed to load PDF preview. Opening direct link...');
    window.open(url, '_blank');
    toast.dismiss(toastId);
  }
};
