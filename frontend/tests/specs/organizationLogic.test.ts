// Mock fetchById function and organization data directly.
const mockFetchById = vi.fn();
const mockOrganization = { id: "test-uuid", name: "Test Organization" };

// Mock PageBreadcrumbs logic.
vi.mock("@/components/page/PageBreadcrumbs.vue", () => ({
  fetchById: mockFetchById,
  organization: mockOrganization,
}));
