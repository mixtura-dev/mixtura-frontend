import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { titleMiddleware } from '@/middleware/titleMiddleware'
import { authMiddleware } from '@/middleware/authMiddleware'
import { roleMiddleware } from '@/middleware/roleMiddleware'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes,
})

router.beforeEach(authMiddleware)
router.beforeEach(roleMiddleware)
router.beforeEach(titleMiddleware)

export default router
