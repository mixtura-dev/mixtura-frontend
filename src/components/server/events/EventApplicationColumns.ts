import type { ColumnDef } from '@tanstack/vue-table'
import type { components } from '@/types/api'
import type { ComposerTranslation } from 'vue-i18n'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import EventApplicationRowActions from './EventApplicationRowActions.vue'

type Application = components['schemas']['ApplicationListItemResponse']

export const applicationStatuses = [
  { value: 'PENDING' as const, label: 'server.events.applications.status.pending' },
  { value: 'APPROVED' as const, label: 'server.events.applications.status.approved' },
  { value: 'REJECTED' as const, label: 'server.events.applications.status.rejected' },
  { value: 'WAITLIST' as const, label: 'server.events.applications.status.waitlist' },
]

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  APPROVED: 'default',
  REJECTED: 'destructive',
  WAITLIST: 'secondary',
}

export function createApplicationColumns(
  t: ComposerTranslation,
  serverId: string,
  eventId: string,
  canModerate = true,
): ColumnDef<Application>[] {
  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'user',
      header: () => t('server.events.applications.columns.player'),
      cell: ({ row }) => {
        const user = row.getValue<Application['user']>('user')
        const username = user?.username ?? row.original.member_id.slice(0, 8)
        const initial = username.charAt(0).toUpperCase()
        return h('div', { class: 'flex items-center gap-3' }, [
          h(Avatar, { class: 'size-8' }, () =>
            h(AvatarFallback, { class: 'text-xs' }, () => initial),
          ),
          h('span', { class: 'font-medium' }, username),
        ])
      },
      filterFn: (row, id, value: string) => {
        const user = row.getValue<Application['user']>('user')
        return user?.username?.toLowerCase().includes(value.toLowerCase()) ?? false
      },
    },
    {
      id: 'rolePriorities',
      header: () => t('server.events.applications.columns.rolePriorities'),
      cell: () =>
        h('span', { class: 'text-muted-foreground text-sm' }, '\u2014'),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) =>
        h(Button, {
          variant: 'ghost',
          class: 'px-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => [t('server.events.applications.columns.status'), h(ArrowUpDown, { class: 'ml-1 size-3' })]),
      cell: ({ row }) => {
        const status = row.getValue<Application['status']>('status')
        return h(Badge, { variant: statusVariant[status] ?? 'outline' }, () => t(`server.events.applications.status.${status.toLowerCase()}`))
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) =>
        h(Button, {
          variant: 'ghost',
          class: 'px-0',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => [t('server.events.applications.columns.createdAt'), h(ArrowUpDown, { class: 'ml-1 size-3' })]),
      cell: ({ row }) => {
        const date = new Date(row.getValue<string>('created_at'))
        return h('span', { class: 'text-muted-foreground text-sm' }, date.toLocaleString('ru-RU'))
      },
      sortingFn: 'datetime',
    },
  ]

  if (canModerate) {
    columns.push({
      id: 'actions',
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) =>
        h(EventApplicationRowActions, {
          application: row.original,
          serverId,
          eventId,
        }),
    })
  }

  return columns
}
