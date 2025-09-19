export default {
  common: {
    or: 'Or',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    next: 'Continue',
    back: 'Back',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    connect: 'Connect',
  },
  validation: {
    username: {
      required: 'Username is required',
      invalidType: ' Username must be a string',
      min: 'Username must be at least 3 characters',
      max: 'Username must be at most 20 characters',
      invalid: 'Username contains invalid characters',
    },
    password: {
      required: 'Password is required',
      invalidType: 'Password must be a string',
      min: 'Password must be at least 6 characters',
      max: 'Password must be at most 32 characters',
      invalid: 'Password must include at least one letter and one number',
    },
    repeatPassword: {
      required: 'Please confirm your password',
      mismatch: 'Passwords do not match',
    },
  },
  menu: {
    home: 'Home',
    settings: 'Settings',
    balancer: 'Balancer',
    workspace: 'Workspace',
  },
  form: {
    signIn: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account',
      submit: 'Sign In',
      linkText: "Don't have an account?",
      linkLabel: 'Sign Up',
    },
    signUp: {
      title: 'Welcome',
      subtitle: 'Create your account',
      submit: 'Sign Up',
      linkText: 'Already have an account?',
      linkLabel: 'Sign In',
    },
    username: 'Username',
    password: 'Password',
    repeatPassword: 'Repeat password',
    terms:
      'By continuing, you agree to the Terms of Service and Privacy Policy, and to receive periodic emails with updates.',
  },
  error: {
    notFound: 'No results found',
    noResults: 'Your search did not return any results',
    loginFailed: 'Login failed: {message}',
    signupFailed: 'Failed to sign you up: {message}',
  },
}
