export const findIndexById = <T>(array: T[], id: string, getId: (item: T) => string): number => {
  return array.findIndex((item) => getId(item) === id)
}

export function areValidIndexes(...indexes: number[]): boolean {
  return indexes.every((i) => i !== -1)
}

export const swapItems = <T>(arr1: T[], index1: number, arr2: T[], index2: number): void => {
  ;[arr1[index1], arr2[index2]] = [arr2[index2], arr1[index1]]
}
