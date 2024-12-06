import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";
import { HeaderWebsite } from "../component-objects/HeaderWebsite";

const locators = {
  USERNAME_INPUT: "#sign-in-username input",
  PASSWORD_INPUT: "#sign-in-password input",
  VISIBILITY_ICON: "#sign-in-password span[role='button']",
  SIGN_IN_BUTTON: "#sign-in-submit",
  FORGOT_PASSWORD_BUTTON: "#sign-in-forgot-password",
  SIGN_UP_LINK: "#sign-in-signup-link",
  PASSWORD_STRENGTH_INDICATOR: "#sign-in-password-strength",
  PASSWORD_STRENGTH_TEXT: "#sign-in-password-strength-text",
  PASSWORD_STRENGTH_PROGRESS: "#password-strength-indicator-progress",
  FRIENDLY_CAPTCHA: "#sign-in-captcha",
};

export class SignInPage extends PageObjectBase {
  readonly header: HeaderWebsite;

  constructor(page: Page) {
    super(page, locators, "Sign In Page", "/auth/sign-in");
    this.header = new HeaderWebsite(page);
  }

  get usernameInput(): Locator {
    return this.getLocator("USERNAME_INPUT");
  }

  get passwordInput(): Locator {
    return this.getLocator("PASSWORD_INPUT");
  }

  get visibilityIcon(): Locator {
    return this.getLocator("VISIBILITY_ICON");
  }

  get signInButton(): Locator {
    return this.getLocator("SIGN_IN_BUTTON");
  }

  get forgotPasswordButton(): Locator {
    return this.getLocator("FORGOT_PASSWORD_BUTTON");
  }

  get signUpLink(): Locator {
    return this.getLocator("SIGN_UP_LINK");
  }

  get passwordStrengthIndicator(): Locator {
    return this.getLocator("PASSWORD_STRENGTH_INDICATOR");
  }

  get passwordStrengthText(): Locator {
    return this.getLocator("PASSWORD_STRENGTH_TEXT");
  }

  get passwordStrengthProgress(): Locator {
    return this.getLocator("PASSWORD_STRENGTH_PROGRESS");
  }

  get friendlyCaptcha(): Locator {
    return this.getLocator("FRIENDLY_CAPTCHA");
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.fill(this.locators.USERNAME_INPUT, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.fill(this.locators.PASSWORD_INPUT, password);
  }

  async getPasswordInputType(): Promise<string> {
    const passwordInput = this.page.locator(this.locators.PASSWORD_INPUT);
    return (await passwordInput.getAttribute("type")) || "";
  }

  async clickVisibilityIcon(): Promise<void> {
    await this.page.click(this.locators.VISIBILITY_ICON);
  }

  async clickSignIn(): Promise<void> {
    await this.page.click(this.locators.SIGN_IN_BUTTON);
  }

  async clickForgotPassword(): Promise<void> {
    await this.page.click(this.locators.FORGOT_PASSWORD_BUTTON);
  }

  async clickSignUp(): Promise<void> {
    await this.page.click(this.locators.SIGN_UP_LINK);
  }

  async isPasswordStrengthIndicatorVisible(): Promise<boolean> {
    return await this.page.isVisible(this.locators.PASSWORD_STRENGTH_INDICATOR);
  }

  async isPasswordStrengthTextVisible(): Promise<boolean> {
    return await this.page.isVisible(this.locators.PASSWORD_STRENGTH_TEXT);
  }

  async isPasswordStrengthProgressVisible(): Promise<boolean> {
    return await this.page.isVisible(this.locators.PASSWORD_STRENGTH_PROGRESS);
  }

  async getPasswordStrengthText(): Promise<string> {
    const text =
      (await this.page.textContent(this.locators.PASSWORD_STRENGTH_TEXT)) || "";
    const strengthRegex = /Password strength: (.*)/;
    const match = text.match(strengthRegex);
    return match ? match[1] : "";
  }

  async getPasswordStrengthProgress(): Promise<string> {
    const style =
      (await this.page.getAttribute(
        this.locators.PASSWORD_STRENGTH_PROGRESS,
        "style"
      )) || "";
    const widthRegex = /width:\s*(\d+(\.\d+)?%)/;
    const match = style.match(widthRegex);
    return match ? match[1] : "0%";
  }

  async getPasswordStrengthIndicatorColor(): Promise<string> {
    const style =
      (await this.page.getAttribute(
        this.locators.PASSWORD_STRENGTH_PROGRESS,
        "class"
      )) || "";
    const colorRegex = /bg-\[(.*?)\]|bg-light-text|dark:bg-dark-text/;
    const match = style.match(colorRegex);
    if (match) {
      if (match[0] === "bg-light-text" || match[0] === "dark:bg-dark-text") {
        return match[0];
      }
      return match[1] || "";
    }
    return "";
  }

  async isFriendlyCaptchaVisible(): Promise<boolean> {
    return await this.page.isVisible(this.locators.FRIENDLY_CAPTCHA);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  // Mobile-specific methods
  async isMobileView(): Promise<boolean> {
    return await this.isMobile();
  }

  // Desktop-specific methods
  async isDesktopView(): Promise<boolean> {
    return !(await this.isMobile());
  }

  // Responsive design checks
  async checkResponsiveLayout(): Promise<void> {
    const isMobile = await this.isMobileView();
    if (isMobile) {
      // Add mobile-specific layout checks here
      // For example, check if certain elements are stacked vertically
    } else {
      // Add desktop-specific layout checks here
      // For example, check if certain elements are side by side
    }
  }
}
