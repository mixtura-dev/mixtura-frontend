import { type RouteRecordRaw } from 'vue-router'

export interface RouteMeta {
  title: string
  hideSidebar?: boolean
  requiresAuth?: boolean
  guestOnly?: boolean
}

export type ChildAppRoute = RouteRecordRaw & {
  meta?: RouteMeta
  children?: never
}

export type ParentAppRoute = RouteRecordRaw & {
  meta?: RouteMeta
  children?: (ChildAppRoute | ParentAppRoute)[]
}

export type AppRoute = ParentAppRoute
