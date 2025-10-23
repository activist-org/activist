// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Resource, ResourceInput } from "~/types/content/resource";

import { post, put } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

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

// MARK: Reorder

export async function reorderOrganizationResources(
  orgId: string,
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
