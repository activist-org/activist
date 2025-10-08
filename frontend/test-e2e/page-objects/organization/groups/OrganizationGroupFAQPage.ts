// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group FAQ Page
 * Handles interactions with the group FAQ page within an organization
 */
export class OrganizationGroupFAQPage {
  constructor(private readonly page: Page) {}

  // MARK: New FAQ

  get newFaqButton() {
    return this.page.getByRole("button", {
      name: new RegExp(
        getEnglishText("i18n.pages._global.new_faq_aria_label"),
        "i"
      ),
    });
  }

  // MARK: FAQ List

  get faqList() {
    return this.page.getByTestId("organization-group-faq-list");
  }

  get faqCards() {
    return this.page.getByTestId("faq-card");
  }

  get firstFaqCard() {
    return this.faqCards.first();
  }

  get lastFaqCard() {
    return this.faqCards.last();
  }

  // MARK:FAQ Card

  getFaqCard(index: number) {
    return this.page.getByTestId("faq-card").nth(index);
  }

  getFaqQuestion(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-question");
  }

  getFaqAnswer(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-answer");
  }

  getFaqDragHandle(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-drag-handle");
  }

  getFaqDisclosureButton(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button");
  }

  getFaqEditButton(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-edit-button");
  }

  // MARK: FAQ Disclosure

  getFaqDisclosurePanel(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-panel");
  }

  getFaqChevronUp(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-chevron-up");
  }

  getFaqChevronDown(index: number) {
    return this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-chevron-down");
  }

  // MARK: Empty State

  get emptyState() {
    return this.page.getByTestId("empty-state");
  }

  get emptyStateMessage() {
    return this.emptyState.getByRole("heading", { level: 4 }).first();
  }

  // Modal elements (opened by new FAQ button) - Not implemented yet.
  get faqModal() {
    return this.page.locator("#modal").first();
  }

  get faqModalCloseButton() {
    return this.faqModal.getByTestId("modal-close-button");
  }

  // Edit modal elements (opened by edit button) - Not implemented yet.
  get editFaqModal() {
    return this.page.locator("#modal").first();
  }

  get editFaqModalCloseButton() {
    return this.editFaqModal.getByTestId("modal-close-button");
  }

  // Form elements within FAQ modal (using specific IDs from the form).
  getFaqQuestionInput(modal: Locator) {
    return modal.getByRole("textbox", {
      name: new RegExp(
        getEnglishText("i18n.components.form_faq_entry.question"),
        "i"
      ),
    });
  }

  getFaqAnswerInput(modal: Locator) {
    return modal.getByRole("textbox", {
      name: new RegExp(
        getEnglishText("i18n.components.form_faq_entry.answer"),
        "i"
      ),
    });
  }

  getFaqSubmitButton(modal: Locator) {
    return modal.getByRole("button", {
      name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
    });
  }

  // MARK: Tab Navigation

  get tabs() {
    return this.page.getByRole("tablist");
  }

  get aboutTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.about"), "i"),
    });
  }

  get eventsTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.events"), "i"),
    });
  }

  get resourcesTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.resources"), "i"),
    });
  }

  get faqTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.faq"), "i"),
    });
  }

  // MARK: Actions

  async clickNewFaq() {
    await this.newFaqButton.click();
  }

  async clickFaqDisclosure(index: number) {
    await this.getFaqDisclosureButton(index).click();
  }

  async clickFaqEdit(index: number) {
    await this.getFaqEditButton(index).click();
  }

  async clickAboutTab() {
    await this.aboutTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/about/);
  }

  async clickEventsTab() {
    await this.eventsTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/events/);
  }

  async clickResourcesTab() {
    await this.resourcesTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/resources/);
  }

  async clickFaqTab() {
    await this.faqTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/faq/);
  }

  // MARK: Verification

  async getFaqCount() {
    return await this.faqCards.count();
  }

  async isNewFaqButtonVisible() {
    return await this.newFaqButton.isVisible();
  }

  async isFaqTabActive() {
    return (await this.faqTab.getAttribute("aria-selected")) === "true";
  }

  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async hasFaqEntries() {
    const count = await this.getFaqCount();
    return count > 0;
  }

  // MARK: FAQ Content

  async getFaqQuestionText(index: number) {
    return await this.getFaqQuestion(index).textContent();
  }

  async getFaqAnswerText(index: number) {
    return await this.getFaqAnswer(index).textContent();
  }

  async isFaqExpanded(index: number) {
    const chevronUp = this.getFaqChevronUp(index);
    return await chevronUp.isVisible();
  }

  async isFaqCollapsed(index: number) {
    const chevronDown = this.getFaqChevronDown(index);
    return await chevronDown.isVisible();
  }

  // MARK: FAQ Interaction

  async expandFaq(index: number) {
    const expandButton = this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await expandButton.click();
  }

  async collapseFaq(index: number) {
    const collapseButton = this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-disclosure-button");
    await collapseButton.click();
  }

  async editFaq(index: number) {
    const editButton = this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-edit-button");
    await editButton.click();
  }

  // MARK: Drag and Drop

  async getFaqDragHandlePosition(index: number) {
    const dragHandle = this.page
      .getByTestId("faq-card")
      .nth(index)
      .getByTestId("faq-drag-handle");
    return await dragHandle.boundingBox();
  }

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
      await this.page.mouse.move(startX, startY);
      await this.page.waitForTimeout(200);

      // Start drag operation.
      await this.page.mouse.down();
      await this.page.waitForTimeout(300);

      // Move to target with more intermediate steps for smoother drag.
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        await this.page.mouse.move(currentX, currentY);
        await this.page.waitForTimeout(100);
      }

      // Hover over target for a moment before releasing.
      await this.page.mouse.move(endX, endY);
      await this.page.waitForTimeout(200);

      // Release the mouse.
      await this.page.mouse.up();
      await this.page.waitForTimeout(500);
    }
  }
}
