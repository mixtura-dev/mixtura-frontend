/**
 * Return Initials from username
 * Supports: "Ivan Ivanov", "ivan-ivanov", "IVAN_IVANOV"
 * @param name - string (username)
 * @param maxLength - max lenght of initials
 * @returns string with 1-2 Uppercase letters or '?'
 */

export const getInitials = (name: string | undefined | null, maxLength: number = 2): string => {
  if (!name?.trim()) return '?'
  const parts = name
    .trim()
    .split(/[\s\-_]+/)
    .filter(Boolean)

  if (parts.length === 0) return '?'

  const initials = parts
    .slice(0, maxLength)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return initials || '?'
}

/**
 * Replaces characters in the local part of the email (before @) with asterisks,
 * preserving the first and last letters.
 * @param email - email for mask
 * @param maskChar - character to replace (default '*')
 * @returns - disguised email, for example: e**********8@gmail.com
 */

export const maskEmail = (email: string | null | undefined, maskChar: string = '*'): string => {
  if (!email?.trim()) return ''
  const atIndex = email.indexOf('@')
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return email
  }
  const localPart = email.slice(0, atIndex)
  const domainPart = email.slice(atIndex)
  if (localPart.length <= 2) {
    return email
  }
  const first = localPart[0]
  const last = localPart[localPart.length - 1]
  const maskedMiddle = maskChar.repeat(localPart.length - 2)

  return `${first}${maskedMiddle}${last}${domainPart}`
}
