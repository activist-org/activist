// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { fetchOrganizationEvents } from "../../../../app/services/communities/organization/event";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization/event", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: No Filters

  it("fetchOrganizationEvents() requests correct URL with no filters and maps response", async () => {
    const { fetchMock } = getMocks();
    const apiItem = {
      id: "evt-1",
      name: "Event One",
      tagline: "tag",
      createdBy: "u1",
      iconUrl: undefined,
      type: "action",
      onlineLocationLink: undefined,
      physicalLocation: undefined,
      socialLinks: [],
      resources: [],
      faqEntries: [],
      times: [],
      creationDate: "2025-01-01",
      orgs: { id: "org-1", name: "Org" },
      texts: [],
    };
    fetchMock.mockResolvedValueOnce([apiItem]);

    const result = await fetchOrganizationEvents("org-1", {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-1\/events\?$/,
      "GET"
    );
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("evt-1");
  });

  // MARK: Name Filter

  it("fetchOrganizationEvents() appends name filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce([]);

    await fetchOrganizationEvents("org-2", { name: "cleanup" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-2\/events\?.*name=cleanup/,
      "GET"
    );
  });

  // MARK: Start Date Filter

  it("fetchOrganizationEvents() appends startDate filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce([]);

    await fetchOrganizationEvents("org-3", { startDate: "2026-01-01" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-3\/events\?.*startDate=2026-01-01/,
      "GET"
    );
  });

  // MARK: End Date Filter

  it("fetchOrganizationEvents() appends endDate filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce([]);

    await fetchOrganizationEvents("org-4", { endDate: "2026-12-31" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-4\/events\?.*endDate=2026-12-31/,
      "GET"
    );
  });

  // MARK: All Filters

  it("fetchOrganizationEvents() appends all filters to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce([]);

    await fetchOrganizationEvents("org-5", {
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      name: "march",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = getFetchCall(fetchMock);
    expect(url).toMatch(/startDate=2026-01-01/);
    expect(url).toMatch(/endDate=2026-12-31/);
    expect(url).toMatch(/name=march/);
  });

  // MARK: Mapping

  it("fetchOrganizationEvents() maps each item in the response via mapEvent", async () => {
    const { fetchMock } = getMocks();
    const apiItems = [
      {
        id: "evt-10",
        name: "A",
        tagline: undefined,
        createdBy: "u1",
        iconUrl: undefined,
        type: "learn",
        onlineLocationLink: undefined,
        physicalLocation: undefined,
        socialLinks: undefined,
        resources: undefined,
        faqEntries: undefined,
        times: undefined,
        creationDate: "2025-01-01",
        orgs: { id: "org-5", name: "Org" },
        texts: undefined,
      },
      {
        id: "evt-11",
        name: "B",
        tagline: undefined,
        createdBy: "u2",
        iconUrl: undefined,
        type: "action",
        onlineLocationLink: undefined,
        physicalLocation: undefined,
        socialLinks: undefined,
        resources: undefined,
        faqEntries: undefined,
        times: undefined,
        creationDate: "2025-02-01",
        orgs: { id: "org-5", name: "Org" },
        texts: undefined,
      },
    ];
    fetchMock.mockResolvedValueOnce(apiItems);

    const result = await fetchOrganizationEvents("org-5", {});

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("evt-10");
    expect(result[0].socialLinks).toEqual([]);
    expect(result[0].resources).toEqual([]);
    expect(result[0].faqEntries).toEqual([]);
    expect(result[0].times).toEqual([]);
    expect(result[0].texts).toEqual([]);
    expect(result[1].id).toBe("evt-11");
  });

  // MARK: Error Handling

  it("fetchOrganizationEvents() propagates AppError via errorHandler on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));

    await expect(fetchOrganizationEvents("org-err", {})).rejects.toBeInstanceOf(
      AppError
    );
  });
});
