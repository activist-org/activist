// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { expect } from "~/test-e2e/global-fixtures";

type SelectFirstComboboxOptionParams = {
  toggleButton: Locator;
  optionsLocator: Locator;
  multiSelect?: boolean;
  assertSelected?: () => Promise<void>;
};

/**
 * Open a combobox and select its first option.
 *
 * Options load asynchronously on mobile CI, so the open-and-wait cycle retries
 * until an option is visible. For multi-select comboboxes the dropdown stays
 * open after a pick and must be closed explicitly.
 */
export async function selectFirstComboboxOption({
  toggleButton,
  optionsLocator,
  multiSelect = false,
  assertSelected,
}: SelectFirstComboboxOptionParams): Promise<void> {
  const firstOption = optionsLocator.first();

  await expect(async () => {
    if ((await toggleButton.getAttribute("aria-expanded")) !== "true") {
      await toggleButton.click();
    }
    await expect(firstOption).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 20000 });

  await firstOption.click();

  if (
    multiSelect &&
    (await toggleButton.getAttribute("aria-expanded")) === "true"
  ) {
    await toggleButton.click();
  }

  await expect(firstOption).toBeHidden({ timeout: 5000 });

  if (assertSelected) {
    await assertSelected();
  }
}

/** Click a control until the target locator becomes visible. */
export async function clickUntilLocatorVisible(
  click: () => Promise<void>,
  target: Locator,
  timeout = 20000
): Promise<void> {
  await expect(async () => {
    if (!(await target.isVisible())) {
      await click();
    }
    await expect(target).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout });
}

/** Open the mobile #submenu listbox and click an option by accessible name. */
export async function selectMobileSubmenuOption(
  page: Page,
  optionName: RegExp
): Promise<void> {
  const submenu = page.locator("#submenu");
  await submenu.waitFor({ timeout: 5000 });

  const listboxButton = submenu.getByRole("button");
  await listboxButton.waitFor({ state: "attached", timeout: 5000 });

  const listbox = page.getByRole("listbox");
  const option = page.getByRole("option", { name: optionName });

  await expect(async () => {
    if ((await listboxButton.getAttribute("aria-expanded")) !== "true") {
      await listboxButton.click();
    }
    await expect(listbox).toBeVisible({ timeout: 2000 });
    await expect(option).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });

  await option.click({ force: true });
}
