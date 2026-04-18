// SPDX-License-Identifier: AGPL-3.0-or-later

import { del, post, put } from "~/services/http";

// MARK: Create

/**
 * Creates a new resource for a specific organization by sending a POST request to the backend API with the provided resource data, including the title, link, order, and associated organization ID. The function uses the post helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param orgId The unique identifier of the organization for which the resource is being created.
 * @param input The resource input data, including the title, link, order, and ISO code for the resource to be created.
 * @returns A Promise that resolves when the resource has been successfully created in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the creation process.
 */
export async function createOrganizationResource(
  orgId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await post(
      `/communities/organization_resources`,
      { ...input, org: orgId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

/**
 * Updates an existing resource for a specific organization by sending a PUT request to the backend API with the provided resource data, including the title, link, order, and associated organization ID. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param orgId The unique identifier of the organization for which the resource is being updated.
 * @param input The resource input data, including the title, link, order, and ISO code for the resource to be updated.
 * @returns A Promise that resolves when the resource has been successfully updated in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the update process.
 */
export async function updateOrganizationResource(
  orgId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await put(
      `/communities/organization_resources/${input.id}`,
      { ...input, org: orgId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

/**
 * Deletes an existing resource for a specific organization by sending a DELETE request to the backend API with the provided resource ID. The function uses the del helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param resourceId The unique identifier of the resource to be deleted.
 * @returns A Promise that resolves when the resource has been successfully deleted in the backend.
 * @throws {AppError} if the API request fails or if there is an error during the deletion process.
 */
export async function deleteOrganizationResource(
  resourceId: string
): Promise<void> {
  try {
    await del(`/communities/organization_resources/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

/**
 * Reorders the resources for a specific organization by sending PUT requests to the backend API with the updated order for each resource. The function uses the put helper for making HTTP requests and the errorHandler for consistent error handling across the application.
 * @param orgId The unique identifier of the organization for which the resources are being reordered.
 * @param resources An array of resources with their updated order.
 * @returns A Promise that resolves when all resources have been successfully reordered in the backend.
 * @throws {AppError} if any of the API requests fail or if there is an error during the reordering process.
 */
export async function reorderOrganizationResources(
  orgId: string,
  resources: Resource[]
): Promise<void> {
  try {
    await Promise.all(
      resources.map((resource) =>
        put(
          `/communities/organization_resources/${resource.id}`,
          {
            id: resource.id,
            order: resource.order,
            org: orgId,
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
