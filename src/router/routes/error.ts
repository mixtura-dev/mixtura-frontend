import EmptyLayout from '@/layouts/EmptyLayout.vue'
const ErrorPage = () => import('@/pages/ErrorPage.vue')

export const errorRoutes = {
  path: '/',
  component: EmptyLayout,
  children: [
    {
      path: '/403',
      component: ErrorPage,
      props: { statusCode: 403, message: "You don't have permission to access this page." },
      meta: { title: 'Forbidden' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: ErrorPage,
      props: { statusCode: 404, message: "We can't find this page." },
      meta: { title: 'Not Found' },
    },
  ],
}
