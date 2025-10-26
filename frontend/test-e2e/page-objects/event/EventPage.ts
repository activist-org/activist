// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newEditModal } from "~/test-e2e/component-objects/EditModal";
import { newEventMenu } from "~/test-e2e/component-objects/EventMenu";
import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSocialLinksModal } from "~/test-e2e/component-objects/SocialLinksModal";
import { newEventAboutPage } from "~/test-e2e/page-objects/event/about/EventAboutPage";
import { newEventFAQPage } from "~/test-e2e/page-objects/event/faq/EventFAQPage";
import { newEventResourcesPage } from "~/test-e2e/page-objects/event/resources/EventResourcesPage";
import { getEnglishText } from "~/utils/i18n";

export const newEventPage = (page: Page) => ({
  // MARK: Main Page

  pageHeading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n._global.share_event_aria_label"),
      "i"
    ),
  }),

  // MARK: Navigation Components

  sidebar: newSidebarLeft(page),
  menu: newEventMenu(page),

  // MARK: Modals

  shareModal: newShareModal(page),
  editModal: newEditModal(page),
  socialLinksModal: newSocialLinksModal(page),

  // MARK: Lazy-loaded Subpages
  get aboutPage() {
    return newEventAboutPage(page);
  },
  get faqPage() {
    return newEventFAQPage(page);
  },
  get resourcesPage() {
    return newEventResourcesPage(page);
  },
});
