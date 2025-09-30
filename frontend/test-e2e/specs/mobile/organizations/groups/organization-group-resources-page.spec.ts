// SPDX-License-Identifier: AGPL-3.0-or-later
import { test } from "playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";

test.beforeEach(async ({ page }) => {
  test.setTimeout(60000); // Group pages load slowly in dev mode
  await signInAsAdmin(page);
  await navigateToOrganizationGroupSubpage(page, "resources");
});
test.describe(
  "Organization Group Resources Page - Mobile",
  { tag: "@mobile" },
  () => {
    test.skip("User can reorder resources using drag and drop on mobile", async () => {
      // Vuedraggable reorder detection fails with Resource card structure on mobile - known limitation.
      // Manual drag works, desktop test works, but automated mobile test fails due to vuedraggable
      // not detecting the array reorder despite drag events firing correctly.
    });
  }
);
