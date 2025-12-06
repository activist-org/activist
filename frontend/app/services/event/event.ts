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
    offlineLocation: res.offlineLocation,
    socialLinks: res.socialLinks ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    startTime: res.startTime,
    endTime: res.endTime,
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
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Create

export async function createEvent(
  data: EventCreateFormData
): Promise<string | false> {
  try {
    const payload = {
      name: data.name,
      location: data.location,
      tagline: data.tagline,
      social_accounts: data.social_accounts,
      description: data.description,
      topics: data.topics,
      high_risk: false,
      total_flags: 0,
      acceptance_date: new Date(),
    };
    const res = await post<EventResponse, typeof payload>(
      `/events/events`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.id;
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
