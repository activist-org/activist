import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import PageFilter from "@/components/page/filter/PageFilter.vue";


describe('PageFilter', () => {
  const minimumProps = {
    sections: [
      {
        title: 'Popular Tags',
        tags: [
          { id: 1, name: 'Tag 1', selected: false },
          { id: 2, name: 'Tag 2', selected: false },
          { id: 3, name: 'Tag 3', selected: false },
          { id: 4, name: 'Tag 4', selected: false },
        ]
      }
    ],
    tabs: [
      { id: 'tab1', name: 'Tab 1' },
      { id: 'tab2', name: 'Tab 2' },
      { id: 'tab3', name: 'Tab 3' }
    ]
  }

  it('should render', () => {
    // Basic render test with minimum required props
    const { container } = render(PageFilter, {
      props: minimumProps,
      global: {
        provide: {
          useDevice: () => ({ isMacOS: false })
        },
        stubs: {
          'Icon': true,
          'BtnTag': true,
          'TooltipBase': true
        }
      }
    })

    expect(screen.getByText('Popular Tags')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeTruthy()
    expect(screen.getByLabelText('Search to filter')).toBeTruthy()
    expect(screen.getByRole('textbox', { id: 'input-search' })).toBeTruthy()
  })
})
