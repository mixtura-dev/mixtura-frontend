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
const ForgotPasswordPage = () => import('@/pages/ForgotPasswordPage.vue')
const SignUpVerifyPage = () => import('@/pages/SignUpVerifyPage.vue')
const SignUpConfirmPage = () => import('@/pages/SignUpConfirmPage.vue')
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
          requiresAuth: true,
        },
      },
      {
        path: 'workspace',
        component: WorkspacePage,
        meta: {
          title: 'Workspace',
          requiresAuth: true,
        },
      },
      {
        path: 'workspace/new',
        component: WorkspaceCreatePage,
        meta: {
          title: 'New Workspace',
          hideSidebar: true,
          requiresAuth: true,
        },
      },
      {
        path: 'settings',
        component: SettingPage,
        meta: {
          title: 'Settings',
          requiresAuth: true,
        },
      },
      {
        path: 'account',
        component: AccountPage,
        meta: {
          title: 'Account',
          requiresAuth: true,
        },
      },
      {
        path: 'balancer',
        component: BalancerPage,
        meta: {
          title: 'Balancer',
          requiresAuth: true,
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
          requiresAuth: false,
        },
      },
      {
        path: 'sign-in',
        component: SignInPage,
        meta: {
          title: 'Sign In',
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPage,
        meta: {
          title: 'Forgot Password',
          requiresAuth: false,
        },
      },
      {
        path: 'sign-up/verify',
        component: SignUpVerifyPage,
        meta: { title: 'Verify Email', requiresAuth: false },
      },
      {
        path: 'sign-up/confirm',
        component: SignUpConfirmPage,
        meta: { title: 'Complete Registration', requiresAuth: false },
      },
      {
        path: '/403',
        component: NotHavePermissionPage,
        meta: {
          title: 'You have not permission to access',
          requiresAuth: false,
        },
      },
      {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
        meta: {
          title: 'Not found',
          requiresAuth: false,
        },
      },
    ],
  },
]

export default routes
