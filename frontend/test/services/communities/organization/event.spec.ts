// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { listOrganizationEvents } from "../../../../app/services/communities/organization/event";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../../helpers";

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

describe("services/communities/organization/event", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: No Filters

  it("listOrganizationEvents() requests default page params and maps response", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({
      count: 1,
      next: null,
      previous: null,
      results: [apiItem],
    });

    const result = await listOrganizationEvents("org-1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-1\/events\?page=1&page_size=10$/,
      "GET"
    );
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("evt-1");
    expect(result.isLastPage).toBe(true);
  });

  // MARK: Name Filter

  it("listOrganizationEvents() appends name filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    await listOrganizationEvents("org-2", { name: "cleanup" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-2\/events\?.*name=cleanup/,
      "GET"
    );
  });

  // MARK: Start Date Filter

  it("listOrganizationEvents() appends startDate filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    await listOrganizationEvents("org-3", { startDate: "2026-01-01" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-3\/events\?.*startDate=2026-01-01/,
      "GET"
    );
  });

  // MARK: End Date Filter

  it("listOrganizationEvents() appends endDate filter to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    await listOrganizationEvents("org-4", { endDate: "2026-12-31" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(
      fetchMock,
      /\/communities\/organizations\/org-4\/events\?.*endDate=2026-12-31/,
      "GET"
    );
  });

  // MARK: All Filters

  it("listOrganizationEvents() appends filters and pagination to query", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    await listOrganizationEvents("org-5", {
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      name: "march",
      page: 2,
      page_size: 10,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = getFetchCall(fetchMock);
    expect(url).toMatch(/startDate=2026-01-01/);
    expect(url).toMatch(/endDate=2026-12-31/);
    expect(url).toMatch(/name=march/);
    expect(url).toMatch(/page=2/);
    expect(url).toMatch(/page_size=10/);
  });

  // MARK: Mapping

  it("listOrganizationEvents() maps each item in results via mapEvent", async () => {
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
    fetchMock.mockResolvedValueOnce({
      count: 2,
      next: "http://example.test/events?page=2",
      previous: null,
      results: apiItems,
    });

    const result = await listOrganizationEvents("org-5");

    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe("evt-10");
    expect(result.data[0].socialLinks).toEqual([]);
    expect(result.data[0].resources).toEqual([]);
    expect(result.data[0].faqEntries).toEqual([]);
    expect(result.data[0].times).toEqual([]);
    expect(result.data[0].texts).toEqual([]);
    expect(result.data[1].id).toBe("evt-11");
    expect(result.isLastPage).toBe(false);
  });

  // MARK: Error Handling

  it("listOrganizationEvents() propagates AppError via errorHandler on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));

    await expect(listOrganizationEvents("org-err")).rejects.toBeInstanceOf(
      AppError
    );
  });
});
