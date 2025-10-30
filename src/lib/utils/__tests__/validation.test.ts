import { describe, expect, it } from 'vitest'
import { USERNAME_REGEX, PASSWORD_REGEX } from '../validation'

describe('validation utils', () => {
  it('Valid usernames', () => {
    const validUsernames = ['user', 'User123', 'a-b_c', 'username_2024', 'A_B-2C']
    validUsernames.forEach((username) => {
      const result = USERNAME_REGEX.test(username)
      expect(result, `Fail on username: ${username}`).toBe(true)
    })
  })

  it('Invalid usernames', () => {
    const invalidUsernames = [
      'юзернейм', // non-ASCII characters
      '-username', // starts with invalid character
      'username_', // ends with invalid character
      'user name', // contains space
      'user@name!', // contains special characters
    ]
    invalidUsernames.forEach((username) => {
      expect(USERNAME_REGEX.test(username)).toBe(false)
    })
  })
})

describe('PASSWORD_REGEX', () => {
  it('Valid passwords', () => {
    const validPasswords = ['Password1', 'abc123!', 'A1b2C3d4$', 'My_Passw0rd', 'P@ssw0rd2024']
    validPasswords.forEach((password) => {
      expect(PASSWORD_REGEX.test(password)).toBe(true)
    })
  })
  it('Invalid passwords', () => {
    const invalidPasswords = [
      'password', // no digits
      '12345678', // no letters
      'pass word1', // contains space
      '!!!!!!', // no letters or digits
    ]
    invalidPasswords.forEach((password) => {
      expect(PASSWORD_REGEX.test(password)).toBe(false)
    })
  })
})
