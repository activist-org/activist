// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import type {
  EventCreateFormData,
  EventFilters,
  EventResponse,
  EventsResponseBody,
  Event as EventT,
} from "~/types/events/event";

import { del, get, post } from "~/services/http";
import { defaultEventText } from "~/types/events/event";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Map API Response to Type

export function mapEvent(res: EventResponse): EventT {
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
    texts: res.texts?.[0] ?? defaultEventText,
  };
}

// MARK: Get by ID

export async function getEvent(id: string): Promise<EventT> {
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
  filters: EventFilters = {}
): Promise<EventT[]> {
  try {
    const query = new URLSearchParams(filters as Record<string, string>);
    const res = await get<EventsResponseBody>(
      `/events/events?${query.toString()}`,
      { withoutAuth: true }
    );
    return res.results.map(mapEvent);
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
      payload
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
