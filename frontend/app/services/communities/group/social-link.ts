// SPDX-License-Identifier: AGPL-3.0-or-later
import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates new social links for a specific group by sending POST requests to the backend API with the provided social link data, including the link URL, label, order, and associated group ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param groupId The unique identifier of the group for which the social links are being created.
 * @param links An array of social link input data, including the link URL, label, and order for each social link to be created.
 * @returns A Promise that resolves when all social links have been successfully created in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the creation process.
 */
export async function createGroupSocialLinks(
  groupId: string,
  links: SocialLinkInput[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(
          `/communities/group_social_links`,
          {
            link: data.link,
            label: data.label,
            order: data.order,
            group: groupId,
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
 * Updates an existing social link for a specific group by sending a PUT request to the backend API with the provided social link data, including the link URL, label, order, and associated group ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param linkId The unique identifier of the social link to be updated.
 * @param data The updated social link data, including the link URL, label, order, and associated group ID for the social link to be updated.
 * @param data.link The URL of the social link to be updated.
 * @param data.label The label for the social link to be updated, which may be displayed alongside the link in the frontend.
 * @param data.order The order number for the social link to be updated, indicating its position relative to other social links for the same group.
 * @param data.group The unique identifier of the group associated with the social link to be updated.
 * @returns A Promise that resolves when the social link has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateGroupSocialLink(
  linkId: string,
  data: { link: string; label: string; order: number; group: string }
): Promise<void> {
  try {
    await put(`/communities/group_social_links/${linkId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

/**
 * Deletes a specific social link for a group by sending a DELETE request to the backend API with the unique identifier of the social link. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function resolves without returning any value, indicating that the social link has been successfully deleted from the backend.
 * @param linkId The unique identifier of the social link to be deleted.
 * @returns A Promise that resolves when the social link has been successfully deleted from the backend, without returning any value.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteGroupSocialLink(linkId: string): Promise<void> {
  try {
    await del(`/communities/group_social_links/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace All

// Note: Deletes all links then recreates.
/**
 * Replaces all social links for a specific group by first sending a DELETE request to the backend API to remove all existing social links associated with the group, and then sending a POST request to create new social links based on the provided array of link data. The function uses the del and post helpers for making HTTP requests and the errorHandler for consistent error handling across the application. Upon successful completion of both the deletion and creation processes, the function resolves without returning any value, indicating that all social links for the specified group have been successfully replaced in the backend.
 * @param groupId The unique identifier of the group for which the social links are being replaced.
 * @param links An array of social link data to be created for the group, including the link URL, label, order, and associated group ID for each social link.
 * @returns A Promise that resolves when all social links for the specified group have been successfully replaced in the backend, without returning any value.
 * @throws {AppError} if any of the API requests fail or if there is an error during the replacement process.
 */
export async function replaceAllGroupSocialLinks(
  groupId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete.
    await del(`/communities/group_social_links`, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it.
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        group: groupId,
      },
    });
    await createGroupSocialLinks(groupId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
