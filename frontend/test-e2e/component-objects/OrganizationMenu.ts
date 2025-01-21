// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";
import { newCommunityMenu } from "./CommunityMenu";

export const newOrganizationMenu = (parent: Page | Locator) => ({
  ...newCommunityMenu(parent, "org"),
  eventsOption: parent.locator("#org-events"),
  groupsOption: parent.locator("#org-groups"),
  questionsOption: parent.locator("#org-faq"),
  affiliatesOption: parent.locator("#org-affiliates"),
});
