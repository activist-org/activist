// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { del, get, post } from "~/services/http";

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

// MARK: Download Calendar (.ics)

export async function downloadEventCalendar(
  eventId: string,
  eventName?: string
): Promise<void> {
  const config = useRuntimeConfig();
  const res = await fetch(
    `${config.public.apiBaseUrl}/events/event_calendar?event_id=${eventId}`
  );
  if (!res.ok) {
    throw new Error("Failed to download calendar entry");
  }

  const blob = await res.blob();
  const contentDisposition = res.headers.get("content-disposition");
  let filename = `${eventName ? eventName.replace(/[^a-zA-Z0-9_-]/g, "_") : "event"}.ics`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(
      /filename\*?=['"]?(?:UTF-8'')?([^;'"\r\n]+)['"]?/i
    );
    if (filenameMatch && filenameMatch[1]) {
      filename = decodeURIComponent(filenameMatch[1]);
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

