// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Drag and drop utility functions for testing reorderable lists
 */

// MARK: Order Getters

/**
 * Gets the current order of resource cards by extracting their names/titles.
 * @param page - Playwright page object
 * @returns Array of resource names in their current order
 */
export async function getResourceCardOrder(page: Page): Promise<string[]> {
  await page.waitForSelector('[data-testid="resource-card"]');

  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="resource-card"]'))
      .map((card) => card.querySelector("h3")?.textContent?.trim() ?? "")
      .filter(Boolean)
  );
}

/**
 * Gets the current order of FAQ cards by extracting their questions.
 * @param page - Playwright page object
 * @returns Array of FAQ questions in their current order
 */
export async function getFAQCardOrder(page: Page): Promise<string[]> {
  await page.waitForSelector('[data-testid="faq-card"]');

  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="faq-card"]'))
      .map(
        (card) =>
          card
            .querySelector('[data-testid="faq-question"]')
            ?.textContent?.trim() ?? ""
      )
      .filter(Boolean)
  );
}

async function getReorderableListOrder(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const resources = Array.from(
      document.querySelectorAll('[data-testid="resource-card"]')
    )
      .map((card) => card.querySelector("h3")?.textContent?.trim() ?? "")
      .filter(Boolean);
    if (resources.length) {
      return resources;
    }

    return Array.from(document.querySelectorAll('[data-testid="faq-card"]'))
      .map(
        (card) =>
          card
            .querySelector('[data-testid="faq-question"]')
            ?.textContent?.trim() ?? ""
      )
      .filter(Boolean);
  });
}

// MARK: Drag and Drop Actions

async function scrollHandlesClearOfChrome(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator
): Promise<void> {
  const topChrome = 100;
  const bottomChrome = 130;
  for (let attempt = 0; attempt < 6; attempt++) {
    const sourceBox = await sourceLocator.boundingBox();
    const targetBox = await targetLocator.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error(
        "Could not get bounding boxes for drag and drop elements"
      );
    }

    const viewportHeight = page.viewportSize()?.height ?? 0;
    const top = Math.min(sourceBox.y, targetBox.y);
    const bottom = Math.max(
      sourceBox.y + sourceBox.height,
      targetBox.y + targetBox.height
    );
    if (top >= topChrome && bottom <= viewportHeight - bottomChrome) {
      return;
    }

    const mid = (top + bottom) / 2;
    const desired = topChrome + (viewportHeight - topChrome - bottomChrome) / 2;
    const deltaY = mid - desired;
    if (Math.abs(deltaY) < 2) {
      return;
    }

    await page.evaluate((scrollY) => window.scrollBy(0, scrollY), deltaY);
    await page.evaluate(
      () => new Promise<void>((r) => requestAnimationFrame(() => r()))
    );
  }
}

async function mouseDrag(
  page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  steps: number
): Promise<void> {
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.evaluate(
    () =>
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      )
  );
  // Nudge past Sortable's `distance` threshold before the main drag.
  await page.mouse.move(startX + (dx / dist) * 8, startY + (dy / dist) * 8);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    await page.mouse.move(startX + dx * t, startY + dy * t);
    await page.evaluate(() => new Promise(requestAnimationFrame));
  }
  await page.mouse.up();
}

async function touchDrag(
  page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  steps: number
): Promise<void> {
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const client = await page.context().newCDPSession(page);

  try {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y: startY }],
    });
    await page.evaluate(
      () =>
        new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r()))
        )
    );
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: startX + (dx / dist) * 8, y: startY + (dy / dist) * 8 },
      ],
    });
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: startX + dx * t, y: startY + dy * t }],
      });
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await client.detach().catch(() => {});
  }
}

/**
 * Performs a drag and drop operation from source to target.
 *
 * Desktop uses `page.mouse`. Mobile uses CDP touch so Sortable's touch /
 * force-fallback path runs and vuedraggable `@end` fires. The drag overshoots
 * the target by a distance scaled to card size and retries until the first two
 * list items actually swap.
 */
export async function performDragAndDrop(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator,
  steps = 30
): Promise<void> {
  const maxAttempts = 4;
  const beforeOrder = await getReorderableListOrder(page);
  if (beforeOrder.length < 2) {
    throw new Error("Need at least 2 reorderable items for drag and drop");
  }

  const hasTouch = await page.evaluate(() => navigator.maxTouchPoints > 0);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sourceLocator.scrollIntoViewIfNeeded();
    await targetLocator.scrollIntoViewIfNeeded();
    await scrollHandlesClearOfChrome(page, sourceLocator, targetLocator);

    const sourceBox = await sourceLocator.boundingBox();
    const targetBox = await targetLocator.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error(
        "Could not get bounding boxes for drag and drop elements"
      );
    }

    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    let endX = targetBox.x + targetBox.width / 2;
    let endY = targetBox.y + targetBox.height / 2;
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // Tall resource cards need overshoot past center; short FAQ cards do not.
    const overshootPx = Math.min(80, Math.max(24, dist * 0.35));
    endX += (dx / dist) * overshootPx;
    endY += (dy / dist) * overshootPx;

    if (hasTouch) {
      await touchDrag(page, startX, startY, endX, endY, steps);
    } else {
      await mouseDrag(page, startX, startY, endX, endY, steps);
    }

    await page
      .waitForFunction(
        () =>
          document.querySelectorAll(
            ".sortable-chosen, .sortable-drag, .sortable-ghost, .sortable-fallback"
          ).length === 0,
        { timeout: 5000 }
      )
      .catch(() => {});

    const afterOrder = await getReorderableListOrder(page);
    if (afterOrder[0] === beforeOrder[1] && afterOrder[1] === beforeOrder[0]) {
      return;
    }

    if (!hasTouch) {
      await page.mouse.up().catch(() => {});
    }
  }

  throw new Error(
    `Drag and drop did not swap the first two items after ${maxAttempts} attempts`
  );
}

// MARK: Verification

/**
 * Verifies that two items swapped positions, polling until the order settles.
 */
export async function verifyReorder(
  page: Page,
  expectedFirstItem: string,
  expectedSecondItem: string,
  getOrderFunction: (page: Page) => Promise<string[]>
): Promise<void> {
  await expect(async () => {
    const finalOrder = await getOrderFunction(page);
    expect(finalOrder[0]).toBe(expectedSecondItem);
    expect(finalOrder[1]).toBe(expectedFirstItem);
  }).toPass({ timeout: 10000, intervals: [100, 250, 500] });
}
