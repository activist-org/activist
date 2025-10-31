/**
 * sidebarUtils.spec.ts
 * Unit tests for sidebar utility computed class helpers
 */

import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Provide a shared mock store so the computed functions that import useSidebar see predictable state
const sharedMockSidebar = {
  collapsed: false,
  collapsedSwitch: false,
}

// Mock the sidebar store module used inside sidebarUtils.ts
vi.doMock('~/stores/sidebar', () => ({
  useSidebar: () => sharedMockSidebar,
}))

let getSidebarContentDynamicClass: any
let getSidebarFooterDynamicClass: any

beforeAll(async () => {
  const utils = await import('../../app/utils/sidebarUtils')
  getSidebarContentDynamicClass = utils.getSidebarContentDynamicClass
  getSidebarFooterDynamicClass = utils.getSidebarFooterDynamicClass
})


describe('sidebarUtils', () => {
  beforeEach(() => {
    sharedMockSidebar.collapsed = false
    sharedMockSidebar.collapsedSwitch = false
  })

  it('getSidebarContentDynamicClass returns expanded classes when expanded and not scrollable', () => {
    const sidebarHover = ref(false)
    const classes = getSidebarContentDynamicClass(false, sidebarHover).value

    expect(classes['md:pl-16 xl:pl-56']).toBe(true)
    expect(classes['md:pl-20 xl:pl-60']).toBe(false)
    expect(classes['blur-sm xl:blur-none']).toBe(false)
  })

  it('getSidebarContentDynamicClass returns scrollable classes when sidebarContentScrollable true', () => {
    const sidebarHover = ref(false)
    const classes = getSidebarContentDynamicClass(true, sidebarHover).value

    expect(classes['md:pl-20 xl:pl-60']).toBe(true)
    expect(classes['md:pl-16 xl:pl-56']).toBe(true)
  })

  it('getSidebarContentDynamicClass returns blur when collapsedSwitch true, not collapsed, and hovered', () => {
    // set state to collapsedSwitch true but not collapsed
    sharedMockSidebar.collapsed = false
    sharedMockSidebar.collapsedSwitch = true
    const sidebarHover = ref(true)
    const classes = getSidebarContentDynamicClass(false, sidebarHover).value

    expect(classes['blur-sm xl:blur-none']).toBe(true)
  })

  it('getSidebarFooterDynamicClass returns expected classes for footer', () => {
    const sidebarHover = ref(false)
    const classes = getSidebarFooterDynamicClass(sidebarHover).value

    // expanded
    expect(classes['md:pl-24 xl:pl-64']).toBe(true)
    expect(classes['blur-sm xl:blur-none']).toBe(false)

    // simulate hovered state with collapsedSwitch true and not collapsed
    sharedMockSidebar.collapsed = false
    sharedMockSidebar.collapsedSwitch = true
    sidebarHover.value = true
    const classesAfter = getSidebarFooterDynamicClass(sidebarHover).value
    expect(classesAfter['blur-sm xl:blur-none']).toBe(true)
  })
})

