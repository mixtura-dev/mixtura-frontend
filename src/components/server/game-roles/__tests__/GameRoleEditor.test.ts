import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const mockUpdateMutateAsync = vi.fn()
const mockDeleteMutateAsync = vi.fn()

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as Record<string, unknown>,
    useI18n: () => ({
      t: (key: string) => key,
      locale: { value: 'en' },
    }),
  }
})

vi.mock('@/api/queries/server', async () => {
  const actual = await vi.importActual('@/api/queries/server')
  return {
    ...actual,
    useUpdateRoleMutation: () => ({
      mutateAsync: mockUpdateMutateAsync,
      isPending: ref(false),
    }),
    useDeleteRoleMutation: () => ({
      mutateAsync: mockDeleteMutateAsync,
      isPending: ref(false),
    }),
  }
})

import GameRoleEditor from '../GameRoleEditor.vue'

const mockRole = {
  id: 'role-1',
  name: 'Duelist',
  icon_url: null,
  min_in_team: 1,
  max_in_team: 2,
  hidden: false,
}

describe('GameRoleEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createWrapper(props = {}) {
    return mount(GameRoleEditor, {
      props: {
        role: mockRole,
        roleSetId: 'set-1',
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

  it('renders role name in header', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Duelist')
  })

  it('form fields are prefilled with role data', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].element.value).toBe('1')
    expect(inputs[1].element.value).toBe('2')
  })

  it('save button is disabled when no changes', () => {
    const wrapper = createWrapper()
    const btns = wrapper.findAll('button')
    const saveBtn = btns[btns.length - 1]
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('save button is enabled after changing name', async () => {
    const wrapper = createWrapper()
    const textInput = wrapper.findAll('input').filter(
      (i) => i.element.type === 'text',
    )[0]
    await textInput.setValue('New Duelist')
    const btns = wrapper.findAll('button')
    const saveBtn = btns[btns.length - 1]
    expect(saveBtn.attributes('disabled')).toBeUndefined()
  })

  it('shows validation error when max < min', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input[type="number"]')
    const minInput = inputs[0]
    const maxInput = inputs[1]
    await minInput.setValue(5)
    await maxInput.setValue(2)
    expect(wrapper.text()).toContain('server.gameRoles.role.maxMinError')
  })

  it('calls useUpdateRoleMutation on save', async () => {
    const wrapper = createWrapper()
    const textInput = wrapper.findAll('input').filter(
      (i) => i.element.type === 'text',
    )[0]
    await textInput.setValue('New Duelist')
    const btns = wrapper.findAll('button')
    const saveBtn = btns[btns.length - 1]
    await saveBtn.trigger('click')
    expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
      serverId: 'server-1',
      roleSetId: 'set-1',
      roleId: 'role-1',
      data: {
        name: 'New Duelist',
        min_in_team: 1,
        max_in_team: 2,
        hidden: false,
      },
    })
  })

  it('calls useDeleteRoleMutation and emits deleted', async () => {
    const wrapper = createWrapper()
    const deleteBtn = wrapper.findAll('button').filter(
      (b) => b.text().includes('server.gameRoles.role.deleteButton'),
    )[0]
    await deleteBtn.trigger('click')
    expect(mockDeleteMutateAsync).toHaveBeenCalledWith({
      serverId: 'server-1',
      roleSetId: 'set-1',
      roleId: 'role-1',
    })
    expect(wrapper.emitted('deleted')).toBeTruthy()
  })
})
