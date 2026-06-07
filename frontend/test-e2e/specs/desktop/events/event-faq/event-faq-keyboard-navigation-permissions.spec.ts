// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.describe(
  "Event FAQ Keyboard Permissions - Not Signed In",
  { tag: "@desktop" },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
      await navigateToFirstEvent(page);

      const eventPage = newEventPage(page);

      await eventPage.menu.questionsOption.click();
      await expect(page).toHaveURL(/.*\/events\/.*\/faq/);
    });

    test("not signed in: cannot focus FAQ cards (canEdit should be false)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page.waitForLoadState("domcontentloaded");
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      const faqCardsVisible = await faqPage.faqCards
        .first()
        .isVisible({ timeout: 15000 })
        .catch(() => false);

      test.skip(!faqCardsVisible, "No FAQs available to test");

      if (faqCardsVisible) {
        const firstCard = faqPage.getFAQCard(0);
        const tabindex = await firstCard.getAttribute("tabindex");
        expect(tabindex).toBe("-1");

        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");

        const focusedCards = await page
          .locator('[data-testid="faq-card"]:focus')
          .count();
        expect(focusedCards).toBe(0);
      }
    });

    test("not signed in: no edit controls visible (canEdit should be false)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      const faqCardsVisible = await faqPage.faqCards
        .first()
        .isVisible({ timeout: 15000 })
        .catch(() => false);

      test.skip(!faqCardsVisible, "No FAQs available to test");

      if (faqCardsVisible) {
        const dragHandles = await page
          .locator('[data-testid="faq-drag-handle"]')
          .count();
        expect(dragHandles).toBe(0);

        const editButtons = await page
          .locator('[data-testid="faq-edit-button"]')
          .count();
        expect(editButtons).toBe(0);

        const deleteButtons = await page
          .locator('[data-testid="faq-delete-button"]')
          .count();
        expect(deleteButtons).toBe(0);
      }
    });

    test("not signed in: arrow keys do not trigger API calls (canEdit should be false)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      await faqPage.faqCards
        .first()
        .waitFor({ state: "visible", timeout: 15000 })
        .catch(() => {});

      const faqCount = await faqPage.getFAQCount();

      test.skip(faqCount === 0, "No FAQs available to test");

      if (faqCount > 0) {
        let reorderRequestMade = false;
        page.on("request", (request) => {
          const url = request.url();
          const method = request.method();
          if (
            url.includes("/faq") &&
            (method === "PATCH" || method === "PUT")
          ) {
            reorderRequestMade = true;
          }
        });

        const firstCard = faqPage.getFAQCard(0);
        await firstCard.click();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowUp");
        await page.waitForTimeout(1000);

        expect(reorderRequestMade).toBe(false);
      }
    });
  }
);

test.describe(
  "Event FAQ Keyboard Permissions - Admin User",
  { tag: "@desktop" },
  () => {
    test.beforeEach(async ({ page }) => {
      await navigateToFirstEvent(page);

      const eventPage = newEventPage(page);

      await eventPage.menu.questionsOption.click();
      await expect(page).toHaveURL(/.*\/events\/.*\/faq/);
    });

    test("admin user: can focus FAQ cards (canEdit should be true)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page.waitForLoadState("domcontentloaded");
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      const faqCardsVisible = await faqPage.faqCards
        .first()
        .isVisible({ timeout: 15000 })
        .catch(() => false);

      test.skip(!faqCardsVisible, "No FAQs available to test");

      if (faqCardsVisible) {
        const firstCard = faqPage.getFAQCard(0);
        const tabindex = await firstCard.getAttribute("tabindex");
        expect(tabindex).toBe("0");
      }
    });

    test("admin user: edit controls are visible (canEdit should be true)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      const faqCardsVisible = await faqPage.faqCards
        .first()
        .isVisible({ timeout: 15000 })
        .catch(() => false);

      test.skip(!faqCardsVisible, "No FAQs available to test");

      if (faqCardsVisible) {
        const dragHandles = await page
          .locator('[data-testid="faq-drag-handle"]')
          .count();
        expect(dragHandles).toBeGreaterThan(0);

        const editButtons = await page
          .locator('[data-testid="faq-edit-button"]')
          .count();
        expect(editButtons).toBeGreaterThan(0);
      }
    });

    test("admin user: can reorder FAQs with keyboard (canEdit should be true)", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;

      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      await faqPage.faqCards
        .first()
        .waitFor({ state: "visible", timeout: 15000 })
        .catch(() => {});

      const faqCount = await faqPage.getFAQCount();

      test.skip(faqCount < 2, "Need at least 2 FAQs to test reordering");

      if (faqCount >= 2) {
        const getQuestionTexts = async () => {
          const questions = await page
            .locator('[data-testid="faq-question"]')
            .allTextContents();
          return questions;
        };

        const initialOrder = await getQuestionTexts();

        const firstCard = faqPage.getFAQCard(0);
        await firstCard.focus();
        await page.waitForTimeout(200);

        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(1000);

        const newOrder = await getQuestionTexts();

        expect(newOrder[0]).toBe(initialOrder[1]);
        expect(newOrder[1]).toBe(initialOrder[0]);
      }
    });
  }
);
