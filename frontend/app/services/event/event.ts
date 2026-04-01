// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import { del, get, post } from "~/services/http";

// MARK: Map API Response to Type

/**
 * Maps the raw API response for an event to the EventResponse type used in the frontend, ensuring that all optional fields are properly handled and defaulted to empty arrays where necessary to prevent undefined values in the application.
 * @param res The raw event response from the API, which may contain optional fields that are undefined.
 * @returns An EventResponse object with all fields defined, where optional array fields are defaulted to empty arrays if they were undefined in the input.
 */
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

/**
 * Fetches a single event by its unique identifier from the backend API, using the get helper function for making HTTP requests and the errorHandler for consistent error handling. The function maps the raw API response to the EventResponse type used in the frontend, ensuring that all optional fields are properly handled.
 * @param id The unique identifier of the event to be fetched from the API.
 * @returns A Promise that resolves to an EventResponse object containing the details of the fetched event, with all optional fields defined and defaulted as necessary.
 * @throws {AppError} if the API request fails or if there is an error during the mapping of the response.
 */
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

/**
 * Fetches a list of events from the backend API, applying optional filters and pagination parameters. The function maps the raw API response to the EventResponse type used in the frontend, ensuring that all optional fields are properly handled.
 * @param filters An object containing optional filter parameters and pagination settings to be applied to the API request for fetching events.
 * @returns A Promise that resolves to an EventsPaginatedResponse object containing an array of EventResponse objects and a boolean indicating if the current page is the last page of results.
 * @throws {AppError} if the API request fails or if there is an error during the mapping of the response.
 */
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
      if (!value) return;
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

/**
 * Creates a new event in the backend API, using the post helper function for making HTTP requests and the errorHandler for consistent error handling. The function maps the raw API response to the EventResponse type used in the frontend, ensuring that all optional fields are properly handled.
 * @param data The input data for creating a new event, conforming to the CreateEventInput type.
 * @returns A Promise that resolves to an EventResponse object containing the details of the newly created event, with all optional fields defined and defaulted as necessary.
 * @throws {AppError} if the API request fails or if there is an error during the mapping of the response.
 */
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

/**
 * Deletes an event by its unique identifier from the backend API, using the del helper function for making HTTP requests and the errorHandler for consistent error handling.
 * @param eventId The unique identifier of the event to be deleted.
 * @returns A Promise that resolves when the event has been successfully deleted.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await del(`/events/events/${eventId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}
