// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newConnectCard } from "~/test-e2e/component-objects/ConnectCard";
import { newSocialLinksModal } from "~/test-e2e/component-objects/SocialLinksModal";

export const newOrganizationPage = (page: Page) => {
  const connectCard = newConnectCard(page);
  const socialLinksModal = newSocialLinksModal(page);

  return {
    // Page elements
    heading: page.getByRole("heading", { level: 1 }),
    navigation: page.locator('nav'),
    sidebar: page.locator('.sidebar'),
    
    // Tabs/sections
    aboutTab: page.getByRole("link", { name: /about/i }),
    eventsTab: page.getByRole("link", { name: /events/i }),
    groupsTab: page.getByRole("link", { name: /groups/i }),
    resourcesTab: page.getByRole("link", { name: /resources/i }),
    
    // Upload triggers
    uploadImageButton: page.locator('button:has-text("Upload"), button[aria-label*="upload"]'),
    organizationIconUpload: page.locator('[data-upload-type="organization-icon"]'),
    organizationCarouselUpload: page.locator('[data-upload-type="organization-carousel"]'),
    
    // Component objects
    connectCard,
    socialLinksModal,
    
    // Helper methods
    navigateToSection: async (section: 'about' | 'events' | 'groups' | 'resources') => {
      const tabMap = {
        about: page.getByRole("link", { name: /about/i }),
        events: page.getByRole("link", { name: /events/i }),
        groups: page.getByRole("link", { name: /groups/i }),
        resources: page.getByRole("link", { name: /resources/i }),
      };
      
      const tab = tabMap[section];
      if (await tab.count() > 0) {
        await tab.click();
      }
    },
    
    openSocialLinksModal: async () => {
      await connectCard.editButton.click();
      await socialLinksModal.root.waitFor({ state: 'visible' });
    },
    
    
    waitForPageLoad: async () => {
      await page.getByRole("heading", { level: 1 }).waitFor({ state: 'visible' });
    },
  };
};
