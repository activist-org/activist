import type { Page } from "@playwright/test";

export const MOCK_ORG_ID = "00000000-0000-0000-0000-000000000001";

export function mockOrganizationDetailPayload(orgId: string, overrides: Record<string, unknown> = {}) {
  return {
    id: orgId,
    status: "published",
    texts: {
      en: {
        name: "Empty State Mock Organization",
        description: "Testing empty states",
        language: "en",
      },
    },
    location: { type: "Point", coordinates: [0, 0] },
    socialLinks: [],
    faqEntries: [],
    resources: [],
    ...overrides,
  };
}

export async function routeMockPublicOrganizationDetail(page: Page, orgId: string, body: Record<string, unknown>) {
  await page.route(`**/api/v1/organizations/${orgId}/`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}