// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group About Page
 * Handles interactions with the group about page within an organization
 */
export class OrganizationGroupAboutPage {
  constructor(private readonly page: Page) {}

  // MARK: Header

  get joinGroupButton() {
    return this.page.getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n._global.join_group_aria_label"),
        "i"
      ),
    });
  }

  get shareButton() {
    return this.page.getByRole("button", {
      name: new RegExp(
        getEnglishText(
          "i18n.pages.organizations.groups.about.share_group_aria_label"
        ),
        "i"
      ),
    });
  }

  // MARK: Main Content

  get aboutCard() {
    return this.page.getByTestId("card-about");
  }

  get imageCarousel() {
    return this.page.getByTestId("image-carousel");
  }

  get getInvolvedCard() {
    return this.page.getByTestId("card-get-involved");
  }

  get connectCard() {
    return this.page.getByTestId("card-connect");
  }

  // MARK: Modal Elements
  get shareModal() {
    return this.page.getByTestId("modal-ModalSharePage");
  }

  get socialLinksModal() {
    return this.page.getByTestId("modal-ModalSocialLinksGroup");
  }

  get textModal() {
    return this.page.getByTestId("modal-ModalTextGroup");
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
  async clickJoinGroup() {
    await this.joinGroupButton.click();
  }

  async clickShare() {
    await this.shareButton.click();
  }

  // Helper method to wait for tab state to update.
  private async waitForTabState(tab: Locator, expectedSelected: boolean) {
    await tab.waitFor({ state: "attached" });

    // Wait for the tab to have the correct aria-selected state.
    await this.page.waitForFunction(
      ({ tabSelector, expected }) => {
        const tabs = document.querySelectorAll(tabSelector);
        for (const tab of tabs) {
          if (tab.getAttribute("aria-selected") === expected) {
            return true;
          }
        }
        return false;
      },
      {
        tabSelector: '[role="tab"]',
        expected: expectedSelected.toString(),
      },
      { timeout: 10000 }
    );
  }

  async clickAboutTab() {
    await this.aboutTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/about/);
    await this.waitForTabState(this.aboutTab, true);
  }

  async clickEventsTab() {
    await this.eventsTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/events/);
    await this.waitForTabState(this.eventsTab, true);
  }

  async clickResourcesTab() {
    await this.resourcesTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/resources/);
    await this.waitForTabState(this.resourcesTab, true);
  }

  async clickFaqTab() {
    await this.faqTab.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(/.*\/groups\/.*\/faq/);
    await this.waitForTabState(this.faqTab, true);
  }

  async expandReduceText() {
    const expandButton = this.page.getByRole("button", {
      name: new RegExp(
        getEnglishText(
          "i18n.components.card.about._global.full_text_aria_label"
        ),
        "i"
      ),
    });
    const collapseButton = this.page.getByRole("button", {
      name: new RegExp(
        getEnglishText(
          "i18n.components.card.about._global.reduce_text_aria_label"
        ),
        "i"
      ),
    });

    if (await expandButton.isVisible()) {
      await expandButton.click();
    } else if (await collapseButton.isVisible()) {
      await collapseButton.click();
    }
  }

  // MARK: Verification

  async isJoinGroupButtonVisible() {
    return await this.joinGroupButton.isVisible();
  }

  async isShareButtonVisible() {
    return await this.shareButton.isVisible();
  }

  async isAboutCardVisible() {
    return await this.aboutCard.isVisible();
  }

  async isImageCarouselVisible() {
    return await this.imageCarousel.isVisible();
  }

  async isShareModalOpen() {
    return await this.shareModal.isVisible();
  }

  async isAboutTabActive() {
    return (await this.aboutTab.getAttribute("aria-selected")) === "true";
  }
}
