/**
 * SidebarLeft.spec.ts
 * Unit tests for SidebarLeft.vue
 */

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import SidebarLeft from '../../../app/components/sidebar/left/SidebarLeft.vue'

// --- Shared mock store object so test and component share same instance ---
const mockSidebarStore = reactive({
  collapsed: false,
  collapsedSwitch: false,
  toggleCollapsed: vi.fn(),
  toggleCollapsedSwitch: vi.fn(),
})

vi.mock('~/stores/sidebar', () => ({
  useSidebar: () => mockSidebarStore,
}))

// Mock route utilities and vue-router hooks used by the component
vi.mock('~/utils/routeUtils', () => ({
  currentRoutePathIncludes: (path: string, routeName: string) => {
    // simple default: return true for 'home' to match default map
    return routeName.includes(path)
  },
  isCurrentRoutePathSubpageOf: () => false,
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, path: '/home', name: 'home' }),
  useRouter: () => ({
    currentRoute: { value: { name: 'home' } },
    push: vi.fn(),
  }),
}))

// Provide a minimal global auto-import for useState used inside component.
// In the Nuxt environment useState is auto-imported; tests run without that, so we add it.
;(globalThis as any).useState = function <T = any>(key: string, init?: () => T) {
  const val = init ? init() : (undefined as unknown as T)
  return ref(val)
}

describe('SidebarLeft.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // reset shared mock store values before each test
    mockSidebarStore.collapsed = false
    mockSidebarStore.collapsedSwitch = false
    mockSidebarStore.toggleCollapsed.mockClear()
    mockSidebarStore.toggleCollapsedSwitch.mockClear()

    wrapper = mount(SidebarLeft, {
      global: {
        // stub child components (we don't need their implementations)
        stubs: {
          SidebarLeftHeader: true,
          SidebarLeftMainSectionSelectors: true,
          SidebarLeftContent: true,
          SidebarLeftFilter: true,
          SidebarLeftFooter: true,
          SearchBar: true,
          Icon: true,
        },
        // mock i18n $t
        mocks: {
          $t: (key: string) => key,
        },
      },
      // ensure the component mounts with DOM so refs/element manipulation works
      attachTo: document.body,
    })
  })

  it('renders aside element with navigation role and aria-label from $t', () => {
    const aside = wrapper.find('aside')
    expect(aside.exists()).toBe(true)
    expect(aside.attributes('role')).toBe('navigation')
    // $t mock returns the key string, so it should contain the i18n key
    expect(aside.attributes('aria-label')).toContain('i18n.components.sidebar_left.sidebar_left_aria_label')
    // tabindex present
    expect(aside.attributes('tabindex')).toBe('0')
  })

  it('expands on mouseover and collapses on mouseleave (updates store)', async () => {
    // initialize store as collapsed to test opening
    mockSidebarStore.collapsed = true
    mockSidebarStore.collapsedSwitch = false

    // need a fresh nextTick so template uses updated store values
    await nextTick()

    const aside = wrapper.find('aside')
    expect(aside.exists()).toBe(true)

    // mouseover -> collapseSidebar(false) should set collapsed = false
    await aside.trigger('mouseover')
    // event handlers set sidebar.collapsed synchronously in component function
    expect(mockSidebarStore.collapsed).toBe(false)

    // mouseleave -> collapseSidebar(true) should set collapsed = true
    await aside.trigger('mouseleave')
    expect(mockSidebarStore.collapsed).toBe(true)
  })

  it('focus and focusout behavior: focus keeps expanded, focusout collapses unless relatedTarget inside wrapper', async () => {
    // start collapsed
    mockSidebarStore.collapsed = true
    await nextTick()

    const aside = wrapper.find('aside')
    // trigger focus -> collapseSidebar(false)
    await aside.trigger('focus')
    expect(mockSidebarStore.collapsed).toBe(false)

    // focusout with relatedTarget inside the aside should keep expanded (collapsed=false)
    await aside.trigger('focusout', { relatedTarget: aside.element })
    // Because handleFocusOut checks sidebarWrapper.contains(relatedTarget) -> should call collapseSidebar(false)
    expect(mockSidebarStore.collapsed).toBe(false)

    // focusout with relatedTarget outside (null) should collapse
    await aside.trigger('focusout', { relatedTarget: null })
    expect(mockSidebarStore.collapsed).toBe(true)
  })

  it('applies correct width classes depending on collapsed and collapsedSwitch states', async () => {
    const aside = wrapper.find('aside')

    expect(aside.classes()).toContain('w-56')

    // Update reactive store state
    mockSidebarStore.collapsed = true
    mockSidebarStore.collapsedSwitch = true
    await nextTick()

    // Vue now re-renders, class list updates
    const classes = aside.classes().join(' ')
    expect(classes).toMatch(/w-(16|20)/) // support both possible widths
    })


 it('content overflow class toggles based on collapsed state', async () => {
  const contentDiv = wrapper.findAll('div').find((n) =>
    (n.attributes('class') || '').includes('overflow-x-hidden')
  )
  expect(contentDiv).toBeTruthy()

  mockSidebarStore.collapsed = false
  mockSidebarStore.collapsedSwitch = false
  await nextTick()
  expect(contentDiv!.attributes('class')).toContain('overflow-y-auto')

  mockSidebarStore.collapsed = true
  mockSidebarStore.collapsedSwitch = true
  await nextTick()

  // Vue updates, overflow-y-auto disappears
  expect(contentDiv!.attributes('class')).not.toContain('overflow-y-auto')
})


  it('detects scrollable content and updates width class when scrollable', async () => {
    const aside = wrapper.find('aside')
    // ensure expanded state
    mockSidebarStore.collapsed = false
    mockSidebarStore.collapsedSwitch = false
    await nextTick()

    // find content element that is referenced by ref="content"
    // The DOM element is accessible as wrapper.vm.$refs.content
    const vmAny: any = wrapper.vm as any
    const contentRefEl = vmAny.$refs?.content as HTMLElement | undefined
    expect(contentRefEl).toBeDefined()

    // set the element to be scrollable by defining scrollHeight > clientHeight
    // Use defineProperty in case these are read-only
    Object.defineProperty(contentRefEl, 'scrollHeight', { value: 500, configurable: true })
    Object.defineProperty(contentRefEl, 'clientHeight', { value: 100, configurable: true })
    // Also set scrollTop to non-zero so top shadow logic would reflect being scrolled
    Object.defineProperty(contentRefEl, 'scrollTop', { value: 10, configurable: true })

    // dispatch a resize so the component's window listener runs setSidebarContentScrollable
    window.dispatchEvent(new Event('resize'))

    // Wait for the small timeout in setSidebarContentScrollable (component uses setTimeout 50ms)
    await new Promise((res) => setTimeout(res, 70))
    await nextTick()

    // when scrollable and expanded, the class 'w-60' should be present (per template condition)
    // (template: 'w-60' when not collapsed and sidebarContentScrollable)
    const classes = aside.classes()
    expect(classes).toContain('w-60')
  })
})
