// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group FAQ Page
 * Handles interactions with the group FAQ page within an organization
 */
export const newOrganizationGroupFAQPage = (page: Page) => {
  return {
    // MARK: FAQ LIST ELEMENTS
    get newFaqButton() {
      return page.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.pages._global.new_faq_aria_label"),
          "i"
        ),
      });
    },

    get faqList() {
      return page.getByTestId("organization-group-faq-list");
    },

    get faqCards() {
      return page.getByTestId("faq-card");
    },

    get firstFaqCard() {
      return this.faqCards.first();
    },

    get lastFaqCard() {
      return this.faqCards.last();
    },

    // MARK: FAQ CARD ELEMENTS (by index)
    getFaqCard(index: number) {
      return page.getByTestId("faq-card").nth(index);
    },

    getFaqQuestion(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-question");
    },

    getFaqAnswer(index: number) {
      return page.getByTestId("faq-card").nth(index).getByTestId("faq-answer");
    },

    getFaqDragHandle(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-drag-handle");
    },

    getFaqDisclosureButton(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
    },

    getFaqEditButton(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-edit-button");
    },

    // MARK: FAQ DISCLOSURE ELEMENTS
    getFaqDisclosurePanel(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-panel");
    },

    getFaqChevronUp(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-chevron-up");
    },

    getFaqChevronDown(index: number) {
      return page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-chevron-down");
    },

    // MARK: EMPTY STATE ELEMENTS
    get emptyState() {
      return page.getByTestId("empty-state");
    },

    get emptyStateMessage() {
      return this.emptyState.getByRole("heading", { level: 4 }).first();
    },

    // MARK: MODAL ELEMENTS
    get faqModal() {
      return page.locator("#modal").first();
    },

    get faqModalCloseButton() {
      return this.faqModal.getByTestId("modal-close-button");
    },

    get editFaqModal() {
      return page.locator("#modal").first();
    },

    get editFaqModalCloseButton() {
      return this.editFaqModal.getByTestId("modal-close-button");
    },

    // Form elements within FAQ modal
    getFaqQuestionInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_faq_entry.question"),
          "i"
        ),
      });
    },

    getFaqAnswerInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_faq_entry.answer"),
          "i"
        ),
      });
    },

    getFaqSubmitButton(modal: Locator) {
      return modal.getByRole("button", {
        name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
      });
    },

    // MARK: TAB NAVIGATION ELEMENTS
    get tabs() {
      return page.getByRole("tablist");
    },

    get aboutTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.about"), "i"),
      });
    },

    get eventsTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.events"), "i"),
      });
    },

    get resourcesTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.resources"), "i"),
      });
    },

    get faqTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.faq"), "i"),
      });
    },

    // MARK: ACTIONS
    async clickNewFaq() {
      await this.newFaqButton.click();
    },

    async clickFaqDisclosure(index: number) {
      await this.getFaqDisclosureButton(index).click();
    },

    async clickFaqEdit(index: number) {
      await this.getFaqEditButton(index).click();
    },

    async clickAboutTab() {
      await this.aboutTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/about/);
    },

    async clickEventsTab() {
      await this.eventsTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/events/);
    },

    async clickResourcesTab() {
      await this.resourcesTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/resources/);
    },

    async clickFaqTab() {
      await this.faqTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/faq/);
    },

    // MARK: VERIFICATION METHODS
    async getFaqCount() {
      return await this.faqCards.count();
    },

    async isNewFaqButtonVisible() {
      return await this.newFaqButton.isVisible();
    },

    async isFaqTabActive() {
      return (await this.faqTab.getAttribute("aria-selected")) === "true";
    },

    async isEmptyStateVisible() {
      return await this.emptyState.isVisible();
    },

    async hasFaqEntries() {
      const count = await this.getFaqCount();
      return count > 0;
    },

    // MARK: FAQ CONTENT METHODS
    async getFaqQuestionText(index: number) {
      return await this.getFaqQuestion(index).textContent();
    },

    async getFaqAnswerText(index: number) {
      return await this.getFaqAnswer(index).textContent();
    },

    async isFaqExpanded(index: number) {
      const chevronUp = this.getFaqChevronUp(index);
      return await chevronUp.isVisible();
    },

    async isFaqCollapsed(index: number) {
      const chevronDown = this.getFaqChevronDown(index);
      return await chevronDown.isVisible();
    },

    // MARK: FAQ INTERACTION METHODS
    async expandFaq(index: number) {
      const expandButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
      await expandButton.click();
    },

    async collapseFaq(index: number) {
      const collapseButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-disclosure-button");
      await collapseButton.click();
    },

    async editFaq(index: number) {
      const editButton = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-edit-button");
      await editButton.click();
    },

    // MARK: DRAG AND DROP METHODS
    async getFaqDragHandlePosition(index: number) {
      const dragHandle = page
        .getByTestId("faq-card")
        .nth(index)
        .getByTestId("faq-drag-handle");
      return await dragHandle.boundingBox();
    },

    async dragFaqToPosition(fromIndex: number, toIndex: number) {
      const sourceHandle = this.getFaqDragHandle(fromIndex);
      const targetHandle = this.getFaqDragHandle(toIndex);

      const sourceBox = await sourceHandle.boundingBox();
      const targetBox = await targetHandle.boundingBox();

      if (sourceBox && targetBox) {
        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height / 2;

        // Hover over the source handle first.
        await page.mouse.move(startX, startY);
        await page.waitForTimeout(200);

        // Start drag operation.
        await page.mouse.down();
        await page.waitForTimeout(300);

        // Move to target with more intermediate steps for smoother drag.
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          await page.mouse.move(currentX, currentY);
          await page.waitForTimeout(100);
        }

        // Hover over target for a moment before releasing.
        await page.mouse.move(endX, endY);
        await page.waitForTimeout(200);

        // Release the mouse.
        await page.mouse.up();
        await page.waitForTimeout(500);
      }
    },
  };
};

export type GroupFaqPage = ReturnType<typeof newOrganizationGroupFAQPage>;
