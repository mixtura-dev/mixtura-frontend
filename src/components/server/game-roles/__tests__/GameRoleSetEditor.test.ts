import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const mockMutateAsync = vi.fn()

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
    useUpdateRoleSetMutation: () => ({
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
  ],
}

import GameRoleSetEditor from '../GameRoleSetEditor.vue'

describe('GameRoleSetEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createWrapper(props = {}) {
    return mount(GameRoleSetEditor, {
      props: {
        roleSet: mockRoleSet,
        serverId: 'server-1',
        ...props,
      },
      global: {
        stubs: {
          Separator: { template: '<hr />' },
        },
      },
    })
  }

  it('renders role set name in header', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Valorant Roles')
  })

  it('input is prefilled with role set name', () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    expect(input.element.value).toBe('Valorant Roles')
  })

  it('save button is disabled when name unchanged', () => {
    const wrapper = createWrapper()
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('save button is enabled when name changed', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('New Name')
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('calls useUpdateRoleSetMutation on save', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('Updated Roles')
    await wrapper.find('button').trigger('click')
    expect(mockMutateAsync).toHaveBeenCalledWith({
      serverId: 'server-1',
      roleSetId: 'set-1',
      data: { name: 'Updated Roles' },
    })
  })

  it('shows roles count', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('server.gameRoles.roleSet.rolesCount')
  })
})
