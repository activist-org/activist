import { expect, test } from "playwright/test";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { getEnglishText } from "~/utils/i18n";

const MODAL_BUTTON_NAMES = ["View options to share this event with others",
  "Open a modal to download a QR code for this page"
]

const EVENT_SUBPAGES = ["team", "resources", "faq", "tasks", "discussion", "settings"]

test.beforeEach(async ({ page }) => {
  await page.goto("/events/02275d0f-0f79-4478-a147-2cb1b50b3f22/about");
  const sidebar = newSidebarLeft(page);
  await expect(sidebar.root).toBeVisible();
});

test.describe("Test modal and sidebar functionality", { tag: "@desktop" }, () => {
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
      
      await expect(page).toHaveURL('/events/02275d0f-0f79-4478-a147-2cb1b50b3f22/'+text);
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
})



