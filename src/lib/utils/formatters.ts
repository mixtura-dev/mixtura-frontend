/**
 * Formats a code string (e.g., 'MUTE_CHAT') into a displayable string (e.g., 'Mute Chat').
 * Each word is capitalized, and underscores are replaced with spaces.
 * @param code The code string to format.
 * @returns The formatted string.
 */
export function formatCodeForDisplay(code: string): string {
  if (!code) return ''
  return code
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
