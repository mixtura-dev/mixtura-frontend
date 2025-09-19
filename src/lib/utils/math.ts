export const avg = (nums: number[]): number => {
  if (!nums.length) return 0
  const sum = nums.reduce((a, b) => a + b, 0)
  return Math.round((sum / nums.length) * 100) / 100
}
