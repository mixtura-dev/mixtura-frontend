import { expect, test } from 'vitest'
import { getQueryValue } from '@/lib/utils/router'

test('router query parameters', () => {
  const query = { id: '123', name: 'test' }
  expect(getQueryValue(query.id)).toBe('123')
  expect(getQueryValue(query.name)).toBe('test')
  // @ts-expect-error tests null case
  expect(getQueryValue(query.age)).toBeNull()
})
