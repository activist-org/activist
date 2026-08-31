// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  mapOrganization,
} from "../../../../app/services/communities/organization/organization";
import { defaultOrganizationText } from "../../../../shared/constants/organization";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: Get

  it("getOrganization() requests by ID with withoutAuth and maps response", async () => {
    const { get } = getMocks();
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
    get.mockResolvedValueOnce(response);

    const result = await getOrganization("org-1");

    expect(get).toHaveBeenCalledTimes(1);
    expectRequest(get, /\/communities\/organizations\/org-1$/, "GET");
    const [, opts] = getFetchCall(get);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.id).toBe("org-1");
    expect(result.texts).toEqual([defaultOrganizationText]);
  });

  // MARK: List

  it("listOrganizations() builds query from filters, uses withoutAuth, and maps items", async () => {
    const { get } = getMocks();
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
    get.mockResolvedValueOnce(responseBody);

    const result = await listOrganizations({ name: "abc" as unknown as never });

    expect(get).toHaveBeenCalledTimes(1);
    expectRequest(get, /\/communities\/organizations\?name=abc$/, "GET");
    const [, opts] = getFetchCall(get);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("org-2");
    expect(result.data[0].texts).toEqual([]);
    expect(result.isLastPage).toBe(true);
  });

  // MARK: Create

  it("createOrganization() builds payload and returns created id", async () => {
    const { post } = getMocks();
    const form = {
      name: "New Org",
      country_code: "US",
      city: "City",
      tagline: "Join",
      description: "desc",
      topics: [],
    } as const;

    const created = { id: "org-3" };
    post.mockResolvedValueOnce(created);

    const org = await createOrganization({ ...form } as unknown as Parameters<
      typeof createOrganization
    >[0]);

    expect(post).toHaveBeenCalledTimes(1);
    expectJsonRequest(post, "/communities/organizations", "POST", {
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      topics: form.topics,
    });
    expect(org.id).toBe("org-3");
  });

  // MARK: Delete

  it("deleteOrganization() calls DELETE on the endpoint", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });

    await deleteOrganization("org-4");

    expect(del).toHaveBeenCalledTimes(1);
    expectRequest(del, /\/communities\/organizations\/org-4$/, "DELETE");
  });

  // MARK: Error Handling

  it("propagates AppError via errorHandler on failure", async () => {
    const { get } = getMocks();
    get.mockRejectedValueOnce(new Error("boom"));
    await expect(getOrganization("org-err")).rejects.toBeInstanceOf(AppError);
  });

  // MARK: Mapping

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
    expect(mapped.texts).toEqual([]);
    expect(mapped.socialLinks).toEqual([]);
    expect(mapped.images).toEqual([]);
    expect(mapped.groups).toEqual([]);
    expect(mapped.events).toEqual([]);
    expect(mapped.resources).toEqual([]);
    expect(mapped.faqEntries).toEqual([]);
  });
});
