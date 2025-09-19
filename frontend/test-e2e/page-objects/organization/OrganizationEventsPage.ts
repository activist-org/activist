// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationEventsPage = (page: Page) => ({
  // Events page elements
  eventsNewButton: page.getByRole("link", {
    name: new RegExp(
      getEnglishText(
        "i18n.pages.organizations.events.new_org_event_aria_label"
      ),
      "i"
    ),
  }),
  eventsSubscribeButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText(
        "i18n.pages.organizations._global.subscribe_to_events_aria_label"
      ),
      "i"
    ),
  }),
});
