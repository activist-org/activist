// SPDX-License-Identifier: AGPL-3.0-or-later

import { del, post, put } from "~/services/http";

// MARK: Create

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
    throw errorHandler(e);
  }
}
