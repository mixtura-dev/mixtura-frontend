import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import type { ParentAppRoute } from '@/types/router'
const WorkspacePage = () => import('@/pages/WorkspacePage.vue')
const WorkspaceCreatePage = () => import('@/pages/WorkspaceCreatePage.vue')
const SettingPage = () => import('@/pages/SettingsPage.vue')
const BalancerPage = () => import('@/pages/BalancerPage.vue')
const SignInPage = () => import('@/pages/SignInPage.vue')
const SignUpPage = () => import('@/pages/SignUpPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')
const NotHavePermissionPage = () => import('@/pages/403.vue')
const AccountPage = () => import('@/pages/AccountPage.vue')
const routes: ParentAppRoute[] = [
  {
    path: '/',
    component: DefaultLayout,

    children: [
      {
        path: '',
        component: HomePage,
        meta: {
          title: 'Home',
        },
      },
      {
        path: 'workspace',
        component: WorkspacePage,
        meta: {
          title: 'Workspace',
        },
      },
      {
        path: 'workspace/new',
        component: WorkspaceCreatePage,
        meta: {
          title: 'New Workspace',
          hideSidebar: true,
        },
      },
      {
        path: 'settings',
        component: SettingPage,
        meta: {
          title: 'Settings',
        },
      },
      {
        path: 'account',
        component: AccountPage,
        meta: {
          title: 'Account',
        },
      },
      {
        path: 'balancer',
        component: BalancerPage,
        meta: {
          title: 'Balancer',
        },
      },
    ],
  },
  {
    path: '/',
    component: EmptyLayout,

    children: [
      {
        path: 'sign-up',
        component: SignUpPage,
        meta: {
          title: 'Sign Up',
        },
      },
      {
        path: 'sign-in',
        component: SignInPage,
        meta: {
          title: 'Sign In',
        },
      },
      {
        path: '/403',
        component: NotHavePermissionPage,
        meta: {
          title: 'You have not permission to access',
        },
      },
      {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
        meta: {
          title: 'Not found',
        },
      },
    ],
  },
]

export default routes
