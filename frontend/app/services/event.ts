// SPDX-License-Identifier: AGPL-3.0-or-later
// Events service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import type { FaqEntry } from "~/types/content/faq-entry";
import type { UploadableFile } from "~/types/content/file";
import type { Resource, ResourceInput } from "~/types/content/resource";
import type { SocialLinkFormData } from "~/types/content/social-link";
import type {
  Event as EventT,
  EventResponse,
  EventsResponseBody,
  EventCreateFormData,
  EventUpdateTextFormData,
  EventFilters,
} from "~/types/events/event";

import { get, post, put, del } from "~/services/http";
import { EntityType } from "~/types/entity";
import { defaultEventText } from "~/types/events/event";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Map API response to frontend type
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
    getInvolvedUrl: res.getInvolvedUrl,
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

// MARK: Get event by ID
export async function getEvent(id: string): Promise<EventT> {
  try {
    const res = await get<EventResponse>(`/events/events/${id}`);
    return mapEvent(res);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: List all events
export async function listEvents(
  filters: EventFilters = {}
): Promise<EventT[]> {
  try {
    const query = new URLSearchParams(filters as Record<string, string>);
    const res = await get<EventsResponseBody>(
      `/events/events?${query.toString()}`
    );
    return res.results.map(mapEvent);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Create event
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

// MARK: Update event texts
export async function updateEventTexts(
  eventId: string,
  textId: string,
  data: EventUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/events/event_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        donate_prompt: "",
        orgId: eventId,
        iso: "en",
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Icon image upload
export async function uploadEventIconImage(
  eventId: string,
  file: UploadableFile
): Promise<void> {
  try {
    const fd = new FormData();
    fd.append("entity_id", eventId);
    fd.append("entity_type", EntityType.EVENT);
    fd.append("file_object", file.file);
    await post(`/content/image_icon`, fd);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Social links
export async function createEventSocialLinks(
  eventId: string,
  links: SocialLinkFormData[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(
          `/events/event_social_links`,
          {
            link: data.link,
            label: data.label,
            order: data.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function updateEventSocialLink(
  eventId: string,
  linkId: string,
  data: { link: string; label: string; order: number }
): Promise<void> {
  try {
    await put(
      `/events/event_social_links/${linkId}`,
      {
        link: data.link,
        label: data.label,
        order: data.order,
        event: eventId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function deleteEventSocialLink(linkId: string): Promise<void> {
  try {
    await del(`/events/event_social_links/${linkId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}

// Bulk delete and recreate social links (replace all)
export async function replaceAllEventSocialLinks(
  eventId: string,
  links: SocialLinkFormData[]
): Promise<void> {
  try {
    await del(`/events/event_social_links`, {
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        event: eventId,
      },
    });
    await createEventSocialLinks(eventId, links);
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: FAQ Entries
export async function createEventFaq(
  eventId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(
      `/events/event_faqs`,
      {
        iso: faq.iso,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
        event: eventId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function updateEventFaq(
  eventId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await put(
      `/events/event_faqs/${faq.id}`,
      {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        event: eventId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function reorderEventFaqs(
  eventId: string,
  faqs: FaqEntry[]
): Promise<void> {
  try {
    await Promise.all(
      faqs.map((faq) =>
        put(
          `/events/event_faqs/${faq.id}`,
          {
            id: faq.id,
            order: faq.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Resources
export async function createEventResource(
  eventId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await post(
      `/events/event_resources`,
      { ...input, event: eventId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function updateEventResource(
  eventId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await put(
      `/events/event_resources/${input.id}`,
      { ...input, event: eventId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

export async function reorderEventResources(
  eventId: string,
  resources: Resource[]
): Promise<void> {
  try {
    await Promise.all(
      resources.map((resource) =>
        put(
          `/events/event_resources/${resource.id}`,
          {
            id: resource.id,
            order: resource.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

// MARK: Delete event
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await del(`/events/events/${eventId}`);
  } catch (e) {
    throw errorHandler(e);
  }
}
