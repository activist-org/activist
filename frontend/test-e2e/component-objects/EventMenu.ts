// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";
import { newEntityMenu } from "./EntityMenu";

export const newEventMenu = (parent: Page | Locator) =>
  newEntityMenu(parent, "event");
