// SPDX-License-Identifier: AGPL-3.0-or-later
import { put } from "~/services/http";

// MARK: Update

/**
 * Updates the text content for a specific group by sending a PUT request to the backend API with the updated text data, including the description, get involved prompt, and associated group ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param groupId The unique identifier of the group for which the text content is being updated.
 * @param textId The unique identifier of the text content to be updated.
 * @param data The updated text content data, including the description, get involved prompt, and get involved URL.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateGroupTexts(
  groupId: string,
  textId: string,
  data: GroupUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/communities/group_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        getInvolvedUrl: data.getInvolvedUrl,
        donate_prompt: "",
        groupId: groupId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}
