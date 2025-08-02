// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";

import DropdownTheme from "@/components/dropdown/DropdownTheme.vue";
import render from "@/test/render";

mockNuxtImport("useColorMode", () => useColorModeMock);

// Theme switching should be tested in the e2e tests.
// Mocking theme switching to make it work in component tests is too complicated.
describe("DropdownTheme", () => {
  it("shows translated options", async () => {
    await render(DropdownTheme);

    const menuButton = screen.getByRole("button", {
      name: /open the dropdown to select another theme/i,
    });
    expect(menuButton.textContent).toMatch(/^theme$/i);

    await fireEvent.click(menuButton);

    const systemOption = await screen.findByRole("menuitem", {
      name: /switch to the system color mode/i,
    });
    expect(systemOption.textContent).toMatch(/^system$/i);

    const lightOption = screen.getByRole("menuitem", {
      name: /switch to light mode/i,
    });
    expect(lightOption.textContent).toMatch(/^light$/i);

    const darkOption = screen.getByRole("menuitem", {
      name: /switch to dark mode/i,
    });
    expect(darkOption.textContent).toMatch(/^dark$/i);
  });
});
