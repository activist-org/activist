// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator } from "@playwright/test";

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
