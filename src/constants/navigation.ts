import { BoxesIcon, ChartColumnIcon, HouseIcon, Settings, Users } from 'lucide-vue-next'
import type { Component } from 'vue'

interface NavItem {
  path: string
  labelKey: string
  icon: Component
}

export interface NavGroup {
  id: string
  match?: RegExp
  items: NavItem[]
}

export const MAIN_NAV: NavItem[] = [
  {
    path: '/',
    labelKey: 'menu.home',
    icon: HouseIcon,
  },
  {
    path: '/workspace',
    labelKey: 'menu.workspace',
    icon: BoxesIcon,
  },
  {
    path: '/balancer',
    labelKey: 'menu.balancer',
    icon: ChartColumnIcon,
  },
  {
    path: '/settings',
    labelKey: 'menu.settings',
    icon: Settings,
  },
]

export const NAV_GROUPS: NavGroup[] = [
  { id: 'main', items: MAIN_NAV },
  {
    id: 'workspace',
    match: /^\/workspace/,
    items: [{ path: '/workspace/team', labelKey: 'nav.team', icon: Users }],
  },
]
