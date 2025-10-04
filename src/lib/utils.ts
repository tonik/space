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
