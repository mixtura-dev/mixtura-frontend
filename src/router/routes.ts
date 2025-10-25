import type { ParentAppRoute } from '@/types/router'
import { defaultRoutes } from './routes/default'
import { authRoutes } from './routes/auth'
import { errorRoutes } from './routes/error'

const routes: ParentAppRoute[] = [defaultRoutes, authRoutes, errorRoutes]

export default routes
