import EmptyLayout from '@/layouts/EmptyLayout.vue'
const ErrorPage = () => import('@/pages/ErrorPage.vue')

export const errorRoutes = {
  path: '/',
  component: EmptyLayout,
  children: [
    {
      path: '/403',
      component: ErrorPage,
      props: { statusCode: 403, message: 'noPermission' },
      meta: { title: 'Forbidden' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: ErrorPage,
      props: { statusCode: 404, message: 'noResults' },
      meta: { title: 'Not Found' },
    },
  ],
}
