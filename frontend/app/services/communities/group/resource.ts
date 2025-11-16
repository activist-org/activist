// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Resource, ResourceInput } from "~/types/content/resource";

import { del, post, put } from "~/services/http";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Create

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

export async function deleteGroupResource(resourceId: string): Promise<void> {
  try {
    await del(`/communities/group_resources/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

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
