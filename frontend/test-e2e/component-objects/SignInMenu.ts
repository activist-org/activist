// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "~/utils/i18n";

export const newSignInMenu = (parent: Page | Locator) => ({
  toggleOpenButton: parent.locator("#user-options").getByRole("button", {
    name: new RegExp(
      getEnglishText(
        "i18n.components.dropdown_user_options.username_aria_label"
      ),
      "i"
    ),
  }),
  signInOption: parent.locator("#user-options").getByRole("menuitem", {
    name: new RegExp(getEnglishText("i18n._global.sign_in"), "i"),
  }),
  signUpOption: parent.locator("#user-options").getByRole("menuitem", {
    name: new RegExp(getEnglishText("i18n._global.sign_up"), "i"),
  }),
});
