// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Response } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

import { runAccessibilityTestScoped } from "~/test-e2e/accessibility/accessibilityTesting";
import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateOrganizationModal } from "~/test-e2e/component-objects/CreateOrganizationModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";
import {
  E2E_GEO_REFERENCE_COUNTRY,
  selectCountryComboboxOption,
} from "~/test-e2e/utils/modal-helpers";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Renders localized "step X of Y" copy from `Machine.vue`. */
function machineStepLabel(currentStep: number, totalSteps: number): string {
  return getEnglishText("i18n.components.machine._global.machine")
    .replace("{current_step}", String(currentStep))
    .replace("{total_steps}", String(totalSteps));
}

/** POST create-organization (`organization.ts`: `POST /communities/organizations`). */
function isPostCreateOrganizationResponse(res: Response): boolean {
  if (res.request().method() !== "POST") return false;
  const url = res.url();
  return (
    url.includes("/communities/organizations") &&
    !url.includes("organizations_by_user")
  );
}

const errorToast = (page: Page) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

async function selectCountryInOrganizationModal(
  modal: ReturnType<typeof newCreateOrganizationModal>,
  optionNameMatch: RegExp | string
) {
  const countryLabel = getEnglishText("i18n.components._global.country");
  const countryTrigger = modal.countryField.getByRole("button", {
    name: new RegExp(countryLabel, "i"),
  });
  await selectCountryComboboxOption(
    modal.root,
    countryTrigger,
    optionNameMatch
  );
}

/** Axe scope: open create-organization dialog (`ModalCreateOrganization` root). */
const MODAL_A11Y_ROOT = '[data-testid="modal-ModalCreateOrganization"]';

test.describe(
  "Organization Create Modal",
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
        await createDropdown.clickNewOrganization();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewOrganization();
      }
    });

    test("modal opens with correct heading", async ({ page }) => {
      const modal = newCreateOrganizationModal(page);
      await expect(modal.root).toBeVisible();
      await expect(
        modal.root.getByRole("heading", {
          level: 2,
          name: new RegExp(
            getEnglishText(
              "i18n.components.modal_create_organization.create_new_organization"
            ),
            "i"
          ),
        })
      ).toBeVisible();
    });

    // MARK: Accessibility by wizard step (modal subtree only)

    test.describe("Organization Create Modal accessibility by step", () => {
      test.setTimeout(120000);

      test(
        "step 1 organization details has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateOrganizationModal(page);
          await expect(modal.detailsForm).toBeVisible();

          await test.step("axe modal - step 1 details", async () => {
            const violations = await runAccessibilityTestScoped(
              "Organization Create Modal step 1 details",
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
          const modal = newCreateOrganizationModal(page);
          await modal.nameField.fill("A11y Organization");
          await modal.descriptionField.fill("Accessibility scan step 2.");
          await modal.getNextStepButton().click({ force: true });
          await expect(modal.locationForm).toBeVisible();

          await test.step("axe modal - step 2 location", async () => {
            const violations = await runAccessibilityTestScoped(
              "Organization Create Modal step 2 location",
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

    // MARK: Step 1 validation

    test("step 1 shows validation when required fields are empty", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.detailsForm).toBeVisible();

      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.root).toBeVisible();
    });

    // MARK: Step 1 → 2

    test("step 1 to 2: filled details advance to location step", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);
      await expect(modal.detailsForm).toBeVisible();

      await modal.nameField.fill("E2E Org");
      await modal.taglineField.fill("E2E tagline.");
      await modal.descriptionField.fill("Description for organization E2E.");

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
    });

    // MARK: Step indicator + previous

    test("step indicator shows current step; back returns without losing detail data", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);
      await expect(modal.root).toContainText(machineStepLabel(1, 2));

      const orgName = "Step indicator org";
      const description = "Data must survive Prev.";
      await modal.nameField.fill(orgName);
      await modal.descriptionField.fill(description);

      await modal.getNextStepButton().click({ force: true });
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.root).toContainText(machineStepLabel(2, 2));

      await modal.getPreviousStepButton().click();
      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.root).toContainText(machineStepLabel(1, 2));

      await expect(modal.nameField).toHaveValue(orgName);
      await expect(modal.descriptionField).toHaveValue(description);
    });

    // MARK: Modal close

    test("modal close button hides modal", async ({ page }) => {
      const modal = newCreateOrganizationModal(page);
      await expect(modal.root).toBeVisible();

      await modal.closeButton.click();

      await expect(modal.root).not.toBeVisible();
    });

    // MARK: Full flow

    test("full flow closes modal and navigates to new organization about page", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);
      const timestamp = Date.now();
      const orgName = `E2E New Org ${timestamp}`;

      await modal.nameField.fill(orgName);
      await modal.taglineField.fill("Created by Playwright.");
      await modal.descriptionField.fill("Full flow organization create test.");

      await modal.getNextStepButton().click({ force: true });
      await expect(modal.locationForm).toBeVisible();

      await selectCountryInOrganizationModal(modal, E2E_GEO_REFERENCE_COUNTRY);
      await modal.cityField.fill("Berlin");

      const createResponse = page.waitForResponse(
        isPostCreateOrganizationResponse,
        { timeout: 30000 }
      );

      await modal.submitLocationButton.click();

      const createRes = await createResponse;
      expect(
        [200, 201].includes(createRes.status()),
        `POST organization expected 200 or 201, got ${createRes.status()}`
      ).toBe(true);

      await expect(modal.root).not.toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(/\/organizations\/[^/]+\/about/, {
        timeout: 15000,
      });
    });

    // MARK: Create API errors

    test.describe("Create organization API error handling", () => {
      test.afterEach(async ({ page }) => {
        await page.unrouteAll();
      });

      test("shows error toast when create organization returns 500", async ({
        page,
      }, testInfo) => {
        logTestPath(testInfo);

        await page.route(
          "**/api/auth/communities/organizations",
          async (route) => {
            if (route.request().method() !== "POST") {
              await route.continue();
              return;
            }
            await route.fulfill({
              status: 500,
              contentType: "application/json",
              body: JSON.stringify({
                detail: "E2E: organization create failed.",
              }),
            });
          }
        );

        const modal = newCreateOrganizationModal(page);

        await modal.nameField.fill("E2E Org Error Path");
        await modal.descriptionField.fill(
          "Should not persist after failed create."
        );
        await modal.getNextStepButton().click({ force: true });
        await expect(modal.locationForm).toBeVisible();

        await selectCountryInOrganizationModal(
          modal,
          E2E_GEO_REFERENCE_COUNTRY
        );
        await modal.cityField.fill("Berlin");

        const createResponse = page.waitForResponse(
          isPostCreateOrganizationResponse,
          { timeout: 30000 }
        );
        await modal.submitLocationButton.click();

        const createRes = await createResponse;
        expect(
          createRes.status(),
          `POST organization expected 500 error path, got ${createRes.status()}`
        ).toBe(500);

        await expect(errorToast(page)).toBeVisible({ timeout: 15000 });
        await expect(errorToast(page)).toContainText(
          /E2E: organization create failed/i
        );

        await expect(modal.root).toBeVisible({ timeout: 15000 });
        await expect(page).not.toHaveURL(/\/organizations\/[^/]+\/about/);
      });
    });
  }
);

test.describe(
  "Organization create modal — unauthenticated user",
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
  "Organization create modal — unauthenticated user (mobile drawer)",
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
