// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TooltipBase from '../../../app/components/tooltip/TooltipBase.vue'

describe('TooltipBase component', () => {
  it('renders header and text when provided', () => {
    const wrapper = mount(TooltipBase, {
      props: {
        header: 'Tooltip Title',
        text: 'Some tooltip body text.'
      }
    })

    expect(wrapper.find('[data-testid="tooltip-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tooltip-header"]').text()).toBe('Tooltip Title')
    expect(wrapper.find('[data-testid="tooltip-text"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tooltip-text"]').text()).toBe('Some tooltip body text.')
  })

  it('does not render header or text when not provided', () => {
    const wrapper = mount(TooltipBase)
    expect(wrapper.find('[data-testid="tooltip-header"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="tooltip-text"]').exists()).toBe(false)
  })

  it('renders slot content when provided', () => {
    const wrapper = mount(TooltipBase, {
      slots: {
        default: '<div class="slot-content">Slot Text</div>'
      }
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.find('.slot-content').text()).toBe('Slot Text')
  })

  it('applies correct classes when no slot is provided', () => {
    const wrapper = mount(TooltipBase)
    const classes = wrapper.classes()
    expect(classes).toContain('tooltip')
    expect(classes).toContain('z-20')
    expect(classes).toContain('bg-layer-1')
    // Conditional class block
    expect(classes).toContain('w-max')
    expect(classes).toContain('px-2')
    expect(classes).toContain('py-1')
    expect(classes).toContain('elem-shadow-sm')
    // Should NOT include slot-based classes
    expect(classes).not.toContain('elem-shadow-md')
  })

  it('applies correct classes when slot is provided', () => {
    const wrapper = mount(TooltipBase, {
      slots: { default: '<span>Custom Slot</span>' }
    })
    const classes = wrapper.classes()
    expect(classes).toContain('tooltip')
    expect(classes).toContain('elem-shadow-md')
    expect(classes).toContain('px-3')
    expect(classes).toContain('py-2')
    expect(classes).not.toContain('elem-shadow-sm')
  })
})
