// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Response } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";
import { runAccessibilityTestScoped } from "~/test-e2e/accessibility/accessibilityTesting";
import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateGroupModal } from "~/test-e2e/component-objects/CreateGroupModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Renders localized "step X of Y" copy from `Machine.vue`. */
function machineStepLabel(currentStep: number, totalSteps: number): string {
  return getEnglishText("i18n.components.machine._global.machine")
    .replace("{current_step}", String(currentStep))
    .replace("{total_steps}", String(totalSteps));
}

/** POST create-group (`services/communities/group/group.ts`: `POST /communities/groups`). */
function isPostCreateGroupResponse(res: Response): boolean {
  if (res.request().method() !== "POST") return false;
  const path = new URL(res.url()).pathname.replace(/\/$/, "");
  return path.endsWith("/communities/groups");
}

const errorToast = (page: Page) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

/** Axe scope: open create-group dialog (`ModalCreateGroup` root). */
const MODAL_A11Y_ROOT = '[data-testid="modal-ModalCreateGroup"]';

const selectFirstOrganization = (
  modal: ReturnType<typeof newCreateGroupModal>
) => modal.selectFirstOrganization();

test.describe(
  "Group Create Modal",
  { tag: ["@desktop", "@mobile", "@all"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/home");
      await page.waitForURL("**/home**");

      const viewportSize = page.viewportSize();
      const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;

      if (isMobileLayout) {
        const sidebarRight = newSidebarRight(page);
        await sidebarRight.openButton.click();
        await expect(sidebarRight.closeButton).toBeVisible();
        const createDropdown = newCreateDropdown(page, {
          root: page.locator("#drawer-navigation"),
        });
        await createDropdown.clickNewGroup();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewGroup();
      }
    });

    // MARK: Modal opens

    test("modal opens with correct heading", async ({ page }) => {
      const modal = newCreateGroupModal(page);
      await expect(modal.root).toBeVisible();
      await expect(
        modal.root.getByRole("heading", {
          level: 2,
          name: new RegExp(
            getEnglishText(
              "i18n.components.modal_create_group.create_new_group"
            ),
            "i"
          ),
        })
      ).toBeVisible();
    });

    // MARK: Accessibility

    test.describe("Group Create Modal accessibility by step", () => {
      test.setTimeout(120000);

      test(
        "step 1 group details has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateGroupModal(page);
          await expect(modal.detailsForm).toBeVisible();

          await test.step("axe modal - step 1 details", async () => {
            const violations = await runAccessibilityTestScoped(
              "Group Create Modal step 1 group details",
              page,
              testInfo,
              MODAL_A11Y_ROOT
            );
            expect
              .soft(violations, "Accessibility violations (step 1):")
              .toHaveLength(0);
          });
        }
      );

      test(
        "step 2 location has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateGroupModal(page);
          await modal.nameField.fill("A11y Group");
          await modal.descriptionField.fill("Accessibility scan step 2.");
          await selectFirstOrganization(modal);
          await modal.getNextStepButton().click({ force: true });
          await expect(modal.locationForm).toBeVisible();

          await test.step("axe modal - step 2 location", async () => {
            const violations = await runAccessibilityTestScoped(
              "Group Create Modal step 2 location",
              page,
              testInfo,
              MODAL_A11Y_ROOT
            );
            expect
              .soft(violations, "Accessibility violations (step 2):")
              .toHaveLength(0);
          });
        }
      );
    });

    // MARK: Validation

    test("step 1 shows validation when required fields are empty", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.detailsForm).toBeVisible();

      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.root).toBeVisible();
    });

    // MARK: Details and Location

    test("step 1 to 2: filled details advance to location step", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);
      await expect(modal.detailsForm).toBeVisible();

      await modal.nameField.fill("E2E Group");
      await modal.descriptionField.fill("Description for group E2E.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
    });

    // MARK: Step indicator + previous

    test("step indicator shows current step; back returns without losing detail data", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);
      await expect(modal.root).toContainText(machineStepLabel(1, 2));

      const groupName = "Step indicator group";
      const description = "Data must survive Prev.";
      await modal.nameField.fill(groupName);
      await modal.descriptionField.fill(description);
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.root).toContainText(machineStepLabel(2, 2));

      await modal.getPreviousStepButton().click();
      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.root).toContainText(machineStepLabel(1, 2));

      await expect(modal.nameField).toHaveValue(groupName);
      await expect(modal.descriptionField).toHaveValue(description);
    });

    // MARK: Modal close

    test("modal close button hides modal", async ({ page }) => {
      const modal = newCreateGroupModal(page);
      await expect(modal.root).toBeVisible();

      await modal.closeButton.click();

      await expect(modal.root).not.toBeVisible();
    });

    // MARK: Full flow

    test("full flow closes modal and navigates to new group about page", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);
      const timestamp = Date.now();
      const groupName = `E2E New Group ${timestamp}`;

      await modal.nameField.fill(groupName);
      await modal.taglineField.fill("Created by Playwright.");
      await modal.descriptionField.fill("Full flow group create test.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });
      await expect(modal.locationForm).toBeVisible();
      // Country is pre-filled from the selected org's location data via a deferred
      // resetForm (setTimeout 0) in Form.vue. Waiting for the country field to show
      // a value ensures that resetForm has already fired – filling city before this
      // would be cleared by the pending resetForm call.
      await expect(modal.countryField).not.toHaveValue("", { timeout: 15000 });

      await modal.cityField.fill("Berlin");

      await modal.submitLocationButton.click();

      // waitForURL is used instead of waitForResponse because on mobile the
      // page navigates away fast enough that the response context is destroyed
      // before waitForResponse can resolve, causing "Target page context closed".
      await expect(page).toHaveURL(
        /\/organizations\/[^/]+\/groups\/[^/]+\/about/,
        { timeout: 30000 }
      );
    });

    // MARK: Create API errors

    test.describe("Create group API error handling", () => {
      test.afterEach(async ({ page }) => {
        await page.unrouteAll();
      });

      test("shows error toast when create group returns 500", async ({
        page,
      }, testInfo) => {
        logTestPath(testInfo);

        await page.route("**/api/auth/communities/groups", async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ detail: "E2E: group create failed." }),
          });
        });

        const modal = newCreateGroupModal(page);

        await modal.nameField.fill("E2E Group Error Path");
        await modal.descriptionField.fill(
          "Should not persist after failed create."
        );
        await selectFirstOrganization(modal);

        await modal.getNextStepButton().click({ force: true });
        await expect(modal.locationForm).toBeVisible();
        // Same deferred resetForm race as the full flow test: wait for country
        // to be pre-filled before filling city.
        await expect(modal.countryField).not.toHaveValue("", {
          timeout: 15000,
        });

        await modal.cityField.fill("Berlin");

        const createResponse = page.waitForResponse(isPostCreateGroupResponse, {
          timeout: 30000,
        });
        await modal.submitLocationButton.click();

        const createRes = await createResponse;
        expect(
          createRes.status(),
          `POST group expected 500 error path, got ${createRes.status()}`
        ).toBe(500);

        await expect(errorToast(page)).toBeVisible({ timeout: 15000 });
        await expect(errorToast(page)).toContainText(
          /E2E: group create failed/i
        );

        await expect(modal.root).toBeVisible({ timeout: 15000 });
        await expect(page).not.toHaveURL(
          /\/organizations\/[^/]+\/groups\/[^/]+\/about/
        );
      });
    });
  }
);

test.describe(
  "Group create modal — unauthenticated user",
  { tag: ["@desktop", "@unauth"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/home");
      await page.waitForURL("**/home**");
    });

    test("Create control is not shown in left sidebar footer", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await expect(page.locator("#sidebar-left")).toBeVisible({
        timeout: 15000,
      });
      const sidebarLeft = newSidebarLeft(page);
      await sidebarLeft.open();
      await expect(page.locator("#sidebar-left #create")).toHaveCount(0);
    });
  }
);

test.describe(
  "Group create modal — unauthenticated user (mobile drawer)",
  { tag: ["@mobile", "@all", "@unauth"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/home");
      await page.waitForURL("**/home**");
    });

    test("Create control is not shown in header drawer menu", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const sidebarRight = newSidebarRight(page);
      await sidebarRight.openButton.click();
      await expect(sidebarRight.closeButton).toBeVisible();
      await expect(page.locator("#drawer-navigation #create")).toHaveCount(0);
    });
  }
);
