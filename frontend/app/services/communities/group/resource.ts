// SPDX-License-Identifier: AGPL-3.0-or-later

import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates a new resource for a specific group by sending a POST request to the backend API with the provided resource data, including the title, link URL, order, and associated group ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function resolves without returning any value, indicating that the resource has been successfully created in the backend.
 * @param groupId The unique identifier of the group for which the resource is being created.
 * @param input The resource input data, including the title, link URL, order, and associated group ID for the resource to be created.
 * @returns A Promise that resolves when the resource has been successfully created in the backend, without returning any value.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
export async function createGroupResource(
  groupId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await post(
      `/communities/group_resources`,
      { ...input, group: groupId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

/**
 * Updates an existing resource for a specific group by sending a PUT request to the backend API with the provided resource data, including the unique identifier of the resource and any updated fields. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function resolves without returning any value, indicating that the resource has been successfully updated in the backend.
 * @param input The resource input data to be updated, including the unique identifier of the resource and any updated fields such as the title, link URL, order, and associated group ID.
 * @returns A Promise that resolves when the resource has been successfully updated in the backend, without returning any value.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateGroupResource(input: ResourceInput): Promise<void> {
  try {
    await put(
      `/communities/group_resources/${input.id}`,
      { ...input },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

/**
 * Deletes a specific resource for a group by sending a DELETE request to the backend API with the unique identifier of the resource. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving a successful response from the API, the function resolves without returning any value, indicating that the resource has been successfully deleted from the backend.
 * @param resourceId The unique identifier of the resource to be deleted.
 * @returns A Promise that resolves when the resource has been successfully deleted from the backend, without returning any value.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteGroupResource(resourceId: string): Promise<void> {
  try {
    await del(`/communities/group_resources/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

/**
 * Reorders the resources for a specific group by sending PUT requests to the backend API with the updated order of each resource. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application. Upon receiving successful responses from the API for all reorder requests, the function resolves without returning any value, indicating that the resources have been successfully reordered in the backend.
 * @param resources An array of resource data, including the unique identifier and updated order for each resource to be reordered.
 * @returns A Promise that resolves when all resources have been successfully reordered in the backend, without returning any value.
 * @throws {AppError} if any of the API requests fail or if there is an error during the reordering process.
 */
export async function reorderGroupResources(
  resources: Resource[]
): Promise<void> {
  try {
    await Promise.all(
      resources.map((r) =>
        put(
          `/communities/group_resources/${r.id}`,
          {
            id: r.id,
            order: r.order,
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
