import type { Page, Locator } from "@playwright/test";
import { PageObjectBase } from "../utils/PageObjectBase";
import { MobileNav } from "./MobileNav";
import { OrganizationMenu } from "./OrganizationMenu";
import { EventMenu } from "./EventMenu";

const locators = {
  HOME: "#home",
  EVENTS: "#events",
  ORGANIZATIONS: "#organizations",
  CREATE: "#create button",
  CREATE_EVENT: "#create-event",
  CREATE_ORGANIZATION: "#create-organization",
  INFO: "#info button",
  INFO_DROPDOWN: "#info ul",
  HELP: "#help",
  DOCS: "#docs",
  LEGAL: "#legal",
  USER_OPTIONS: "#user-options button",
  USER_OPTIONS_DROPDOWN: "#user-options ul",
  SIGN_IN: "#sign-in",
  SIGN_UP: "#sign-up",
}

export class Navigation extends PageObjectBase {
  readonly organizationMenu: OrganizationMenu;
  readonly eventMenu: EventMenu;
  readonly mobileNav: MobileNav;

  constructor(page: Page) {
    super(page, locators);
    this.mobileNav = new MobileNav(page);
    this.organizationMenu = new OrganizationMenu(page);
    this.eventMenu = new EventMenu(page);
  }

  get home(): Locator {
    return this.getLocator("HOME");
  }

  get events(): Locator {
    return this.getLocator("EVENTS");
  }

  get organizations(): Locator {
    return this.getLocator("ORGANIZATIONS");
  }

  get createEvent(): Locator {
    return this.getLocator("CREATE_EVENT");
  }

  get createOrganization(): Locator {
    return this.getLocator("CREATE_ORGANIZATION");
  }

  get info(): Locator {
    return this.getLocator("INFO");
  }

  get infoDropdown(): Locator {
    return this.getLocator("INFO_DROPDOWN");
  }

  get help(): Locator {
    return this.getLocator("HELP");
  }

  get docs(): Locator {
    return this.getLocator("DOCS");
  }

  get legal(): Locator {
    return this.getLocator("LEGAL");
  }

  get userOptions(): Locator {
    return this.getLocator("USER_OPTIONS");
  }

  get userOptionsDropdown(): Locator {
    return this.getLocator("USER_OPTIONS_DROPDOWN");
  }

  get signIn(): Locator {
    return this.getLocator("SIGN_IN");
  }

  get signUp(): Locator {
    return this.getLocator("SIGN_UP");
  }

  async openInfo(): Promise<void> {
    if (!(await this.infoDropdown.isVisible())) {
      await this.info.click();
      await this.infoDropdown.isVisible();
    }
  }

  async openUserOptions(): Promise<void> {
    if (!(await this.userOptionsDropdown.isVisible())) {
      await this.userOptions.click();
      await this.userOptionsDropdown.isVisible();
    }
  }
}
