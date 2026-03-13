import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export const FAKE_DELAY_MS: number = 0; // Set to 0 to disable all fake delays

export async function simulateDelay() {
  if (FAKE_DELAY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS));
  }
}

export const DONATE_NOW_BUTTON_CLASS =
  "group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-[8px] bg-sage-500 px-5 py-2 text-sm font-semibold leading-5 text-white shadow-[0_8px_24px_rgba(24,58,50,0.42)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-sage-600 hover:shadow-[0_12px_30px_rgba(24,58,50,0.55)]";

export const DONATE_NOW_LABEL_CLASS =
  "relative z-10 text-center text-sm font-semibold leading-5 text-white";
