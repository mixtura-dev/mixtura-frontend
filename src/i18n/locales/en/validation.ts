export default {
  token: {
    invalid: 'Code must be 6 digits',
  },
  username: {
    required: 'Username is required',
    invalidType: 'Username must be a string',
    min: 'Username must be at least 3 characters',
    max: 'Username must be at most 20 characters',
    invalid: 'Username contains invalid characters',
    busy: 'Username is busy',
  },
  password: {
    required: 'Password is required',
    invalidType: 'Password must be a string',
    min: 'Password must be at least 6 characters',
    max: 'Password must be at most 32 characters',
    invalid: 'Password must include at least one letter and one number',
    hide: 'Hide password',
    show: 'Show password',
  },
  repeatPassword: {
    required: 'Please confirm your password',
    mismatch: 'Passwords do not match',
  },
}
