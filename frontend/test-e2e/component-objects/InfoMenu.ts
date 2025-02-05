// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { getI18nString } from "~/utils/enUs";

export const newInfoMenu = (parent: Page | Locator) => ({
  toggleOpenButton: parent.getByRole("button", {
    name: new RegExp(
      getI18nString("components.dropdown_info.info_aria_label"),
      "i"
    ),
  }),
  helpOption: parent.locator("#help"),
  documentationOption: parent.locator("#docs"),
  legalOption: parent.locator("#legal"),
});
