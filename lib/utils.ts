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

export const FAKE_DELAY_MS: number = 3000; // Set to 0 to disable all fake delays

export async function simulateDelay() {
  if (FAKE_DELAY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS));
  }
}
