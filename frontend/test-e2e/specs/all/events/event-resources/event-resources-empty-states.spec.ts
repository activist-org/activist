// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Event resources lists come from `useGetEvent` (embedded `resources`), not a separate list URL.
 * Mock GET `/api/public/events/events/:id` before navigation (client-only fetch; see nuxt `ssr: false`).
 */
import { getEnglishText } from "#shared/utils/i18n";

import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import {
  MOCK_EVENT_EMPTY_STATE_ID,
  mockEventDetailPayload,
  routeMockPublicEventDetail,
  sampleResourceForMock,
} from "~/test-e2e/utils/mock-public-event-detail";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe(
  "Admin sees editable empty state on event resources page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Shows empty state with editable copy when event has no resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicEventDetail(
        page,
        MOCK_EVENT_EMPTY_STATE_ID,
        mockEventDetailPayload(MOCK_EVENT_EMPTY_STATE_ID, { resources: [] })
      );
      await page.goto(`/events/${MOCK_EVENT_EMPTY_STATE_ID}/resources`);

      const { resourcesPage } = newEventPage(page);
      await expect(resourcesPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(resourcesPage.resourcesList).not.toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.resources_header"),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.message_with_permission"
            ),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("link", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.create_resource_aria_label"
            ),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(resourcesPage.newResourceButton).toBeVisible();
    });

    test("Does not show empty state when event has resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicEventDetail(
        page,
        MOCK_EVENT_EMPTY_STATE_ID,
        mockEventDetailPayload(MOCK_EVENT_EMPTY_STATE_ID, {
          resources: [sampleResourceForMock],
        })
      );
      await page.goto(`/events/${MOCK_EVENT_EMPTY_STATE_ID}/resources`);

      const { resourcesPage } = newEventPage(page);
      await expect(resourcesPage.resourcesList).toBeVisible({
        timeout: 15000,
      });
      await expect(resourcesPage.resourceCards).toHaveCount(1);
      await expect(resourcesPage.emptyState).not.toBeVisible();
    });
  }
);

test.describe(
  "Non-admin member sees read-only empty state on event resources page",
  { tag: ["@desktop", "@mobile", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Shows read-only empty state when event has no resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicEventDetail(
        page,
        MOCK_EVENT_EMPTY_STATE_ID,
        mockEventDetailPayload(MOCK_EVENT_EMPTY_STATE_ID, { resources: [] })
      );
      await page.goto(`/events/${MOCK_EVENT_EMPTY_STATE_ID}/resources`);

      const { resourcesPage } = newEventPage(page);
      await expect(resourcesPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.message_no_permission"
            ),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("link", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.create_resource_aria_label"
            ),
            "i"
          ),
        })
      ).not.toBeVisible();
      await expect(resourcesPage.newResourceButton).not.toBeVisible();
    });
  }
);
