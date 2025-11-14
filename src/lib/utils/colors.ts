export function hashToHue(str: string | null | undefined): number {
  if (!str) return 0

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }

  return ((hash % 360) + 360) % 360
}
