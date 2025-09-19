import { BoxesIcon, ChartColumnIcon, HouseIcon, Settings } from 'lucide-vue-next'
import type { Component } from 'vue'

interface NavItem {
  path: string
  labelKey: string
  icon: Component
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
