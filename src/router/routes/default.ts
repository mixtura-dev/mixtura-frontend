import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'

const WorkspacePage = () => import('@/pages/WorkspacePage.vue')
const WorkspaceCreatePage = () => import('@/pages/WorkspaceCreatePage.vue')
const SettingPage = () => import('@/pages/WorkspaceSettingsPage.vue')
const BalancerPage = () => import('@/pages/BalancerPage.vue')
const AccountPage = () => import('@/pages/AccountPage.vue')

export const defaultRoutes = {
  path: '/',
  component: DefaultLayout,
  children: [
    { path: '', component: HomePage, meta: { title: 'Home', requiresAuth: true } },
    {
      path: 'workspace',
      component: WorkspacePage,
      meta: { title: 'Workspace', requiresAuth: true },
    },
    {
      path: 'workspace/new',
      component: WorkspaceCreatePage,
      meta: { title: 'New Workspace', hideSidebar: true, requiresAuth: true },
    },
    { path: 'settings', component: SettingPage, meta: { title: 'Settings', requiresAuth: true } },
    { path: 'account', component: AccountPage, meta: { title: 'Account', requiresAuth: true } },
    { path: 'balancer', component: BalancerPage, meta: { title: 'Balancer', requiresAuth: true } },
  ],
}
