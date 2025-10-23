<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormSocialLink
      :key="formKey"
      @updateList="updateSocialLinksRef"
      :formData="formData"
      :handleSubmit="handleSubmit"
      :socialLinksRef="socialLinksRef || []"
      :submitLabel="submitLabel"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { SocialLinkItem } from "~/components/form/FormSocialLink.vue";
import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

import { useEventSocialLinksMutations } from "~/composables/mutations/useEventSocialLinksMutations";
import { useGetEvent } from "~/composables/queries/useGetEvent";

const modalName = "ModalSocialLinksEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
const { updateLink, createLinks, deleteLink } =
  useEventSocialLinksMutations(eventId);

type SocialLinkWithKey = (EventSocialLink | SocialLink) & { key: string };
const socialLinksRef = ref<SocialLinkWithKey[]>();

socialLinksRef.value = (event.value?.socialLinks || []).map((l, idx) => ({
  ...l,
  key: l.id ?? String(idx),
}));

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink, index) => ({
    label: socialLink.label,
    link: socialLink.link,
    order: index,
    id: socialLink.id,
  })),
}));

const submitLabel = "i18n.components.modal.social_links._global.update_links";

// Reactive key to force form reset when dragging.
const formKey = ref(0);

// Prevent duplicate submissions.
const isSubmitting = ref(false);

// Handle updates from FormSocialLink (dragging, removing, adding).
function updateSocialLinksRef(updatedList: SocialLinkItem[]) {
  const oldLength = socialLinksRef.value?.length || 0;
  const newLength = updatedList.length;
  const isAddOperation = newLength > oldLength;
  const isRemoveOperation = newLength < oldLength;

  socialLinksRef.value = updatedList as SocialLinkWithKey[];

  // Only reset form for drag operations (same length), not for add/remove.
  // Removing formKey increment on deletions prevents race condition during submission.
  if (!isAddOperation && !isRemoveOperation) {
    formKey.value++;
  }
}

// Individual CRUD operations - no more "delete all and recreate"!
async function handleSubmit(values: unknown) {
  // Prevent duplicate submissions.
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const formValues = (
      values as { socialLinks: { link: string; label: string }[] }
    ).socialLinks;

    // Track existing IDs.
    const existingIds = new Set(
      (event.value?.socialLinks || []).map((link) => link.id)
    );
    const currentIds = new Set(
      socialLinksRef.value?.map((link) => link.id).filter(Boolean)
    );

    let allSuccess = true;

    // 1. DELETE: Items that existed but are no longer in the list.
    const toDelete = (event.value?.socialLinks || []).filter(
      (link) => link.id && !currentIds.has(link.id)
    );
    for (const link of toDelete) {
      const success = await deleteLink(link.id!);
      if (!success) allSuccess = false;
    }

    // 2. UPDATE: Items that still exist (have IDs and are in existing set).
    const toUpdate =
      socialLinksRef.value?.filter(
        (link) => link.id && existingIds.has(link.id)
      ) || [];
    for (const refItem of toUpdate) {
      const formIndex = socialLinksRef.value?.indexOf(refItem) ?? -1;
      const formLink = formValues?.[formIndex];
      if (formLink && refItem.id) {
        // Only update if link or label actually changed (ignore order for now).
        const existing = (event.value?.socialLinks || []).find(
          (l) => l.id === refItem.id
        );
        if (
          existing &&
          (existing.link !== formLink.link ||
            existing.label !== formLink.label ||
            existing.order !== formIndex)
        ) {
          const success = await updateLink(refItem.id, {
            link: formLink.link,
            label: formLink.label,
            order: formIndex,
          });
          if (!success) allSuccess = false;
        }
      }
    }

    // 3. CREATE: Items without IDs (newly added).
    const toCreate = socialLinksRef.value?.filter((link) => !link.id) || [];

    const createData = toCreate
      .map((refItem) => {
        const formIndex = socialLinksRef.value?.indexOf(refItem) ?? -1;
        const formLink = formValues?.[formIndex];
        // Use form values if available, otherwise fall back to refItem.
        const data = {
          link: formLink?.link || refItem.link || "",
          label: formLink?.label || refItem.label || "",
          order: formIndex,
        };
        // Don't create if link/label are empty OR if they match an existing link.
        const isDuplicate = (event.value?.socialLinks || []).some(
          (existing) =>
            existing.link === data.link && existing.label === data.label
        );
        return isDuplicate ? null : data;
      })
      .filter(
        (item): item is { link: string; label: string; order: number } =>
          item !== null && !!item.link && !!item.label
      ); // nly include valid, non-duplicate items

    if (createData.length > 0) {
      const success = await createLinks(createData);
      if (!success) allSuccess = false;
    }

    if (allSuccess) {
      // Fetch updated data first.
      socialLinksRef.value = (event.value?.socialLinks || []).map((l, idx) => ({
        ...l,
        key: l.id ?? String(idx),
      }));

      // Close modal after data is updated.
      handleCloseModal();
    }
  } finally {
    // Always reset submitting flag.
    isSubmitting.value = false;
  }
}
</script>
