// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { del, get, getRaw, post } from "~/services/http";

const DEFAULT_CALENDAR_FILENAME = "activist-event.ics";

// MARK: Map API Response to Type

export function mapEvent(res: EventResponse): EventResponse {
  return {
    id: res.id,
    name: res.name,
    tagline: res.tagline,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    type: res.type,
    onlineLocationLink: res.onlineLocationLink,
    physicalLocation: res.physicalLocation,
    socialLinks: res.socialLinks ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    times: res.times ?? [],
    creationDate: res.creationDate,
    orgs: res.orgs,
    texts: res.texts ?? [],
  };
}

// MARK: Get by ID

export async function getEvent(id: string): Promise<EventResponse> {
  try {
    const res = await get<EventResponse>(`/events/events/${id}`, {
      withoutAuth: true,
    });
    return mapEvent(res);
  } catch (e) {
    throw errorHandler(e);
  }
}

export function getCalendarFilename(
  contentDisposition: string | null
): string {
  const match = contentDisposition?.match(
    /filename\*?=(?:UTF-8''|\")?([^\";]+)\"?/i
  );
  const encodedFilename = match?.[1]?.trim();

  if (!encodedFilename) return DEFAULT_CALENDAR_FILENAME;

  try {
    const filename = decodeURIComponent(encodedFilename).replace(/[\\/]/g, "_");
    return filename.toLowerCase().endsWith(".ics")
      ? filename
      : DEFAULT_CALENDAR_FILENAME;
  } catch {
    return DEFAULT_CALENDAR_FILENAME;
  }
}

export async function downloadEventCalendar(eventId: string): Promise<{
  calendar: Blob;
  filename: string;
}> {
  try {
    const response = await getRaw<Blob>("/events/event_calendar", {
      withoutAuth: true,
      query: { event_id: eventId },
      responseType: "blob",
    });

    if (!response._data) {
      throw new Error("Calendar response did not contain a file.");
    }

    return {
      calendar: response._data,
      filename: getCalendarFilename(response.headers.get("content-disposition")),
    };
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List All

export async function listEvents(
  filters: EventFilters & Pagination = { page: 1, page_size: 10 }
): Promise<EventsPaginatedResponse> {
  try {
    const query = new URLSearchParams();
    // Handle topics specially: arrays become repeated params (?topics=A&topics=B).
    const { topics, ...rest } = filters;
    if (topics) {
      topics.forEach((t) => {
        if (!t) return;
        query.append("topics", String(t));
      });
    }

    // Add the remaining filters as single query params.
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      query.append(key, String(value));
    });
    const res = await get<EventsResponseBody>(
      `/events/events?${query.toString()}`,
      { withoutAuth: true }
    );
    return { data: res.results.map(mapEvent), isLastPage: !res.next };
  } catch (e: unknown) {
    throw errorHandler(e);
  }
}

// MARK: Create

export async function createEvent(
  data: CreateEventInput
): Promise<EventResponse> {
  try {
    const res = await post<EventResponse, typeof data>(`/events/events`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res;
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Delete

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await del(`/events/events/${eventId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}
