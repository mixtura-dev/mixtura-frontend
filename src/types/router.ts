import { type RouteRecordRaw } from 'vue-router'
import type { Role } from './user'

export interface RouteMeta {
  title: string
  hideSidebar?: boolean
  roles?: Role[]
  requiresAuth?: boolean
  guestOnly?: boolean
}

export type ChildAppRoute = RouteRecordRaw & {
  meta: RouteMeta
  children?: never
}

export type ParentAppRoute = RouteRecordRaw & {
  meta?: RouteMeta
  children?: ChildAppRoute[]
}

export type AppRoute = ParentAppRoute
