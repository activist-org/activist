// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

export const newInfoMenu = (parent: Page | Locator) => ({
  toggleOpenButton: parent.getByRole("button", {
    name: /open to see options for learning more about activist and getting help/i,
  }),
  helpOption: parent.locator("#help"),
  documentationOption: parent.locator("#docs"),
  legalOption: parent.locator("#legal"),
});
