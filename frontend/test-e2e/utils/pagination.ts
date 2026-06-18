// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { expect } from "~/test-e2e/global-fixtures";

const scrollListToBottom = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const container = document.querySelector(
      "[class*='overflow-y-scroll']"
    ) as HTMLElement | null;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }

    window.scrollTo(0, document.body.scrollHeight);
  });
};

const isPaginatedListResponse = (
  responseUrl: string,
  apiPath: string,
  pageNumber: string
): boolean => {
  const url = new URL(responseUrl);
  return (
    url.pathname.replace(/\/$/, "").endsWith(apiPath) &&
    url.searchParams.get("page") === pageNumber
  );
};

/**
 * Scroll the list container until pagination loads a second page. A single
 * scroll can fire before the layout settles or miss the bottom sentinel, so
 * re-scroll on each poll until the rendered card count grows past one page.
 */
export const loadSecondPage = async (
  page: Page,
  cards: Locator,
  options: { apiPath?: string; pageSize?: number } = {}
): Promise<void> => {
  const apiPath = options.apiPath ?? "/events/events";
  const pageSize = options.pageSize ?? 10;

  const pageTwoResponse = page
    .waitForResponse(
      (response) =>
        response.ok() &&
        isPaginatedListResponse(response.url(), apiPath, "2"),
      { timeout: 20000 }
    )
    .catch(() => null);

  await expect
    .poll(
      async () => {
        await scrollListToBottom(page);
        return cards.count();
      },
      { timeout: 20000, intervals: [300, 700, 1000, 1500, 2000] }
    )
    .toBeGreaterThan(pageSize);

  await pageTwoResponse;
};
