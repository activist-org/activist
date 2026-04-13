// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "~/test-e2e/global-fixtures";

test.describe("Smoke User Flows", { tag: ["@desktop", "@mobile", "@unauth"] }, () => {
  test.use({ storageState: undefined });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("Homepage loads and shows navigation", async ({ page }) => {
    await page.goto("/home");

    await expect(page).toHaveTitle(/activist/i);
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("User can open sign up page", async ({ page }) => {
    await page.goto("/auth/sign-up");

    await expect(page).toHaveURL(/\/auth\/sign-up/);
    await expect(page.getByRole("form").first()).toBeVisible();
  });

  test("Sign in shows validation feedback on empty submit", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.getByRole("button", { name: /sign in|login/i }).click();

    const requiredText = page.getByText(/required/i).first();
    const invalidFields = page.locator(
      "input[aria-invalid='true'], textarea[aria-invalid='true']"
    );

    await expect(requiredText.or(invalidFields.first())).toBeVisible();
  });

  test("Events page displays heading and at least one event card", async ({
    page,
  }) => {
    await page.goto("/events?view=list");

    await expect(page.getByRole("heading", { name: /events/i })).toBeVisible();
    await expect(page.locator("[data-testid='event-card']").first()).toBeVisible();
  });
});
