// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import {
  getGroup,
  listGroups,
  mapGroup,
} from "../../../../app/services/communities/group/group";
import { defaultGroupText } from "../../../../app/types/communities/group";
import { AppError } from "../../../../app/utils/errorHandler";
import {
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/group", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: - Get

  it("getGroup() requests by ID with withoutAuth and maps response", async () => {
    const { fetchMock } = getMocks();
    const response = {
      id: "grp-1",
      images: [],
      groupName: "Group1",
      name: "Group One",
      tagline: "tag",
      org: { id: "o1", name: "Org" },
      createdBy: "u1",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      creationDate: "2025-01-01",
      events: [],
      resources: [],
      faqEntries: [],
      texts: [defaultGroupText],
    };
    fetchMock.mockResolvedValueOnce(response);

    const result = await getGroup("grp-1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/communities\/groups\/grp-1$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.id).toBe("grp-1");
    expect(result.texts).toEqual([defaultGroupText]);
  });

  // MARK: - List

  it("listGroups() calls the list endpoint and maps results", async () => {
    const { fetchMock } = getMocks();
    type ApiItem = Parameters<typeof mapGroup>[0];
    const apiItem = {
      id: "grp-2",
      images: [],
      groupName: "Group2",
      name: "Group Two",
      tagline: "t",
      org: { id: "o2", name: "Org" },
      createdBy: "u2",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      creationDate: "2025-02-01",
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

    const result = await listGroups();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Note: endpoint is singular "group" per current service implementation
    expectRequest(fetchMock, /\/communities\/group$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("grp-2");
    expect(result[0].texts).toEqual([defaultGroupText]);
  });

  // MARK: - Error Handling

  it("propagates AppError via errorHandler on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(getGroup("grp-err")).rejects.toBeInstanceOf(AppError);
  });

  // MARK: - Mapping

  it("mapGroup() defaults missing arrays and texts", () => {
    const minimal = {
      id: "grp-3",
      images: undefined,
      groupName: "g",
      name: "G",
      tagline: undefined,
      org: { id: "o", name: "O" },
      createdBy: "u",
      iconUrl: undefined,
      location: undefined,
      socialLinks: [],
      creationDate: "2025-03-01",
      events: undefined,
      resources: undefined,
      faqEntries: undefined,
      texts: undefined,
    } as unknown as Parameters<typeof mapGroup>[0];
    const mapped = mapGroup(minimal);
    expect(mapped.texts).toEqual([defaultGroupText]);
    expect(mapped.images).toEqual([]);
    expect(mapped.events).toEqual([]);
    expect(mapped.resources).toEqual([]);
    expect(mapped.faqEntries).toEqual([]);
  });
});
