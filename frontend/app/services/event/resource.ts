// SPDX-License-Identifier: AGPL-3.0-or-later

import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates a new resource for a specific event by sending a POST request to the backend API with the provided resource data, including the name, URL, order, and associated event ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the resource is being created.
 * @param input The resource input data, including the name, URL, order, and ISO code.
 * @returns A Promise that resolves when the resource has been successfully created in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
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

/**
 * Updates an existing resource for a specific event by sending a PUT request to the backend API with the updated resource data, including the name, URL, order, and associated event ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the resource is being updated.
 * @param input The updated resource input data, including the name, URL, order, and ISO code.
 * @returns A Promise that resolves when the resource has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
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

/**
 * Deletes a resource for a specific event by sending a DELETE request to the backend API. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param resourceId The unique identifier of the resource to be deleted.
 * @returns A Promise that resolves when the resource has been successfully deleted in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteEventResource(resourceId: string): Promise<void> {
  try {
    await del(`/events/event_resources/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

/**
 * Reorders the resources for a specific event by sending multiple PUT requests to the backend API with the updated order for each resource. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the resources are being reordered.
 * @param resources An array of resources with their updated order.
 * @returns A Promise that resolves when all resources have been successfully reordered in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the reordering process.
 */
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
