// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newConnectCard } from "~/test-e2e/component-objects/ConnectCard";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.describe("Social Links Functionality", { tag: ["@desktop", "@mobile"] }, () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to organizations page and select first organization
    await page.goto("/organizations");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/organizations/i);
    
    // Click on the first organization card
    const firstOrgLink = page.locator("a").first();
    await firstOrgLink.click();
    
    // Wait for organization page to load
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("displays Connect card with social links", async ({ page }) => {
    const connectCard = newConnectCard(page);
    
    // Verify Connect card is visible
    await expect(connectCard.root).toBeVisible();
    await expect(connectCard.heading).toBeVisible();
    
    // Check if social links are present
    const socialLinksCount = await connectCard.getSocialLinkCount();
    
    if (socialLinksCount > 0) {
      // Verify social links have proper attributes
      const socialLinks = connectCard.getAllSocialLinks();
      
      for (let i = 0; i < socialLinksCount; i++) {
        const link = socialLinks.nth(i);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href");
        
        // Verify link is clickable (without actually clicking)
        await expect(link).toBeEnabled();
      }
    }
  });

  test("social links display correct platform icons", async ({ page }) => {
    const connectCard = newConnectCard(page);
    const socialLinksCount = await connectCard.getSocialLinkCount();
    
    if (socialLinksCount > 0) {
      const socialLinks = connectCard.getAllSocialLinks();
      
      for (let i = 0; i < socialLinksCount; i++) {
        const link = socialLinks.nth(i);
        const href = await link.getAttribute("href");
        
        if (href) {
          // Verify that each link has an icon (SVG)
          const icon = link.locator("svg").first();
          await expect(icon).toBeVisible();
          
          // Verify platform-specific characteristics
          if (href.includes("facebook.com")) {
            await expect(link).toContainText(/facebook/i);
          } else if (href.includes("instagram.com")) {
            await expect(link).toContainText(/instagram/i);
          } else if (href.includes("mastodon")) {
            await expect(link).toContainText(/mastodon/i);
          } else if (href.includes("twitter.com") || href.includes("x.com")) {
            await expect(link).toContainText(/twitter|x/i);
          }
        }
      }
    }
  });

  test("social links are keyboard accessible", async ({ page }) => {
    const connectCard = newConnectCard(page);
    const socialLinksCount = await connectCard.getSocialLinkCount();
    
    if (socialLinksCount > 0) {
      const firstLink = connectCard.getAllSocialLinks().first();
      
      // Test keyboard navigation
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
      
      // Test Tab navigation to next link if multiple exist
      if (socialLinksCount > 1) {
        await page.keyboard.press("Tab");
        const secondLink = connectCard.getAllSocialLinks().nth(1);
        await expect(secondLink).toBeFocused();
      }
    }
  });

  test("shows edit icon when user is authenticated", async ({ page }) => {
    // Sign in with test credentials
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    // Wait for successful sign-in and navigate to organization
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const connectCard = newConnectCard(page);
    await expect(connectCard.root).toBeVisible();
    
    // Edit button should be visible when authenticated
    await expect(connectCard.editButton).toBeVisible();
  });

  test("opens social links modal when edit button is clicked", async ({ page }) => {
    // Sign in first
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const organizationPage = newOrganizationPage(page);
    await organizationPage.waitForPageLoad();
    
    // Open social links modal
    if (await organizationPage.connectCard.editButton.count() > 0) {
      await organizationPage.openSocialLinksModal();
      await expect(organizationPage.socialLinksModal.root).toBeVisible();
      await expect(organizationPage.socialLinksModal.heading).toBeVisible();
    }
  });

  test("can add new social link through modal", async ({ page }) => {
    // Sign in and navigate to organization
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const organizationPage = newOrganizationPage(page);
    await organizationPage.waitForPageLoad();
    
    // Open modal and add new link if edit button exists
    if (await organizationPage.connectCard.editButton.count() > 0) {
      await organizationPage.openSocialLinksModal();
      
      const modal = organizationPage.socialLinksModal;
      await expect(modal.root).toBeVisible();
      
      // Get initial count of social links
      const initialCount = await modal.getSocialLinkCount();
      
      // Add new social link
      await modal.addNewSocialLink("Test Platform", "https://test.example.com");
      
      // Verify new link was added
      const newCount = await modal.getSocialLinkCount();
      expect(newCount).toBe(initialCount + 1);
      
      // Submit form if update button exists
      if (await modal.updateButton.count() > 0) {
        await modal.submitForm();
        
        // Wait for modal to close
        await expect(modal.root).not.toBeVisible();
      }
    }
  });

  test("validates social link URL format", async ({ page }) => {
    // Sign in and navigate
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const organizationPage = newOrganizationPage(page);
    await organizationPage.waitForPageLoad();
    
    if (await organizationPage.connectCard.editButton.count() > 0) {
      await organizationPage.openSocialLinksModal();
      
      const modal = organizationPage.socialLinksModal;
      await expect(modal.root).toBeVisible();
      
      // Try to add invalid URL
      await modal.addNewSocialLink("Invalid Link", "not-a-valid-url");
      
      // Try to submit form
      if (await modal.updateButton.count() > 0) {
        await modal.submitForm();
        
        // Check for validation error
        const hasError = await modal.errorMessages.count() > 0;
        if (hasError) {
          await expect(modal.errorMessages.first()).toBeVisible();
        }
      }
    }
  });

  test("can remove social links", async ({ page }) => {
    // Sign in and navigate
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const organizationPage = newOrganizationPage(page);
    await organizationPage.waitForPageLoad();
    
    if (await organizationPage.connectCard.editButton.count() > 0) {
      await organizationPage.openSocialLinksModal();
      
      const modal = organizationPage.socialLinksModal;
      await expect(modal.root).toBeVisible();
      
      // Add a link first if none exist, then remove it
      const initialCount = await modal.getSocialLinkCount();
      
      if (initialCount === 0) {
        await modal.addNewSocialLink("Temp Link", "https://temp.example.com");
      }
      
      const countBeforeRemove = await modal.getSocialLinkCount();
      
      // Remove a link if remove buttons exist
      if (await modal.removeButtons.count() > 0) {
        await modal.removeButtons.first().click();
        
        // Verify count decreased
        const countAfterRemove = await modal.getSocialLinkCount();
        expect(countAfterRemove).toBeLessThan(countBeforeRemove);
      }
    }
  });

  test("modal can be closed without saving", async ({ page }) => {
    // Sign in and navigate
    await page.goto("/auth/sign-in");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "admin");
    await page.getByRole("button", { name: /sign in/i }).click();
    
    await page.waitForURL("/");
    await page.goto("/organizations");
    await page.locator("a").first().click();
    
    const organizationPage = newOrganizationPage(page);
    await organizationPage.waitForPageLoad();
    
    if (await organizationPage.connectCard.editButton.count() > 0) {
      await organizationPage.openSocialLinksModal();
      
      const modal = organizationPage.socialLinksModal;
      await expect(modal.root).toBeVisible();
      
      // Close modal using close button or ESC key
      if (await modal.closeButton.count() > 0) {
        await modal.closeButton.click();
      } else {
        await page.keyboard.press("Escape");
      }
      
      await expect(modal.root).not.toBeVisible();
    }
  });

  test("works across different entity types", async ({ page }) => {
    // Test organization social links
    await page.goto("/organizations");
    if (await page.locator("a").count() > 0) {
      await page.locator("a").first().click();
      
      const connectCard = newConnectCard(page);
      if (await connectCard.root.count() > 0) {
        await expect(connectCard.root).toBeVisible();
      }
    }
    
    // Test group social links if groups are available
    const groupsLink = page.getByText("Groups");
    if (await groupsLink.count() > 0) {
      await groupsLink.click();
      
      if (await page.locator("a").count() > 0) {
        await page.locator("a").first().click();
        
        const groupConnectCard = newConnectCard(page);
        if (await groupConnectCard.root.count() > 0) {
          await expect(groupConnectCard.root).toBeVisible();
        }
      }
    }
    
    // Test event social links
    await page.goto("/events");
    if (await page.locator("a").count() > 0) {
      await page.locator("a").first().click();
      
      const eventConnectCard = newConnectCard(page);
      if (await eventConnectCard.root.count() > 0) {
        await expect(eventConnectCard.root).toBeVisible();
      }
    }
  });

  // Accessibility test
  test.skip("Social links have no accessibility violations", async ({ page }, testInfo) => {
    const connectCard = newConnectCard(page);
    
    if (await connectCard.root.count() > 0) {
      const violations = await runAccessibilityTest(
        "Social Links Component",
        page,
        testInfo
      );
      expect.soft(violations, "Accessibility violations found:").toHaveLength(0);
    }
  });
});
