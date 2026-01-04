// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { defaultEventText } from "../../../app/constants/event";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  mapEvent,
} from "../../../app/services/event/event";
import { AppError } from "../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  getFetchCall,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event", () => {
  const getMocks = setupServiceTestMocks();

  // MARK: Get

  it("getEvent() requests by ID with withoutAuth and maps response", async () => {
    const { fetchMock } = getMocks();
    const response = {
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
      startTime: "2025-01-01",
      endTime: "2025-01-02",
      creationDate: "2025-01-01",
      orgs: { id: "org1", name: "Org" },
      texts: [defaultEventText],
    };
    fetchMock.mockResolvedValueOnce(response);

    const result = await getEvent("evt-1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/events\/events\/evt-1$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    // withoutAuth: true should omit Authorization.
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.id).toBe("evt-1");
    expect(result.texts).toEqual([defaultEventText]);
  });

  // MARK: List

  it("listEvents() builds query from filters, uses withoutAuth, and maps items", async () => {
    const { fetchMock } = getMocks();
    type ApiItem = Parameters<typeof mapEvent>[0];
    const apiItem = {
      id: "evt-2",
      name: "Event Two",
      tagline: "tag",
      createdBy: "u2",
      iconUrl: undefined,
      type: "learn",
      onlineLocationLink: undefined,
      physicalLocation: undefined,
      socialLinks: [],
      resources: [],
      faqEntries: [],
      startTime: "2025-02-01",
      endTime: undefined,
      creationDate: "2025-02-01",
      orgs: { id: "org2", name: "Org" },
      // Undefined to exercise defaulting in mapEvent.
      texts: undefined,
    } as unknown as ApiItem;
    const responseBody = {
      count: 1,
      next: null,
      previous: null,
      results: [apiItem],
    };
    fetchMock.mockResolvedValueOnce(responseBody);

    const result = await listEvents({ name: "abc" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/events\/events\?name=abc$/, "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBeUndefined();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("evt-2");
    expect(result.data[0].texts).toEqual([]);
    expect(result.isLastPage).toBe(true);
  });

  // MARK: Create

  it("createEvent() builds payload and returns created id", async () => {
    const { fetchMock } = getMocks();
    const form = {
      name: "New Event",
      location: "Earth",
      tagline: "Join us",
      social_accounts: ["x"],
      description: "desc",
      topics: [],
    } as const;

    const created = { id: "evt-3" };
    fetchMock.mockResolvedValueOnce(created);

    const id = await createEvent({ ...form });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // The service constructs a specific payload subset.
    expectJsonRequest(fetchMock, "/events/events", "POST", {
      name: form.name,
      location: form.location,
      tagline: form.tagline,
      social_accounts: form.social_accounts,
      description: form.description,
      topics: form.topics,
      high_risk: false,
      total_flags: 0,
    });
    expect(id).toBe("evt-3");
  });

  // MARK: Delete

  it("deleteEvent() calls DELETE on the event endpoint", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });

    await deleteEvent("evt-4");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, /\/events\/events\/evt-4$/, "DELETE");
  });

  // MARK: Error Handling

  it("propagates AppError via errorHandler on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));

    await expect(getEvent("evt-err")).rejects.toBeInstanceOf(AppError);
  });

  // MARK: Mapping

  it("mapEvent() defaults missing arrays and texts", () => {
    const minimal = {
      id: "evt-5",
      name: "m",
      tagline: undefined,
      createdBy: "u",
      iconUrl: undefined,
      type: "action",
      onlineLocationLink: undefined,
      physicalLocation: undefined,
      socialLinks: [],
      resources: undefined,
      faqEntries: undefined,
      startTime: "2025-03-01",
      endTime: undefined,
      creationDate: "2025-03-01",
      orgs: { id: "o", name: "O" },
      texts: undefined,
    } as unknown as Parameters<typeof mapEvent>[0];
    const mapped = mapEvent(minimal);
    expect(mapped.texts).toEqual([]);
    expect(mapped.socialLinks).toEqual([]);
    expect(mapped.resources).toEqual([]);
    expect(mapped.faqEntries).toEqual([]);
  });
});
