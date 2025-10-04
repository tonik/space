import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTotalCommandCount(
  commandCounts: Record<string, number>,
): number {
  return Object.values(commandCounts).reduce((sum, count) => sum + count, 0);
}

export function getMostUsedCommand(
  commandCounts: Record<string, number>,
): { command: string; count: number } | null {
  const entries = Object.entries(commandCounts);
  if (entries.length === 0) return null;

  const [command, count] = entries.reduce((max, current) =>
    current[1] > max[1] ? current : max,
  );

  return { command, count };
}

export function getCommandUsagePercentage(
  command: string,
  commandCounts: Record<string, number>,
): number {
  const total = getTotalCommandCount(commandCounts);
  if (total === 0) return 0;
  return Math.round(((commandCounts[command] || 0) / total) * 100);
}

/**
 * Utility function for displaying lines with random delays
 * Useful for creating a typewriter effect in terminal-like interfaces
 */
export async function displayLinesWithDelay(
  lines: string[],
  addLineCallback: (line: string) => void,
  setIsPrintingCallback?: (isPrinting: boolean) => void,
  minDelay: number = 500,
  maxDelay: number = 700,
): Promise<void> {
  if (setIsPrintingCallback) {
    setIsPrintingCallback(true);
  }

  for (let i = 0; i < lines.length; i++) {
    addLineCallback(lines[i]);
    if (i < lines.length - 1 && lines[i] !== "\n") {
      // Random delay between minDelay and maxDelay
      const randomDelay =
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    }
  }

  if (setIsPrintingCallback) {
    setIsPrintingCallback(false);
  }
}
