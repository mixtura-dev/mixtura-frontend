# mixtura-frontend — AGENTS.md

## Tech stack

- Vue 3 + Vite 6 + TypeScript 5.8 — SPA
- pnpm (lockfile: `pnpm-lock.yaml`), package name: `balancer`
- Tailwind CSS v4 + `tw-animate-css` + shadcn-vue (New York style)
- Pinia stores, Vue Router 4 (file-based routes with middleware), TanStack Vue Query 5
- vue-i18n (ru/en, custom plural rules for ru)
- `reka-ui` (UI Lib), `vaul-vue` (drawer), `vue-sonner` (toasts), `lucide-vue-next` (icons)
- `@unovis/vue` for charts, `@vue-dnd-kit/core` for drag-and-drop

## Commands

| command               | what                                                        |
| --------------------- | ----------------------------------------------------------- |
| `pnpm dev`            | dev server (port 5173, proxy `/api` → `VITE_API_URL`)       |
| `pnpm build`          | production build                                            |
| `pnpm test:unit`      | vitest (jsdom env)                                          |
| `pnpm type-check`     | `vue-tsc --build` (checks all tsconfig refs)                |
| `pnpm lint`           | `eslint . --fix`                                            |
| `pnpm format`         | `prettier --write src/`                                     |
| `pnpm generate:types` | `openapi-typescript openapi.json --output src/types/api.ts` |
| `pnpm generate:icons` | `node src/scripts/generate-icons.mjs`                       |

**Order**: `pnpm type-check && pnpm lint && pnpm test:unit` before committing.

## Project structure

```
src/
  api/           Axios instance + endpoint fns + query definitions
  components/    Vue components (auth/, balancer/, bracket/, ui/ etc.)
  composables/   Vue composables (useTheme, useLanguage, useApiError, etc.)
  layouts/       Page layout wrappers
  lib/           Utils (cn from clsx+twMerge, logger, tournament helpers)
  middleware/    Router guards: authMiddleware, roleMiddleware, titleMiddleware
  pages/         Page components (one per route)
  router/        Vue Router config + route definitions (default, auth, error)
  stores/        Pinia stores (appStore, authStore, balancerStore, etc.)
  types/         TS types (api.ts = generated from openapi.json)
  i18n/          vue-i18n setup + locale messages
  directives/    Custom directives (v-copy)
  scripts/       Build-time scripts (generate-icons.mjs)
```

## Architecture notes

- **API**: `src/api/axios.ts` creates an Axios instance with `withCredentials`, proxied through Vite to `VITE_API_URL`. 401 responses trigger `authStore.handleUnauthorized()`. Vue Query (`queryClient.ts`) wraps data fetching with 5-min stale time, retries disabled.
- **Auth flow**: Pinia stores (`authStore.store.ts`) manage session. Vue Router middleware (`authMiddleware`, `roleMiddleware`) guard protected routes. Route meta uses `requiresAuth`, `guestOnly`, `roles`.
- **Type generation**: API types in `src/types/api.ts` are auto-generated from `openapi.json` via `pnpm generate:types`. **Always re-generate after API changes.** Do not edit `api.ts` by hand.
- **Icons**: Custom icons live in `src/custom-icons.json` (Iconify format), loaded at app boot via `src/iconify.ts`. Also generate from icon sets with `pnpm generate:icons`.
- **i18n**: Default locale `ru`, fallback `en`. Detected from `localStorage['user-locale']` → browser language. Custom pluralization for Russian.
- **Tailwind v4**: Uses `@import 'tailwindcss'` syntax (no `tailwind.config.js`). CSS vars for theming in `src/index.css`.
- **Docker**: Three configs in `.docker/` for dependencies/develop/production. Nginx SPA fallback (`nginx.conf`). Runtime env vars via `env.sh` (prefix `FRONTEND_ENV_`).
- **Code style**: No semicolons, single quotes, 100 print width (`@vue/eslint-config-prettier/skip-formatting`). ESLint flat config. `vue/multi-word-component-names` turned off.
- **TypeScript**: Path aliases `@/` → `src/`, `@/components`, `@/stores`.
- **Env vars** (`.env`): `VITE_API_URL`, `VITE_DEFAULT_LOCALE`, `VITE_FALLBACK_LOCALE`, `VITE_HCAPTCHA_SITEKEY`, `__APP_VERSION__` (from package.json).

## Testing

- Vitest + jsdom + `@vue/test-utils`
- Tests go in `src/**/__tests__/*` (auto-included by eslint+vitest configs)
- Pattern: `const { data } = useQuery(...)` → mock composables with `vi.mock`
- No e2e tests or snapshot tests found

## Generated / build artifacts

- `src/types/api.ts` — **do not edit by hand**
- `dist/` — build output (gitignored)
- `stats.html` — bundle analysis (gitignored)
- `*.tsbuildinfo` — gitignored
