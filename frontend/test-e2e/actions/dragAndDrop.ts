// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

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

// MARK: Drag and Drop Actions

/**
 * Performs a drag and drop operation from source to target.
 * @remarks
 * Two strategies are used depending on whether the browser context has touch
 * emulation enabled (`hasTouch`):
 *
 * **Desktop** (`hasTouch: false`): Uses `page.mouse` move/down/up. Sortable.js
 * listens to mouse events in non-touch mode and this is the most reliable path.
 *
 * **Mobile** (`hasTouch: true`): Uses `PointerEvent`s dispatched directly via
 * `page.evaluate`. When `hasTouch` is enabled, Chromium enters touch emulation
 * mode and Sortable.js switches to its pointer/touch event path, ignoring
 * `page.mouse` MouseEvents entirely. Dispatching PointerEvents via
 * `dispatchEvent` bypasses this — Sortable.js listens to `pointerdown`,
 * `pointermove`, and `pointerup` on all platforms.
 *
 * `dragTo()` is not used because it dispatches a single jump with no
 * intermediate moves, which is too fast for Sortable.js to register a swap.
 * @param page - Playwright page object
 * @param sourceLocator - The locator for the element to drag (typically a drag handle)
 * @param targetLocator - The locator for the target position (typically another drag handle)
 * @param steps - Number of intermediate move steps (default: 20)
 */
export async function performDragAndDrop(
  page: Page,
  sourceLocator: Locator,
  targetLocator: Locator,
  steps = 20
): Promise<void> {
  const sourceBox = await sourceLocator.boundingBox();
  const targetBox = await targetLocator.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not get bounding boxes for drag and drop elements");
  }

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  const hasTouch = await page.evaluate(() => navigator.maxTouchPoints > 0);

  if (hasTouch) {
    await page.evaluate(
      async ({
        startX,
        startY,
        endX,
        endY,
        steps,
      }: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        steps: number;
      }) => {
        const rAF = () =>
          new Promise<void>((r) => requestAnimationFrame(() => r()));

        const dispatch = (type: string, x: number, y: number) => {
          const el = document.elementFromPoint(x, y);
          if (!el) return;
          el.dispatchEvent(
            new PointerEvent(type, {
              bubbles: true,
              cancelable: true,
              pointerId: 1,
              pointerType: "mouse",
              clientX: x,
              clientY: y,
              screenX: x,
              screenY: y,
              buttons: type === "pointerup" ? 0 : 1,
              pressure: type === "pointerup" ? 0 : 0.5,
            })
          );
        };

        dispatch("pointerdown", startX, startY);
        await rAF();
        await rAF();

        const dx = endX - startX;
        const dy = endY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        dispatch(
          "pointermove",
          startX + (dx / dist) * 8,
          startY + (dy / dist) * 8
        );
        await rAF();

        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          dispatch("pointermove", startX + dx * t, startY + dy * t);
          await rAF();
        }

        dispatch("pointerup", endX, endY);
        await rAF();
      },
      { startX, startY, endX, endY, steps }
    );
  } else {
    await page.mouse.move(startX, startY);
    await page.mouse.down();

    await page.evaluate(
      () =>
        new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r()))
        )
    );

    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    await page.mouse.move(startX + (dx / dist) * 8, startY + (dy / dist) * 8);
    await page.evaluate(() => new Promise(requestAnimationFrame));

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      await page.mouse.move(startX + dx * t, startY + dy * t);
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }

    await page.mouse.up();
  }

  await page
    .waitForFunction(
      () =>
        document.querySelectorAll(
          ".sortable-chosen, .sortable-drag, .sortable-ghost"
        ).length === 0,
      { timeout: 5000 }
    )
    .catch(() => {});
}

// MARK: Verification

/**
 * Verifies that two items were successfully reordered (swapped positions)
 * @param page - Playwright page object
 * @param expectedFirstItem - The item that should now be in the first position
 * @param expectedSecondItem - The item that should now be in the second position
 * @param getOrderFunction - Function to get the current order of items
 */
export async function verifyReorder(
  page: Page,
  expectedFirstItem: string,
  expectedSecondItem: string,
  getOrderFunction: (page: Page) => Promise<string[]>
): Promise<void> {
  await page.waitForFunction(
    async ({ expected }) => {
      // MARK: FAQ Card

      const faqCards = document.querySelectorAll('[data-testid="faq-card"]');
      if (faqCards.length >= 2) {
        const firstQuestion = faqCards[0]
          ?.querySelector('[data-testid="faq-question"]')
          ?.textContent?.trim();
        const secondQuestion = faqCards[1]
          ?.querySelector('[data-testid="faq-question"]')
          ?.textContent?.trim();

        if (
          firstQuestion === expected.second &&
          secondQuestion === expected.first
        ) {
          return true;
        }
      }

      // MARK: Resource Card

      const resourceCards = document.querySelectorAll(
        '[data-testid="resource-card"]'
      );
      if (resourceCards.length >= 2) {
        const firstResource = resourceCards[0]
          ?.querySelector("h3")
          ?.textContent?.trim();
        const secondResource = resourceCards[1]
          ?.querySelector("h3")
          ?.textContent?.trim();

        if (
          firstResource === expected.second &&
          secondResource === expected.first
        ) {
          return true;
        }
      }

      return false;
    },
    {
      expected: {
        first: expectedFirstItem,
        second: expectedSecondItem,
      },
    },
    {
      timeout: 10000,
      polling: 100,
    }
  );

  const finalOrder = await getOrderFunction(page);
  if (
    finalOrder[0] !== expectedSecondItem ||
    finalOrder[1] !== expectedFirstItem
  ) {
    throw new Error(
      `Reorder verification failed. Expected [${expectedSecondItem}, ${expectedFirstItem}], but got [${finalOrder[0]}, ${finalOrder[1]}]`
    );
  }
}
