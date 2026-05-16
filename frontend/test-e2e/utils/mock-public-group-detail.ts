// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Stable UUIDs for cold `page.goto` + `page.route` group-detail mocks (SSR off).
 * The org ID is only used in the page URL; the API mock keys on the group ID.
 */
export const MOCK_GROUP_EMPTY_STATE_ORG_ID =
  "00000000-0000-4000-8000-00000000b001";
export const MOCK_GROUP_EMPTY_STATE_ID = "00000000-0000-4000-8000-00000000b002";

export function isPublicGroupDetailGet(url: string): boolean {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/communities\/groups\/([^/?#]+)$/);
    if (!m?.[1]) return false;
    return /^[0-9a-f-]{36}$/i.test(m[1]);
  } catch {
    return false;
  }
}

function groupIdFromDetailUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/communities\/groups\/([^/?#]+)$/);
    return m?.[1]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

/**
 * Fulfill GET `/api/public/communities/groups/:id` for a single group id; other requests continue.
 * Matches the client fetch used by `getGroup` (`withoutAuth: true` -> public API base).
 */
export async function routeMockPublicGroupDetail(
  page: Page,
  expectedGroupId: string,
  body: Record<string, unknown>
): Promise<void> {
  const want = expectedGroupId.toLowerCase();
  await page.route("**/api/public/communities/groups/**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (!isPublicGroupDetailGet(route.request().url())) {
      await route.continue();
      return;
    }
    const id = groupIdFromDetailUrl(route.request().url());
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

/** Minimal group JSON valid for `mapGroup` with empty faqEntries and resources by default. */
export function mockGroupDetailPayload(
  groupId: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    id: groupId,
    groupName: "E2E empty-state group",
    name: "E2E empty-state group",
    tagline: "E2E tagline",
    org: MOCK_GROUP_EMPTY_STATE_ORG_ID,
    createdBy: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    iconUrl: null,
    location: null,
    socialLinks: [],
    creationDate: "2024-01-01T00:00:00Z",
    events: [],
    images: [],
    resources: [],
    faqEntries: [],
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
