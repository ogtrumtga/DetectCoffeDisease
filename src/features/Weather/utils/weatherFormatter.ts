/**
 * Format hour (0-23) to display string with "h" suffix
 * Example: 14 -> "14h"
 */
export function formatHour(hour: number): string {
  return `${hour}h`;
}

/**
 * Format date to display string
 * Example: "2024-02-07" -> "07/02"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Format temperature
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

/**
 * Get current time string for display
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
