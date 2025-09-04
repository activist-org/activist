// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newSocialLinksModal = (parent: Page | Locator) => {
  const root = parent
    .locator('[role="dialog"]')
    .filter({ hasText: /social.*links/i });

  return {
    root,
    heading: root.getByRole("heading"),

    // Form elements
    labelInputs: root.locator(
      'input[name*="label"], input[placeholder*="label"]'
    ),
    urlInputs: root.locator(
      'input[name*="link"], input[name*="url"], input[placeholder*="url"]'
    ),

    // Buttons
    addLinkButton: root.getByRole("button", { name: /add.*link/i }),
    updateButton: root.getByRole("button", { name: /update/i }),
    removeButtons: root.locator(
      'button:has-text("×"), button[aria-label*="remove"]'
    ),
    closeButton: root
      .locator('button[aria-label*="close"], button:has-text("×")')
      .first(),

    // Error messages
    errorMessages: root.locator('.error, [role="alert"], .text-red'),

    // Helper methods
    fillSocialLink: async (index: number, label: string, url: string) => {
      const labelInputs = root.locator(
        'input[name*="label"], input[placeholder*="label"]'
      );
      const urlInputs = root.locator(
        'input[name*="link"], input[name*="url"], input[placeholder*="url"]'
      );

      await labelInputs.nth(index).fill(label);
      await urlInputs.nth(index).fill(url);
    },

    getSocialLinkCount: async () => {
      const labelInputs = root.locator(
        'input[name*="label"], input[placeholder*="label"]'
      );
      return await labelInputs.count();
    },

    addNewSocialLink: async (label: string, url: string) => {
      const addButton = root.getByRole("button", { name: /add.*link/i });
      await addButton.click();

      const labelInputs = root.locator(
        'input[name*="label"], input[placeholder*="label"]'
      );
      const urlInputs = root.locator(
        'input[name*="link"], input[name*="url"], input[placeholder*="url"]'
      );
      const lastIndex = (await labelInputs.count()) - 1;

      await labelInputs.nth(lastIndex).fill(label);
      await urlInputs.nth(lastIndex).fill(url);
    },

    submitForm: async () => {
      const updateButton = root.getByRole("button", { name: /update/i });
      await updateButton.click();
    },
  };
};
