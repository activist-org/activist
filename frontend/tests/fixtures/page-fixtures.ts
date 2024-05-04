import { test as baseTest } from "@playwright/test";
import LandingPage from "../page-objects/LandingPage";

export const test = baseTest.extend<{ landingPage: LandingPage }>({
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await use(landingPage);
  },
});

export { expect } from "@playwright/test";
export { LandingPage };
