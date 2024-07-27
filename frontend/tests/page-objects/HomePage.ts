import type { Locator, Page } from "@playwright/test";
import TopicsDropdown from "../component-objects/TopicsDropdown";
import BasePage from "./BasePage";

export default class HomePage extends BasePage {
  public static readonly locators = {};

  readonly topicsDropdown: TopicsDropdown;

  constructor(page: Page) {
    super(page, "Home Page", "/home");
    this.topicsDropdown = new TopicsDropdown(page);
    this.setLocators(HomePage.locators);
  }
}
