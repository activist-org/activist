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
    const newEventInput = {
      name: "Community Garden Workshop",
      tagline: "Learn to grow your own food",
      description:
        "Join us for a hands-on workshop about urban gardening and sustainability.",
      organizations: ["org-id-123"],
      groups: ["group-id-456"],
      location_type: "offline",
      event_type: "learn", // or "action"
      topics: ["sustainability", "community"], // Replace with actual TopicEnum values
      location: {
        address_or_name: "Central Park Community Garden",
        city: "New York",
        country_code: "US",
        lat: "40.785091",
        lon: "-73.968285",
        bbox: ["40.7", "-74.0", "40.8", "-73.9"],
      },
      times: [
        {
          start: "2025-05-15T10:00:00Z",
          end: "2025-05-15T14:00:00Z",
          timezone: "America/New_York",
        },
      ],
    } as const;

    const created = "evt-3";
    fetchMock.mockResolvedValueOnce(created);

    const id = await createEvent({ ...newEventInput });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // The service constructs a specific payload subset.
    expectJsonRequest(fetchMock, "/events/events", "POST", {
      name: newEventInput.name,
      location: newEventInput.location,
      tagline: newEventInput.tagline,
      description: newEventInput.description,
      topics: newEventInput.topics,
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
