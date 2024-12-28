import { test as baseTest } from "@playwright/test";
import { LandingPage } from "../page-objects/LandingPage";
import { HomePage } from "../page-objects/HomePage";
import { SignInPage } from "../page-objects/SignInPage";

type TestFixtures = {
  landingPage: LandingPage;
  homePage: HomePage;
  signInPage: SignInPage;
};

export const test = baseTest.extend<TestFixtures>({
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigateTo("/en");
    await landingPage.landingSplash.waitFor({ state: "visible" });
    await use(landingPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo("/home");
    const topics = homePage.topics;
    await topics.dropdown.waitFor({ state: "visible" });
    await use(homePage);
  },
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await signInPage.navigateTo("/auth/sign-in");
    await signInPage.signInButton.waitFor({ state: "visible" });
    await use(signInPage);
  },
});

export { expect } from "@playwright/test";
export { LandingPage, HomePage, SignInPage };
