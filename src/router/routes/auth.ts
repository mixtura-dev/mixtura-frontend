import EmptyLayout from '@/layouts/EmptyLayout.vue'

const SignInPage = () => import('@/pages/SignInPage.vue')
const SignUpPage = () => import('@/pages/SignUpPage.vue')
const SignUpVerifyPage = () => import('@/pages/SignUpVerifyPage.vue')
const SignUpConfirmPage = () => import('@/pages/SignUpConfirmPage.vue')
const ForgotPasswordPage = () => import('@/pages/ForgotPasswordPage.vue')
const ForgotPasswordVerifyPage = () => import('@/pages/ForgotPasswordVerifyPage.vue')
const ForgotPasswordConfirmPage = () => import('@/pages/ForgotPasswordConfirmPage.vue')
const OAuthCallbackPage = () => import('@/pages/OAuthCallbackPage.vue')
const InvitePage = () => import('@/pages/InvitePage.vue')

export const authRoutes = {
  path: '/',
  component: EmptyLayout,
  children: [
    { path: '/sign-in', component: SignInPage, meta: { title: 'Sign In', guestOnly: true } },
    { path: '/sign-up', component: SignUpPage, meta: { title: 'Sign Up', guestOnly: true } },
    {
      path: '/sign-up/verify',
      component: SignUpVerifyPage,
      meta: { title: 'Verify Email', guestOnly: true },
    },
    {
      path: '/sign-up/confirm',
      component: SignUpConfirmPage,
      meta: { title: 'Complete Registration', guestOnly: true },
    },
    {
      path: '/forgot-password',
      component: ForgotPasswordPage,
      meta: { title: 'Forgot Password', guestOnly: true },
    },
    {
      path: '/forgot-password/verify',
      component: ForgotPasswordVerifyPage,
      meta: { title: 'Verify Reset Code', guestOnly: true },
    },
    {
      path: '/forgot-password/confirm',
      component: ForgotPasswordConfirmPage,
      meta: { title: 'Set New Password', guestOnly: true },
    },
    { path: '/invite/:key', component: InvitePage, meta: { title: 'Join Server' } },
    {
      path: '/oauth/callback/:provider',
      component: OAuthCallbackPage,
      meta: { title: 'OAuth Callback', requiresAuth: false, guestOnly: false },
    },
  ],
}
