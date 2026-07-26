// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/** Stable UUID for cold `page.goto` + `page.route` organization-detail mocks (SSR off). */
export const MOCK_ORGANIZATION_EMPTY_STATE_ID = "00000000-0000-4000-8000-00000000o214";

export function isPublicOrganizationDetailGet(url: string): boolean {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/communities\/organizations\/([^/?#]+)$/);
    if (!m?.[1]) return false;
    return /^[0-9a-f-]{36}$/i.test(m[1]);
  } catch {
    return false;
  }
}

function organizationIdFromDetailUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/communities\/organizations\/([^/?#]+)$/);
    return m?.[1]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

/**
 * Fulfill GET `/api/public/communities/organizations/:id` for a single org id; other requests continue.
 * Matches the client fetch used by `getOrganization` (`withoutAuth` → public API base).
 */
export async function routeMockPublicOrganizationDetail(
  page: Page,
  expectedOrgId: string,
  body: Record<string, unknown>
): Promise<void> {
  const want = expectedOrgId.toLowerCase();
  await page.route("**/api/public/communities/organizations/**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (!isPublicOrganizationDetailGet(route.request().url())) {
      await route.continue();
      return;
    }
    const id = organizationIdFromDetailUrl(route.request().url());
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

/** Minimal organization JSON for `mapOrganization` / FAQ + resources subpages. */
export function mockOrganizationDetailPayload(
  orgId: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    id: orgId,
    name: "E2E empty-state organization",
    tagline: "E2E tagline",
    status: "active",
    createdBy: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    socialLinks: [],
    resources: [],
    faqEntries: [],
    texts: [],
    groups: [],
    location: null,
    ...overrides,
  };
}

export const sampleOrganizationFaqEntryForMock = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  iso: "en",
  order: 0,
  question: "E2E question?",
  answer: "E2E answer.",
};

export const sampleOrganizationResourceForMock = {
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
