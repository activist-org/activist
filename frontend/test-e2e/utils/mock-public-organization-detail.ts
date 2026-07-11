// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Page, Route } from "@playwright/test";

export const MOCK_ORGANIZATION_EMPTY_STATE_ID =
  "00000000-0000-4000-8000-000000000001";

export function isPublicOrganizationDetailGet(url: string): boolean {
  return (
    url.includes("/api/public/communities/organizations/") && !url.includes("?")
  );
}

export function organizationIdFromDetailUrl(url: string): string | null {
  const match = url.match(/\/organizations\/([^/?]+)/);
  return match?.[1] ?? null;
}

export function sampleFaqEntryForMock() {
  return {
    id: 1,
    question: "Test FAQ Question",
    answer: "Test FAQ Answer",
    order: 0,
  };
}

export function sampleResourceForMock() {
  return {
    id: 1,
    title: "Test Resource",
    url: "https://activist.org",
    type: "link",
  };
}

export function mockOrganizationDetailPayload(
  orgId: string,
  overrides: Record<string, unknown> = {}
) {
  return {
    id: orgId,
    status: 2,
    orgName: "Empty State Mock Organization",
    name: "Empty State Mock Organization",
    tagline: "Testing empty states",
    iconUrl: null,
    creationDate: new Date().toISOString(),
    texts: [],
    images: [],
    groups: [],
    events: [],
    location: { type: "Point", coordinates: [0, 0] },
    socialLinks: [],
    faqEntries: [],
    resources: [],
    ...overrides,
  };
}

export async function routeMockPublicOrganizationDetail(
  page: Page,
  wantOrgId: string,
  body: Record<string, unknown>
) {
  await page.route(
    "**/api/public/communities/organizations/**",
    async (route: Route) => {
      if (route.request().method() !== "GET") return route.continue();
      if (!isPublicOrganizationDetailGet(route.request().url()))
        return route.continue();

      const id = organizationIdFromDetailUrl(route.request().url());
      if (!id || id !== wantOrgId) return route.continue();

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    }
  );
}
