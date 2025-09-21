// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newEditModal } from "~/test-e2e/component-objects/EditModal";
import { newOrganizationMenu } from "~/test-e2e/component-objects/OrganizationMenu";
import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSocialLinksModal } from "~/test-e2e/component-objects/SocialLinksModal";
import { newOrganizationAboutPage } from "~/test-e2e/page-objects/organization/OrganizationAboutPage";
import { newOrganizationEventsPage } from "~/test-e2e/page-objects/organization/OrganizationEventsPage";
import { newOrganizationGroupsPage } from "~/test-e2e/page-objects/organization/OrganizationGroupsPage";
import { newOrganizationResourcesPage } from "~/test-e2e/page-objects/organization/OrganizationResourcesPage";
import { getEnglishText } from "~/utils/i18n";

export const newOrganizationPage = (page: Page) => ({
  // Main page elements
  pageHeading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n._global.share_organization_aria_label"),
      "i"
    ),
  }),

  // Navigation components
  sidebar: newSidebarLeft(page),
  menu: newOrganizationMenu(page),

  // Modals (component objects)
  shareModal: newShareModal(page),
  editModal: newEditModal(page),
  socialLinksModal: newSocialLinksModal(page),

  // Lazy-loaded subpages (created on-demand for better performance)
  get aboutPage() {
    return newOrganizationAboutPage(page);
  },
  get eventsPage() {
    return newOrganizationEventsPage(page);
  },
  get groupsPage() {
    return newOrganizationGroupsPage(page);
  },
  get resourcesPage() {
    return newOrganizationResourcesPage(page);
  },
});
