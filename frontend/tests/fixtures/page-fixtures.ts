import { test as baseTest } from "@playwright/test";
import LandingPage from "../page-objects/LandingPage";
import HomePage from "../page-objects/HomePage";

export const test = baseTest.extend<{
  landingPage: LandingPage,
  homePage: HomePage
}>({
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await use(landingPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  }
});

export { expect } from "@playwright/test";
export { LandingPage, HomePage };
