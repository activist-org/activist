// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates new social links for a specific event by sending POST requests to the backend API with the provided social link data, including the link URL, label, order, and associated event ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the social links are being created.
 * @param links An array of social link input data, including the link URL, label, and order for each social link to be created.
 * @returns A Promise that resolves when all social links have been successfully created in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the creation process.
 */
export async function createEventSocialLinks(
  eventId: string,
  links: SocialLinkInput[]
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
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

/**
 * Updates an existing social link for a specific event by sending a PUT request to the backend API with the updated social link data, including the link URL, label, order, and associated event ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the social link is being updated.
 * @param linkId The unique identifier of the social link to be updated.
 * @param data The updated social link data, including the link URL, label, and order.
 * @param data.link The updated URL of the social link.
 * @param data.label The updated label of the social link.
 * @param data.order The updated order of the social link.
 * @returns A Promise that resolves when the social link has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateEventSocialLink(
  eventId: string,
  linkId: string,
  data: { link: string; label: string; order: number }
): Promise<void> {
  try {
    await put(
      `/events/event_social_links/${linkId}`,
      {
        ...data,
        event: eventId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

/**
 * Deletes a social link for a specific event by sending a DELETE request to the backend API. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param linkId The unique identifier of the social link to be deleted.
 * @returns A Promise that resolves when the social link has been successfully deleted in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteEventSocialLink(linkId: string): Promise<void> {
  try {
    await del(`/events/event_social_links/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace All

// Note: Deletes all links then recreates.
/**
 * Replaces all social links for a specific event by first deleting all existing links and then creating new ones. The function uses the del and post helpers for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param eventId The unique identifier of the event for which the social links are being replaced.
 * @param links An array of social link input data, including the link URL, label, and order for each social link to be created.
 * @returns A Promise that resolves when all social links have been successfully replaced in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the replacement process.
 */
export async function replaceAllEventSocialLinks(
  eventId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete.
    await del(`/events/event_social_links`, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it.
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        event: eventId,
      },
    });
    await createEventSocialLinks(eventId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
