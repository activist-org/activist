// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Page Object Model for Organization Group FAQ Page
 * Handles interactions with the group FAQ page within an organization
 */
export class OrganizationGroupFAQPage {
  constructor(private readonly page: Page) {}

  // Header elements
  get newFaqButton() {
    return this.page.getByRole("button", { name: /new faq/i });
  }

  // FAQ cards
  get faqCards() {
    return this.page.locator('[data-testid="faq-card"]');
  }

  get firstFaqCard() {
    return this.faqCards.first();
  }

  get lastFaqCard() {
    return this.faqCards.last();
  }

  // FAQ drag handles
  getFaqDragHandle(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-drag-handle");
  }

  // FAQ questions
  getFaqQuestion(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-question");
  }

  // FAQ answers
  getFaqAnswer(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-answer");
  }

  // FAQ disclosure buttons
  getFaqDisclosureButton(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-disclosure-button");
  }

  // FAQ chevron icons
  getFaqChevronUp(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-chevron-up");
  }

  getFaqChevronDown(index: number) {
    return this.faqCards.nth(index).getByTestId("faq-chevron-down");
  }

  // Empty state
  get emptyState() {
    return this.page.locator('[data-testid="empty-state"]');
  }

  get emptyStateMessage() {
    return this.emptyState.getByText(/no faq entries found/i);
  }

  // Tab navigation
  get tabs() {
    return this.page.locator('[data-testid="tabs"]');
  }

  get aboutTab() {
    return this.tabs.getByRole("tab", { name: /about/i });
  }

  get eventsTab() {
    return this.tabs.getByRole("tab", { name: /events/i });
  }

  get resourcesTab() {
    return this.tabs.getByRole("tab", { name: /resources/i });
  }

  get faqTab() {
    return this.tabs.getByRole("tab", { name: /faq/i });
  }

  // Actions
  async clickNewFaq() {
    await this.newFaqButton.click();
  }

  async clickFaqDisclosure(index: number) {
    await this.getFaqDisclosureButton(index).click();
  }

  async clickAboutTab() {
    await this.aboutTab.click();
  }

  async clickEventsTab() {
    await this.eventsTab.click();
  }

  async clickResourcesTab() {
    await this.resourcesTab.click();
  }

  async clickFaqTab() {
    await this.faqTab.click();
  }

  // Verification methods
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

  // FAQ content methods
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

  // Drag and drop methods
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

      // Simulate drag with mouse events
      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await this.page.waitForTimeout(100);

      // Move to target with intermediate steps
      const steps = 5;
      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        await this.page.mouse.move(currentX, currentY);
        await this.page.waitForTimeout(50);
      }

      await this.page.mouse.up();
      await this.page.waitForTimeout(200);
    }
  }
}
