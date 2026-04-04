// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/** Stable UUID for cold `page.goto` + `page.route` event-detail mocks (SSR off). */
export const MOCK_EVENT_EMPTY_STATE_ID = "00000000-0000-4000-8000-00000000e207";

export function isPublicEventDetailGet(url: string): boolean {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/events\/events\/([^/?#]+)$/);
    if (!m?.[1]) return false;
    return /^[0-9a-f-]{36}$/i.test(m[1]);
  } catch {
    return false;
  }
}

function eventIdFromDetailUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/events\/events\/([^/?#]+)$/);
    return m?.[1]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

/**
 * Fulfill GET `/api/public/events/events/:id` for a single event id; other requests continue.
 * Matches the client fetch used by `getEvent` (`withoutAuth` → public API base).
 */
export async function routeMockPublicEventDetail(
  page: Page,
  expectedEventId: string,
  body: Record<string, unknown>
): Promise<void> {
  const want = expectedEventId.toLowerCase();
  await page.route("**/api/public/events/events/**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (!isPublicEventDetailGet(route.request().url())) {
      await route.continue();
      return;
    }
    const id = eventIdFromDetailUrl(route.request().url());
    if (!id || id !== want) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

/** Minimal event JSON for `mapEvent` / FAQ + resources subpages. */
export function mockEventDetailPayload(
  eventId: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    id: eventId,
    name: "E2E empty-state event",
    tagline: "E2E tagline",
    type: "action",
    createdBy: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    socialLinks: [],
    resources: [],
    faqEntries: [],
    times: [],
    orgs: [],
    texts: [],
    ...overrides,
  };
}

export const sampleFaqEntryForMock = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  iso: "en",
  order: 0,
  question: "E2E question?",
  answer: "E2E answer.",
};

export const sampleResourceForMock = {
  id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  name: "E2E resource",
  description: "E2E resource description",
  url: "https://example.com/e2e-resource",
  order: 0,
  createdBy: {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    userName: "e2e",
    name: "E2E User",
    socialLinks: [],
  },
};
