import { expect, test } from 'vitest'
import { avg } from '../math'
test('calculate avg of numbers', () => {
  const numbers = [10, 20, 30, 40]
  expect(avg(numbers)).toBe(25)
})
test('avg of empty array should be 0', () => {
  expect(avg([])).toBe(0)
})

test('avg with decimal results', () => {
  const numbers = [1, 2, 3]
  expect(avg(numbers)).toBe(2)
  const numbers2 = [1, 2]
  expect(avg(numbers2)).toBe(1.5)
})
