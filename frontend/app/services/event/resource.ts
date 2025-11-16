// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Resource, ResourceInput } from "~/types/content/resource";

import { del, post, put } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Create

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
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

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
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteEventResource(resourceId: string): Promise<void> {
  try {
    await del(`/events/event_resources/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

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
