// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";

import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateEventModal } from "~/test-e2e/component-objects/CreateEventModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";

// Nominatim fixture
// place_id is a number in the real Nominatim API response.
// The app maps it to value.id; the locationSchema requires id: z.number().
const nominatimFixture = [
  {
    place_id: 123456,
    licence: "",
    osm_type: "node",
    osm_id: "999",
    boundingbox: ["52.4", "52.6", "13.3", "13.5"],
    lat: "52.5200",
    lon: "13.4050",
    display_name: "Berlin, Germany",
    class: "place",
    type: "city",
    importance: 0.9,
  },
];

/** Navigate steps 1-2 (in-person) to land on the location step (step 3). */
async function navigateToLocationStep(
  modal: ReturnType<typeof newCreateEventModal>,
  _page: Page
) {
  await modal.nameField.fill("E2E Location Step Event");
  await modal.descriptionField.fill("Location step validation test.");
  await modal.selectFirstOrganization();
  await modal.advanceToEventTypeStep();

  await expect(modal.eventTypeForm).toBeVisible();
  await modal.locationTypeSection
    .getByRole("radio", {
      name: new RegExp(
        getEnglishText("i18n.components._global.location_type_physical"),
        "i"
      ),
    })
    .click();
  await modal.eventTypeSection.getByRole("radio", { name: /learn/i }).click();
  await modal.selectFirstTopic();
  await modal.advanceToLocationStep();

  await expect(modal.locationForm).toBeVisible();
}

/** Intercept Nominatim and return the fixture. Call page.unrouteAll() after each test. */
async function mockNominatim(page: Page, fixture = nominatimFixture) {
  await page.route(/nominatim\.openstreetmap\.org/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fixture),
    });
  });
}

/** Fill the search form fields and submit, then wait for the Nominatim
 *  request/response to complete before making further assertions. */
async function fillAndSearch(
  modal: ReturnType<typeof newCreateEventModal>,
  page: Page,
  { city, street }: { city: string; street: string }
) {
  const countryButton = modal.locationSearchForm.getByRole("button", {
    name: new RegExp(getEnglishText("i18n.components._global.country"), "i"),
  });
  await countryButton.click();
  const firstCountry = page.getByRole("option").first();
  await expect(firstCountry).toBeVisible({ timeout: 10000 });
  await firstCountry.click();
  await expect(page.getByRole("option").first()).toBeHidden({ timeout: 5000 });

  await modal.citySearchField.fill(city);
  await modal.streetSearchField.fill(street);

  const responsePromise = page.waitForResponse(/nominatim\.openstreetmap\.org/);
  await modal.locationSearchButton.click();
  await responsePromise;
}

test.describe(
  "Event Create Modal - Location Step",
  { tag: ["@desktop", "@mobile"] },
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
        await createDropdown.clickNewEvent();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewEvent();
      }

      const modal = newCreateEventModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.eventDetailsForm).toBeVisible();
    });

    // MARK: Location search form - empty submission

    test("submitting empty search form shows required errors for all fields", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);

      await modal.locationSearchButton.click();

      await expect(modal.locationForm).toBeVisible();

      // FormSearchLocation.vue uses hardcoded English strings, not i18n keys.
      await expect(modal.countrySearchError).toBeVisible();
      await expect(modal.citySearchError).toBeVisible();
      await expect(modal.streetSearchError).toBeVisible();

      await expect(modal.countrySearchError).toContainText("required", {
        ignoreCase: true,
      });
      await expect(modal.citySearchError).toContainText("required", {
        ignoreCase: true,
      });
      await expect(modal.streetSearchError).toContainText("required", {
        ignoreCase: true,
      });
    });

    // MARK: Location search form - partial submission

    test("filling only country leaves errors on city and street", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);

      const countryButton = modal.locationSearchForm.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.components._global.country"),
          "i"
        ),
      });
      await countryButton.click();
      const firstCountry = page.getByRole("option").first();
      await expect(firstCountry).toBeVisible({ timeout: 10000 });
      await firstCountry.click();
      await expect(page.getByRole("option").first()).toBeHidden({
        timeout: 5000,
      });

      await modal.locationSearchButton.click();

      await expect(modal.countrySearchError).not.toBeVisible();
      await expect(modal.citySearchError).toBeVisible();
      await expect(modal.streetSearchError).toBeVisible();
    });

    // MARK: Location results - mocked results appear

    test("valid search returns results as selectable radio options", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);
      await mockNominatim(page);

      await fillAndSearch(modal, page, {
        city: "Berlin",
        street: "Unter den Linden 1",
      });

      // FormRadioBtn renders a hidden <input type="radio"> and a <label> with
      // the result text. The labels are technically zero-height due to the
      // component's h-9/py-7 CSS conflict, so use toContainText on the
      // parent container rather than toBeVisible on the individual label.
      await expect(modal.locationResultsGroup).toContainText("Berlin", {
        timeout: 10000,
      });

      await page.unrouteAll();
    });

    // MARK: Location results - submit without selecting shows Required

    test("submitting without selecting a result shows Required error", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);
      await mockNominatim(page);

      await fillAndSearch(modal, page, {
        city: "Berlin",
        street: "Unter den Linden 1",
      });

      await expect(modal.locationResultsGroup).toContainText("Berlin", {
        timeout: 10000,
      });

      // Use locationNextButton to avoid strict mode violation: the location
      // step renders two Form submit buttons (search + picker).
      await modal.locationNextButton.click();

      // Still on location step - Zod rejects undefined with "Required".
      // z.object({...}).nullable() allows null but not undefined; an unselected
      // vee-validate radio group remains undefined, not null.
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.locationError).toBeVisible();
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.locationError).toContainText(requiredText);

      await page.unrouteAll();
    });

    // MARK: Location results - selecting a result advances to time step

    test("selecting a result allows advancing to the time step", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);
      await mockNominatim(page);

      await fillAndSearch(modal, page, {
        city: "Berlin",
        street: "Unter den Linden 1",
      });

      await expect(modal.locationResultsGroup).toContainText("Berlin", {
        timeout: 10000,
      });
      // The radio <input> has class="hidden" and the label may be outside
      // the modal's overflow:hidden area. Dispatching "change" directly on
      // the input fires the Vue @change handler without viewport constraints.
      await modal.locationResultsGroup
        .locator("input[type=radio]")
        .first()
        .dispatchEvent("change");

      // Use locationNextButton to avoid strict mode violation (two submit
      // buttons on this step: search form + location picker form).
      await modal.locationNextButton.click();

      await expect(modal.timeForm).toBeVisible();

      await page.unrouteAll();
    });

    // MARK: Location results - no results shows inline message

    test("search returning no results shows the empty state message", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToLocationStep(modal, page);
      await mockNominatim(page, []);

      await fillAndSearch(modal, page, {
        city: "Nonexistent City",
        street: "Fake Street 1",
      });

      await expect(modal.locationForm).toContainText(
        /verify.*inputs.*correct|try different search/i,
        { timeout: 10000 }
      );

      await page.unrouteAll();
    });
  }
);
