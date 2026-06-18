// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Response } from "@playwright/test";

import type { EventDetailsEditModal } from "~/test-e2e/component-objects/EventDetailsEditModal";

import { expect } from "~/test-e2e/global-fixtures";

export function isPutEventDetailsResponse(eventId: string) {
  return (res: Response) => {
    if (res.request().method() !== "PUT") return false;
    const path = new URL(res.url()).pathname.replace(/\/$/, "");
    return path.endsWith(`/events/events/${eventId}`);
  };
}

export async function markAllScheduleDaysAllDay(modal: EventDetailsEditModal) {
  const allDayCheckboxes = modal.root.locator(
    "input[data-testid^='all-day-long-event-']"
  );
  const count = await allDayCheckboxes.count();
  for (let index = 0; index < count; index += 1) {
    const checkbox = modal.allDayCheckbox(index);
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.check();
  }
}

export async function openOrgsDropdown(modal: EventDetailsEditModal) {
  await modal.orgsComboboxButton.click();
  await expect(modal.orgDropdownOptions.first()).toBeVisible({
    timeout: 10000,
  });
}

export async function closeOrgsDropdown(modal: EventDetailsEditModal) {
  await modal.orgsComboboxButton.click();
  await expect(modal.orgDropdownOptions.first()).toBeHidden({
    timeout: 5000,
  });
}

export async function selectOrgOptionByIndex(
  modal: EventDetailsEditModal,
  index: number
) {
  await openOrgsDropdown(modal);
  await modal.orgDropdownOptions.nth(index).click();
  await closeOrgsDropdown(modal);
}

/** Set each schedule day's start/end so backend receives start_time < end_time. */
export async function setScheduleTimesForAllDays(
  modal: EventDetailsEditModal,
  page: Page,
  startTime = "10:00",
  endTime = "11:00"
) {
  const timeEntries = await modal.root
    .locator('[id^="form-item-times."]')
    .all();
  const indices = new Set<string>();
  for (const element of timeEntries) {
    const id = await element.getAttribute("id");
    const match = id?.match(/form-item-times\.(\d+)\.(startTime|endTime)/);
    if (match?.[1]) indices.add(match[1]);
  }

  for (const index of Array.from(indices).sort()) {
    const startContainer = modal.startTimeField(index);
    await startContainer.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type(startTime);
    const endContainer = modal.endTimeField(index);
    await endContainer.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type(endTime);
  }
}

export async function submitDetailsEditForm(
  page: Page,
  modal: EventDetailsEditModal,
  eventId: string
) {
  const updateResponse = page.waitForResponse(
    isPutEventDetailsResponse(eventId),
    { timeout: 20000 }
  );
  await modal.submitButton.click();
  const response = await updateResponse;
  expect(
    response.ok(),
    `PUT event details expected success, got ${response.status()}`
  ).toBe(true);
  await expect(modal.root).not.toBeVisible({ timeout: 15000 });
}
