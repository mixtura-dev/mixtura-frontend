import type { LocationQueryValue } from 'vue-router'

export const getQueryValue = (value: LocationQueryValue | LocationQueryValue[]): string | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }
  return value ?? null
}
