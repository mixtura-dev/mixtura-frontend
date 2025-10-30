import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('@/composables/useAuthQuery', () => ({
  useUserQuery: vi.fn(),
  useProvidersQuery: vi.fn(),
}))

import AccountProviders from '@/components/account/AccountProviders.vue'
import { useUserQuery, useProvidersQuery } from '@/composables/useAuthQuery'

describe('AccountProviders.vue', () => {
  beforeEach(() => {
    ;(useUserQuery as unknown).mockReset()
    ;(useProvidersQuery as unknown).mockReset()
  })

  it('show skeleton if not providers', () => {
    ;(useUserQuery as unknown).mockReturnValue({ data: ref({}) })
    ;(useProvidersQuery as unknown).mockReturnValue({ data: ref(null) })

    const wrapper = mount(AccountProviders, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    })

    expect(wrapper.findAll('[role="status"]').length).toBe(1)
    expect(wrapper.findAllComponents({ name: 'Skeleton' }).length).toBeGreaterThan(0)
  })

  it('show button Connect for unlinked providers', () => {
    ;(useUserQuery as unknown).mockReturnValue({ data: ref({ providers: [] }) })
    ;(useProvidersQuery as unknown).mockReturnValue({
      data: ref({
        oauth_providers: [
          {
            id: 'github',
            display_name: 'GitHub',
            redirect_uri: '/connect/github',
            icon_url: 'https://github.com/icon.png',
            limit: 2,
          },
        ],
      }),
    })

    const wrapper = mount(AccountProviders, {
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          Link: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('account.connections.connect')
    expect(link.attributes('href')).toBe('/connect/github')
  })
})
