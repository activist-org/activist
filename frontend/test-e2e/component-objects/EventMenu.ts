// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { newCommunityMenu } from "./CommunityMenu";

export const newEventMenu = (parent: Page | Locator) =>
  newCommunityMenu(parent, "event");
