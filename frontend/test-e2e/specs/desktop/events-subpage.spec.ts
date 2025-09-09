// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";

const MODAL_BUTTON_NAMES = ["View options to share this event with others",
  "Open a modal to download a QR code for this page"
]

const EVENT_SUBPAGES = ["team", "resources", "faq", "tasks", "discussion", "settings"]

test.beforeEach(async ({ page }) => {
  // Navigate to events page first, then to an event's about page
  await page.goto("/events?view=list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
  
  // Click on the first event to navigate to its about page
  const firstEventLink = page.getByLabel('Navigate to the page for this event').first();
  await firstEventLink.click();
  await page.waitForURL("**/events/**/about");
  
  const sidebar = newSidebarLeft(page);
  await expect(sidebar.root).toBeVisible();
});

test.describe("Test modal and sidebar functionality, also accessibility and hydration", { tag: "@desktop" }, () => {
  test("Test closing and opening of modals", async ({ page }) => {
    for(const buttonName of MODAL_BUTTON_NAMES){
      const qrButton = page.getByRole("button", { name: buttonName });
      await expect(qrButton).toBeVisible();
      
      await qrButton.click();
      
      const modal = page.locator('#search-modal').first();
      await expect(modal).toBeVisible();
      await page.click('button:has(svg path[d*="M16 8A8 8 0 1 1 0 8"])');
    }
  });

  test("QR code download works correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Open a modal to download a QR code for this page" }).click()
    const downloadPromise = page.waitForEvent('download');
    
    await page.getByRole('button', { name: 'Download a QR code that links to this page' }).click();
    
    const download = await downloadPromise;
    await expect(download.suggestedFilename()).toBeTruthy();
  });

  test("Test if sidebarButtons work correctly", async ({ page }) => {
    for(const text of EVENT_SUBPAGES){
      const sidebarButton = page.locator('#event-'+text);
      await expect(sidebarButton).toBeVisible();
      
      await sidebarButton.click();
      await expect(page).toHaveURL(new RegExp(`/${text}$`));
    }
  });

  test("test opening of details modal", async ({page}) => {
    const detailsDiv = page.locator('div.cursor-pointer.text-primary-text:has(svg)');
    await detailsDiv.click();

    const modal = page.locator('#search-modal').first();
    await expect(modal).toBeVisible();
  })

  test("Check if editing of About page works correctly", async({page}) =>{
    const detailsDiv = page.locator('div.cursor-pointer.text-primary-text:has(svg)');
    await detailsDiv.click();

    
    const textarea = page.locator('#form-item-description');
    await textarea.waitFor({ state: 'visible' });
    //modify event description
    await textarea.clear();
    const newRandomText = "This is random text"
    await textarea.fill(newRandomText)
    await page.click('#form-submit-id');

    //close modal
    await page.click('button:has(svg path[d*="M16 8A8 8 0 1 1 0 8"])');

    //check if about event description changed
    const aboutSection = page.locator('.card-style .flex-col:has(h3:text("About"))');
    const paragraph = aboutSection.locator('p.line-clamp-2');
    await expect(paragraph).toHaveText(newRandomText);

  })

  test("Test hydration of event title and key elements", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const eventTitle = page.locator('h1');
    await expect(eventTitle).toBeVisible();
    await expect(eventTitle).toHaveText(/./);
    
    const getInvolvedButton = page.getByRole('button', { name: /offer to help/i });
    if (await getInvolvedButton.isVisible()) {
      await expect(getInvolvedButton).toBeEnabled();
    }
  });

  test("Test hydration of interactive components", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const shareButton = page.getByRole('button', { name: /share/i });
    await expect( async () => {
      await expect(shareButton).toBeVisible();
      await expect(shareButton).toBeEnabled();
    }).toPass({ timeout: 500 })

    const subscribeButton = page.getByLabel('Download the calendar entry for this event')
    await expect( async () => {
      await expect(subscribeButton).toBeVisible();
      await expect(subscribeButton).toBeEnabled();
    }).toPass({ timeout: 500 })
  });

  test("Test keyboard navigation and focus management", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const shareButton = page.getByRole('button', { name: /share/i });
    await shareButton.focus();
    await expect(shareButton).toBeFocused();
    
    await page.keyboard.press('Tab');
    const subscribeButton = page.getByLabel('Download the calendar entry for this event')
    await expect(subscribeButton).toBeFocused();
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test("Test ARIA labels and semantic structure", async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const shareButton = page.getByRole('button', { name: /share/i });
    await expect(shareButton).toHaveAttribute('aria-label');
    
    const subscribeButton = page.getByLabel('Download the calendar entry for this event')
    await expect(subscribeButton).toHaveAttribute('aria-label');
    
    const mainContent = page.locator('main, [role="main"], h1').first();
    await expect(mainContent).toBeVisible();
  });

  test("Run accessibility scan", async ({ page }, testInfo) => {
    await page.waitForLoadState('networkidle');
    
    const violations = await runAccessibilityTest(
      "events-subpage",
      page,
      testInfo
    );
    
    expect(violations).toHaveLength(0);
  });
})



