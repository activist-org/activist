// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import {
  getOrganization,
  listOrganizations,
  createOrganization,
  deleteOrganization,
  mapOrganization,
} from "../../../../app/services/communities/organization/organization";
import { defaultOrganizationText } from "../../../../app/types/communities/organization";
import { AppError } from "../../../../app/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: - Get

  it("getOrganization() requests by ID with withoutAuth and maps response", async () => {
    const { fetchMock } = getMocks();
    const response = {
      id: "org-1",
      orgName: "Org1",
      name: "Organization One",
      tagline: "tag",
      createdBy: "u1",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      status: "active",
      creationDate: "2025-01-01",
      images: [],
      groups: [],
      events: [],
      resources: [],
      faqEntries: [],
      texts: [defaultOrganizationText],
    };
    fetchMock.mockResolvedValueOnce(response);

    const result = await getOrganization("org-1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/communities\/organizations\/org-1$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.id).toBe("org-1");
    expect(result.texts).toEqual([defaultOrganizationText]);
  });

  // MARK: - List

  it("listOrganizations() builds query from filters, uses withoutAuth, and maps items", async () => {
    const { fetchMock } = getMocks();
    type ApiItem = Parameters<typeof mapOrganization>[0];
    const apiItem = {
      id: "org-2",
      orgName: "Org2",
      name: "Organization Two",
      tagline: "tag",
      createdBy: "u2",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      status: "active",
      creationDate: "2025-02-01",
      images: [],
      groups: [],
      events: [],
      resources: [],
      faqEntries: [],
      texts: undefined,
    } as unknown as ApiItem;
    const responseBody = {
      count: 1,
      next: null,
      previous: null,
      results: [apiItem],
    };
    fetchMock.mockResolvedValueOnce(responseBody);

    const result = await listOrganizations({ name: "abc" as unknown as never });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/communities\/organizations\?name=abc$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("org-2");
    expect(result[0].texts).toEqual([defaultOrganizationText]);
  });

  // MARK: - Create

  it("createOrganization() builds payload and returns created id", async () => {
    const { fetchMock } = getMocks();
    const form = {
      name: "New Org",
      location: "Earth",
      tagline: "Join",
      social_accounts: ["x"],
      description: "desc",
      topics: [],
    } as const;

    const created = { id: "org-3" };
    fetchMock.mockResolvedValueOnce(created);

    const id = await createOrganization({ ...form } as unknown as Parameters<
      typeof createOrganization
    >[0]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(fetchMock, "/communities/organizations", "POST", {
      name: form.name,
      location: form.location,
      tagline: form.tagline,
      social_accounts: form.social_accounts,
      description: form.description,
      topics: form.topics,
      high_risk: false,
      total_flags: 0,
    });
    expect(id).toBe("org-3");
  });

  // MARK: - Delete

  it("deleteOrganization() calls DELETE on the endpoint", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });

    await deleteOrganization("org-4");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/communities\/organizations\/org-4$/, "DELETE");
  });

  // MARK: - Error Handling

  it("propagates AppError via errorHandler on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(getOrganization("org-err")).rejects.toBeInstanceOf(AppError);
  });

  // MARK: - Mapping

  it("mapOrganization() defaults missing arrays and texts", () => {
    const minimal = {
      id: "org-5",
      orgName: "o",
      name: "O",
      tagline: undefined,
      createdBy: "u",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      status: "active",
      creationDate: "2025-03-01",
      images: undefined,
      groups: undefined,
      events: undefined,
      resources: undefined,
      faqEntries: undefined,
      texts: undefined,
    } as unknown as Parameters<typeof mapOrganization>[0];
    const mapped = mapOrganization(minimal);
    expect(mapped.texts).toEqual([defaultOrganizationText]);
    expect(mapped.socialLinks).toEqual([]);
    expect(mapped.images).toEqual([]);
    expect(mapped.groups).toEqual([]);
    expect(mapped.events).toEqual([]);
    expect(mapped.resources).toEqual([]);
    expect(mapped.faqEntries).toEqual([]);
  });
});
