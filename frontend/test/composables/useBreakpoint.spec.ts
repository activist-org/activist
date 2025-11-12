import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useBreakpoint from '../../app/composables/useBreakpoint'

describe('useBreakpoint composable', () => {
  const originalWindow = (globalThis as any).window

  beforeEach(() => {
    vi.stubGlobal('window', {
      innerWidth: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    ;(globalThis as any).window = originalWindow
  })

  it('returns true when width matches small breakpoint', () => {
    ;(globalThis as any).window.innerWidth = 500
    const isSmall = useBreakpoint('sm')
    expect(isSmall.value).toBe(true)
  })

  it('returns true when width matches medium breakpoint', () => {
    ;(globalThis as any).window.innerWidth = 800
    const isMedium = useBreakpoint('md')
    expect(isMedium.value).toBe(true)
  })

  it('returns true when width matches large breakpoint', () => {
    ;(globalThis as any).window.innerWidth = 1200
    const isLarge = useBreakpoint('lg')
    expect(isLarge.value).toBe(true)
  })
})
