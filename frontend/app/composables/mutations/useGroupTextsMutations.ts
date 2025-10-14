// SPDX-License-Identifier: AGPL-3.0-or-later
// Mutation composable for FAQ entries - uses direct service calls, not useAsyncData

import type { MaybeRef } from "vue";

import type { GroupUpdateTextFormData } from "~/types/communities/group";
import type { AppError } from "~/utils/errorHandler";

import { updateGroupTexts } from "~/services/communities/group/text";

export function useGroupTextsMutations(groupId: MaybeRef<string>) {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const currentGroupId = computed(() => unref(groupId));

  // Update group texts.
  async function updateTexts(
    textsData: GroupUpdateTextFormData,
    textId: string
  ) {
    if (!currentGroupId.value) {
      return false;
    }

    loading.value = true;
    error.value = null;
    try {
      // Service function handles the HTTP call and throws normalized errors.
      await updateGroupTexts(currentGroupId.value, textId, textsData);
      // Refresh the group data to get the updated texts.
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
    await refreshNuxtData(`group:${currentGroupId.value}`);
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    updateTexts,
    refreshGroupData,
  };
}
