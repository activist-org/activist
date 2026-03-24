// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect } from "playwright/test";

import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

/**
 * Ensures the current event resources page has at least one `resource-card`.
 * If the list is empty (first event from `/events` may have no seeded resources),
 * creates one through the modal as the current user (expects admin).
 */
export async function ensureAtLeastOneEventResource(page: Page): Promise<void> {
  const { resourcesPage } = newEventPage(page);

  await expect(resourcesPage.newResourceButton).toBeVisible({
    timeout: 15000,
  });

  if ((await resourcesPage.resourceCards.count()) > 0) {
    return;
  }

  await resourcesPage.newResourceButton.click();
  await expect(resourcesPage.resourceModal).toBeVisible();

  const modal = resourcesPage.resourceModal;
  const suffix = Date.now();
  await resourcesPage.resourceNameInput(modal).fill(`E2E resource ${suffix}`);
  await resourcesPage
    .resourceDescriptionInput(modal)
    .fill("E2E seed resource for permissions tests.");
  await resourcesPage.resourceUrlInput(modal).fill("https://example.org");

  await resourcesPage.resourceSubmitButton(modal).click();

  await expect(resourcesPage.resourceModal).not.toBeVisible({
    timeout: 15000,
  });
  await expect(resourcesPage.resourceCards.first()).toBeVisible({
    timeout: 15000,
  });
}
