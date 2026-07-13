// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

const nameRequired = getEnglishText(
  "i18n.components.form_resource.name_required"
);
const descriptionRequired = getEnglishText(
  "i18n.components.form_resource.description_required"
);
const linkRequired = getEnglishText(
  "i18n.components.form_resource.link_required"
);
const urlMustBeValid = getEnglishText(
  "i18n.components.form_resource.url_must_be_valid"
);

test.beforeEach(async ({ page }) => {
  // Already authenticated as admin via global storageState.
  await navigateToOrganizationSubpage(page, "resources");
});

test.describe(
  "Organization Resources Modal - Form Validation",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: Empty submission

    test("submitting an empty resource form shows inline errors and keeps the modal open", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await resourcesPage.newResourceButton.click();
      const modal = resourcesPage.resourceModal;
      await expect(modal).toBeVisible();

      await resourcesPage.resourceSubmitButton(modal).click();

      await expect(modal).toBeVisible();

      const nameError = modal.getByTestId("form-item-name-error");
      const descriptionError = modal.getByTestId("form-item-description-error");
      const urlError = modal.getByTestId("form-item-url-error");
      await expect(nameError).toBeVisible();
      await expect(descriptionError).toBeVisible();
      await expect(urlError).toBeVisible();
      await expect(nameError).toContainText(nameRequired);
      await expect(descriptionError).toContainText(descriptionRequired);
      await expect(urlError).toContainText(linkRequired);
    });

    // MARK: Partial submission

    test("filling only the name leaves errors on description and url", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await resourcesPage.newResourceButton.click();
      const modal = resourcesPage.resourceModal;
      await expect(modal).toBeVisible();

      await resourcesPage.resourceNameInput(modal).fill("E2E partial resource");
      await resourcesPage.resourceSubmitButton(modal).click();

      await expect(modal).toBeVisible();
      await expect(modal.getByTestId("form-item-name-error")).not.toBeVisible();
      await expect(
        modal.getByTestId("form-item-description-error")
      ).toBeVisible();
      await expect(modal.getByTestId("form-item-url-error")).toBeVisible();
    });

    // MARK: Invalid URL

    test("entering an invalid URL shows the URL format error", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await resourcesPage.newResourceButton.click();
      const modal = resourcesPage.resourceModal;
      await expect(modal).toBeVisible();

      await resourcesPage.resourceNameInput(modal).fill("E2E invalid url");
      await resourcesPage
        .resourceDescriptionInput(modal)
        .fill("Invalid URL validation test.");
      await resourcesPage.resourceUrlInput(modal).fill("not-a-url");
      await resourcesPage.resourceSubmitButton(modal).click();

      await expect(modal).toBeVisible();
      const urlError = modal.getByTestId("form-item-url-error");
      await expect(urlError).toBeVisible();
      await expect(urlError).toContainText(urlMustBeValid);
    });

    // MARK: Correction

    test("correcting all errors submits the form and closes the modal", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await resourcesPage.newResourceButton.click();
      const modal = resourcesPage.resourceModal;
      await expect(modal).toBeVisible();

      // Trigger validation errors first.
      await resourcesPage.resourceSubmitButton(modal).click();
      await expect(modal.getByTestId("form-item-name-error")).toBeVisible();

      // Correct the form with valid data.
      const timestamp = Date.now();
      const name = `E2E Validation Resource ${timestamp}`;

      await resourcesPage.resourceNameInput(modal).fill(name);
      await resourcesPage
        .resourceDescriptionInput(modal)
        .fill(`Corrected resource description ${timestamp}.`);
      await resourcesPage
        .resourceUrlInput(modal)
        .fill("https://example.com/e2e-resource");
      // Wait on the create request and assert it succeeded.
      const createResponse = page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          /\/communities\/organization_resources\b/.test(
            new URL(res.url()).pathname
          )
      );
      await resourcesPage.resourceSubmitButton(modal).click();
      const createRes = await createResponse;
      expect(
        [200, 201, 204].includes(createRes.status()),
        `Resource create failed: HTTP ${createRes.status()}`
      ).toBe(true);

      // Modal closes and the new resource appears in the list.
      await expect(modal).not.toBeVisible();
      await expect(
        resourcesPage.resourceCards.filter({ hasText: name })
      ).toBeVisible();
    });
  }
);
