// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "~/utils/i18n";

export const newInfoMenu = (parent: Page | Locator) => {
  return {
    toggleOpenButton: parent.getByRole("button", {
      name: new RegExp(
        getEnglishText("i18n.components.dropdown_info.info_aria_label"),
        "i"
      ),
    }),
    helpOption: parent.locator("#info").getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n.components.dropdown_info.help"),
        "i"
      ),
    }),
    documentationOption: parent.locator("#info").getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n.components._global.documentation"),
        "i"
      ),
    }),
    legalOption: parent.locator("#info").getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n.components.dropdown_info.legal"),
        "i"
      ),
    }),
  };
};
