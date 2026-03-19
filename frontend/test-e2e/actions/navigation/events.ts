// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";
import { expect } from "playwright/test";

// MARK: First Event

/**
 * Navigate to the first event from the events home page.
 *
 * @param page - Playwright page object
 * @returns Object containing eventId and eventPage
 */
export async function navigateToFirstEvent(page: Page) {
  // Navigate to events home page.
  await page.goto("/events", { waitUntil: "load" });

  // Switch to list view (default is map view) if available.
  // On mobile, view switcher is not visible (known issue).
  const listViewButton = page.getByRole("radio", { name: /list view/i });

  // Wait for view switcher to be available.
  await listViewButton
    .waitFor({ state: "visible", timeout: 3000 })
    .catch(() => {});

  const isChecked = await listViewButton.isChecked().catch(() => false);

  if (!isChecked) {
    await listViewButton.click();
  }

  // Wait for at least one event card to load.
  await expect(page.getByTestId("event-card").first()).toBeVisible({
    timeout: 5000,
  });

  // Get the first event link.
  const firstEventLink = page
    .getByTestId("event-card")
    .first()
    .getByRole("link")
    .first();
  await expect(firstEventLink).toBeVisible({ timeout: 5000 });

  // Get the href to extract event ID.
  const eventUrl = await firstEventLink.getAttribute("href");

  if (!eventUrl) {
    throw new Error("Could not get event URL");
  }

  // Extract event ID from the URL.
  const eventId = eventUrl.match(/\/events\/([a-f0-9-]{36})/)?.[1];

  if (!eventId) {
    throw new Error("Could not extract event ID from URL");
  }

  // Click to navigate to the event.
  await firstEventLink.click();
  await page.waitForURL(`**/events/${eventId}/**`);

  // Verify we're on the event page.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const { newEventPage } =
    await import("~/test-e2e/page-objects/event/EventPage");
  const eventPage = newEventPage(page);

  return {
    eventId,
    eventPage,
  };
}

// MARK: Event Subpage

/**
 * Navigate to an event subpage
 * @param page - Playwright page object
 * @param subpage - The event subpage to navigate to (e.g., 'about', 'faq', 'resources')
 * @returns Object containing eventId and eventPage
 */
export async function navigateToEventSubpage(page: Page, subpage: string) {
  const { eventId, eventPage } = await navigateToFirstEvent(page);

  // Map subpage names to menu option names.
  const subpageMapping: Record<string, string> = {
    faq: "questions",
  };

  const menuSubpage = subpageMapping[subpage] || subpage;

  // Detect if mobile layout is active by checking viewport width.
  const viewportSize = page.viewportSize();
  const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;
  const submenu = page.locator("#submenu");

  if (isMobileLayout) {
    // Mobile layout: Check if submenu exists (fail fast if not).
    const submenuVisible = await submenu
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!submenuVisible) {
      throw new Error(
        `Submenu not available for event subpage navigation on mobile (${subpage} tab)`
      );
    }

    const listboxButton = submenu.getByRole("button");
    await listboxButton.waitFor({ state: "attached", timeout: 3000 });

    // Check if the dropdown is already open before clicking.
    const isAlreadyOpen =
      (await listboxButton.getAttribute("aria-expanded")) === "true";
    if (!isAlreadyOpen) {
      await listboxButton.click();
      await page.getByRole("listbox").waitFor({ timeout: 3000 });
    }

    // Wait for the page to be fully loaded and menu entries to be initialized.
    await page.waitForLoadState("domcontentloaded");

    // Wait for the event page heading and dropdown to be visible (ensures page is loaded).
    await expect(eventPage.pageHeading).toBeVisible();
    await page.getByRole("listbox").waitFor({ timeout: 3000 });

    // Use original subpage name for i18n lookup.
    const i18nKeyMap: Record<string, string> = {
      resources: "i18n._global.resources",
      faq: "i18n._global.faq",
      team: "i18n.composables.use_menu_entries_state.team",
      tasks: "i18n.composables.use_menu_entries_state.tasks",
      discussion: "i18n._global.discussion",
      settings: "i18n._global.settings",
      about: "i18n._global.about",
    };

    const i18nKey =
      i18nKeyMap[subpage] ||
      `i18n.composables.use_menu_entries_state.${subpage}`;

    const subpageOption = page.getByRole("option", {
      name: new RegExp(getEnglishText(i18nKey), "i"),
    });

    // Verify option exists before clicking (fail fast if not available).
    await expect(subpageOption).toBeVisible({ timeout: 5000 });
    await subpageOption.click();
  } else {
    // Desktop layout: uses direct tab navigation.
    await page.waitForLoadState("domcontentloaded");
    await expect(eventPage.pageHeading).toBeVisible();

    const subpageOption =
      eventPage.menu[`${menuSubpage}Option` as keyof typeof eventPage.menu];

    await expect(subpageOption).toBeVisible();
    await subpageOption.waitFor({ state: "attached" });

    // Wait intelligently for menu entries to be created with correct route parameters.
    await expect(async () => {
      const href = await subpageOption.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toContain(`/${subpage}`);
    }).toPass({ timeout: 2000, intervals: [50, 100, 250] });

    await subpageOption.click();
  }

  await expect(page).toHaveURL(new RegExp(`.*\\/events\\/.*\\/${subpage}`));

  return { eventId, eventPage };
}

// MARK: Last event (activist_0's when E2E ordering is on)

const MAX_SCROLL_ITERATIONS = 10;
const SCROLL_POLL_MS = 100;
const SCROLL_WAIT_FOR_MORE_MS = 600;

/**
 * Navigate to the last event in the list (infinite scroll), then open the given subpage.
 * Use after signing in as activist_0 so edit permission checks pass (last event is activist_0's when E2E ordering is on).
 *
 * @param page - Playwright page
 * @param subpage - Event subpage to open: "about" | "resources" | "faq"
 * @returns Object with eventId (from last card link) and eventPage
 */
export async function navigateToLastEventSubpage(
  page: Page,
  subpage: "about" | "resources" | "faq"
) {
  // 1. Events list in list view (same as navigateToFirstEvent).
  await page.goto("/events", { waitUntil: "load" });
  const listViewButton = page.getByRole("radio", { name: /list view/i });
  await listViewButton
    .waitFor({ state: "visible", timeout: 3000 })
    .catch(() => {});
  const isChecked = await listViewButton.isChecked().catch(() => false);
  if (!isChecked) {
    await listViewButton.click();
  }
  await expect(page.getByTestId("event-card").first()).toBeVisible({
    timeout: 5000,
  });

  // 2. Infinite scroll until no new cards load (or max iterations). Poll for count increase instead of fixed wait.
  const eventCards = page.getByTestId("event-card");
  let prevCount = await eventCards.count();
  for (let i = 0; i < MAX_SCROLL_ITERATIONS; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const deadline = Date.now() + SCROLL_WAIT_FOR_MORE_MS;
    let count = await eventCards.count();
    while (Date.now() < deadline && count <= prevCount) {
      await page.waitForTimeout(SCROLL_POLL_MS);
      count = await eventCards.count();
    }
    if (count <= prevCount) break;
    prevCount = count;
  }

  // 3. Last card: get link href and extract event id.
  const lastCard = eventCards.last();
  await expect(lastCard).toBeVisible();
  const lastCardLink = lastCard.getByRole("link").first();
  await expect(lastCardLink).toBeVisible();
  const eventUrl = await lastCardLink.getAttribute("href");
  if (!eventUrl) throw new Error("Last event card has no link href");
  const eventIdMatch = eventUrl.match(/\/events\/([a-f0-9-]{36})/);
  if (!eventIdMatch?.[1])
    throw new Error("Could not extract event id from last card link");
  const eventId = eventIdMatch[1];

  // 4. Navigate to event by clicking the last card (user flow).
  await lastCardLink.click();
  await page.waitForURL(/\/events\/[a-f0-9-]{36}(\/|$)/);

  const { newEventPage } =
    await import("~/test-e2e/page-objects/event/EventPage");
  const eventPage = newEventPage(page);
  await expect(eventPage.pageHeading).toBeVisible();

  // 5. If subpage is not "about", open it via the event page menu (desktop).
  if (subpage !== "about") {
    const subpageMapping: Record<string, string> = {
      faq: "questions",
    };
    const menuSubpage = subpageMapping[subpage] ?? subpage;
    const subpageOption =
      eventPage.menu[`${menuSubpage}Option` as keyof typeof eventPage.menu];
    await expect(subpageOption).toBeVisible();
    await subpageOption.click();
  }

  // 6. Assert we landed on the event we clicked (URL id matches extracted id) and the requested subpage.
  await expect(page).toHaveURL(
    new RegExp(`.*\\/events\\/${eventId}\\/${subpage}`)
  );

  return { eventId, eventPage };
}
