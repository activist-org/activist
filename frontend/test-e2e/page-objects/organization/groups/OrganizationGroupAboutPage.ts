// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group About Page
 * Handles interactions with the group about page within an organization
 */
export class OrganizationGroupAboutPage {
  constructor(private readonly page: Page) {}

  // Header elements
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

  // Main content elements
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

  // Modal elements
  get shareModal() {
    return this.page.getByTestId("modal-ModalSharePage");
  }

  get socialLinksModal() {
    return this.page.getByTestId("modal-ModalSocialLinksGroup");
  }

  get textModal() {
    return this.page.getByTestId("modal-ModalTextGroup");
  }

  // Tab navigation
  get tabs() {
    return this.page.locator('[role="tablist"]');
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

  // Actions
  async clickJoinGroup() {
    await this.joinGroupButton.click();
  }

  async clickShare() {
    await this.shareButton.click();
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

  // Verification methods
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
