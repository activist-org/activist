// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData

import type { MaybeRef } from "vue";

import type { Resource, ResourceInput } from "~/types/content/resource";
import type { AppError } from "~/utils/errorHandler";

import {
  createGroupResource,
  reorderGroupResources,
  updateGroupResource,
} from "~/services/communities/group/resource";

import { getKeyForGetGroup } from "../queries/useGetGroup";

export function useGroupResourcesMutations(groupId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Create new resource.
  async function createResource(resourceData: ResourceInput) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Service function handles the HTTP call and throws normalized errors.
      await createGroupResource(currentGroupId.value, resourceData as Resource);

      // Refresh the group data to get the new resource.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update existing resource.
  async function updateResource(resource: ResourceInput) {
    loading.value = true;
    error.value = null;

    try {
      // Direct service call - no useAsyncData needed for mutations.
      await updateGroupResource(resource);

      // Invalidate cache and refetch fresh data.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Reorder multiple resource entries.
  async function reorderResources(resources: Resource[]) {
    loading.value = true;
    error.value = null;

    try {
      await reorderGroupResources(resources);

      // Refresh to get the updated order.
      await refreshGroupData();

      return true;
    } catch (err) {
      showToastError((err as AppError).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Helper to refresh group data after mutations.
  async function refreshGroupData() {
    if (!currentGroupId.value) {
      return;
    }
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetGroup(currentGroupId.value));
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createResource,
    updateResource,
    reorderResources,
    refreshGroupData,
  };
}
