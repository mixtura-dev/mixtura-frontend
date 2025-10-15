export const updateBodyClass = (classesToRemove: string[], classToAdd: string): void => {
  document.body.classList.remove(...classesToRemove)
  document.body.classList.add(classToAdd)
}
