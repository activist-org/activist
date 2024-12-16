// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";
import { newEntityMenu } from "./EntityMenu";

export const newOrganizationMenu = (parent: Page | Locator) => ({
  ...newEntityMenu(parent, "org"),
  eventsOption: parent.locator("#org-events"),
  groupsOption: parent.locator("#org-groups"),
  questionsOption: parent.locator("#org-faq"),
  affiliatesOption: parent.locator("#org-affiliates"),
});
