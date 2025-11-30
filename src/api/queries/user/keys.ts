export const authQueryKeys = {
  user: () => ['auth', 'user'] as const,
  providers: () => ['auth', 'providers'] as const,
}
