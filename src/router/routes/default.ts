import ServerPage from '@/pages/ServerPage.vue'

const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const HomePage = () => import('@/pages/HomePage.vue')
const ServersPage = () => import('@/pages/ServersPage.vue')
const ServersCreatePage = () => import('@/pages/ServersCreatePage.vue')
const SettingPage = () => import('@/pages/WorkspaceSettingsPage.vue')
const BalancerPage = () => import('@/pages/BalancerPage.vue')
const AccountPage = () => import('@/pages/AccountPage.vue')

export const defaultRoutes = {
  path: '/',
  component: DefaultLayout,
  children: [
    { path: '', component: HomePage, meta: { title: 'Home', requiresAuth: true } },
    {
      path: 'servers',
      component: ServersPage,
      meta: { title: 'Servers', requiresAuth: true },
    },
    {
      path: 'servers/new',
      component: ServersCreatePage,
      meta: { title: 'New Server', hideSidebar: true, requiresAuth: true },
    },
    {
      path: 'servers/:id',
      component: ServerPage,
    },
    { path: 'settings', component: SettingPage, meta: { title: 'Settings', requiresAuth: true } },
    { path: 'account', component: AccountPage, meta: { title: 'Account', requiresAuth: true } },
    { path: 'balancer', component: BalancerPage, meta: { title: 'Balancer', requiresAuth: true } },
  ],
}
