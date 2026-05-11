import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const mockMutateAsync = vi.fn()
const roleSetRef = ref<unknown>(null)

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as Record<string, unknown>,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        if (params) return key.replace('{count}', String(params.count))
        return key
      },
      locale: { value: 'en' },
    }),
  }
})

vi.mock('@/api/queries/server', async () => {
  const actual = await vi.importActual('@/api/queries/server')
  return {
    ...actual,
    useRoleSetQuery: () => ({
      data: roleSetRef,
      isLoading: ref(false),
    }),
    useCreateRoleMutation: () => ({
      mutateAsync: mockMutateAsync,
      isPending: ref(false),
    }),
  }
})

const mockRoleSet = {
  id: 'set-1',
  name: 'Valorant Roles',
  game_roles: [
    { id: 'role-1', name: 'Duelist', icon_url: null, min_in_team: 1, max_in_team: 2, hidden: false },
    { id: 'role-2', name: 'Sentinel', icon_url: null, min_in_team: 1, max_in_team: 1, hidden: true },
  ],
}

import GameRolesDialog from '../GameRolesDialog.vue'

describe('GameRolesDialog.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    roleSetRef.value = null
  })

  function createWrapper(props = {}) {
    return mount(GameRolesDialog, {
      props: {
        serverId: 'server-1',
        open: true,
        'onUpdate:open': vi.fn(),
        ...props,
      },
      global: {
        stubs: {
          Dialog: {
            template: '<div><slot /></div>',
            props: ['open'],
          },
          DialogContent: {
            template: '<div><slot /></div>',
          },
          DialogHeader: {
            template: '<div><slot /></div>',
          },
          DialogTitle: {
            template: '<h2><slot /></h2>',
          },
          DialogDescription: {
            template: '<p><slot /></p>',
          },
          ScrollArea: {
            template: '<div><slot /></div>',
          },
          GameRoleSetEditor: true,
          GameRoleEditor: true,
        },
      },
    })
  }

  it('shows empty state when no role set', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('server.gameRoles.dialog.noRoleSets')
  })

  it('renders role set name when data exists', () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Valorant Roles')
  })

  it('renders role items within the role set', () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Duelist')
    expect(wrapper.text()).toContain('Sentinel')
  })

  it('shows hidden badge for hidden roles', () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('server.gameRoles.role.hiddenBadge')
  })

  it('shows add role button', () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    const addButtons = wrapper.findAll('button').filter(
      (b) => b.text().includes('server.gameRoles.addRole.button'),
    )
    expect(addButtons).toHaveLength(1)
  })

  it('selecting role set header shows GameRoleSetEditor stub', async () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    const header = wrapper.findAll('div').filter(
      (d) => d.text().includes('Valorant Roles') && d.classes().includes('group'),
    )[0]
    await header.trigger('click')
    expect(wrapper.findComponent({ name: 'GameRoleSetEditor' }).exists()).toBe(true)
  })

  it('selecting a role shows GameRoleEditor stub', async () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    const roleBtn = wrapper.findAll('button').filter(
      (b) => b.text().includes('Duelist'),
    )[0]
    await roleBtn.trigger('click')
    expect(wrapper.findComponent({ name: 'GameRoleEditor' }).exists()).toBe(true)
  })

  it('shows create form when clicking add role button', async () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    const addBtn = wrapper.findAll('button').filter(
      (b) => b.text().includes('server.gameRoles.addRole.button'),
    )[0]
    await addBtn.trigger('click')
    expect(wrapper.text()).toContain('server.gameRoles.addRole.cancel')
    expect(wrapper.text()).toContain('server.gameRoles.addRole.confirm')
  })

  it('closes inline form on cancel', async () => {
    roleSetRef.value = mockRoleSet
    const wrapper = createWrapper()
    const addBtn = wrapper.findAll('button').filter(
      (b) => b.text().includes('server.gameRoles.addRole.button'),
    )[0]
    await addBtn.trigger('click')
    const cancelBtn = wrapper.findAll('button').filter(
      (b) => b.text().includes('server.gameRoles.addRole.cancel'),
    )[0]
    await cancelBtn.trigger('click')
    expect(wrapper.text()).not.toContain('server.gameRoles.addRole.cancel')
  })
})
