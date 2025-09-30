<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormSocialLink
      @updateList="updateSocialLinksRef"
      :key="formKey"
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
      :socialLinksRef="socialLinksRef || []"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { SocialLinkItem } from "~/components/form/FormSocialLink.vue";
import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

const modalName = "ModalSocialLinksEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();
await eventStore.fetchById(eventId);

type SocialLinkWithKey = (EventSocialLink | SocialLink) & { key: string };
const socialLinksRef = ref<SocialLinkWithKey[]>();

let { event } = eventStore;
socialLinksRef.value = (event.socialLinks || []).map((l, idx) => ({
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

// Handle updates from FormSocialLink (dragging, removing, adding).
function updateSocialLinksRef(updatedList: SocialLinkItem[]) {
  const oldLength = socialLinksRef.value?.length || 0;
  const newLength = updatedList.length;
  const isAddOperation = newLength > oldLength;
  const isRemoveOperation = newLength < oldLength;

  socialLinksRef.value = updatedList as SocialLinkWithKey[];

  // Only reset form for drag operations (same length), not for add/remove
  // Removing formKey increment on deletions prevents race condition during submission
  if (!isAddOperation && !isRemoveOperation) {
    formKey.value++;
  }
}

// Attn: Currently we're deleting the social links and rewriting all of them.
async function handleSubmit(values: unknown) {
  // Use socialLinksRef length as the authoritative count
  // Only process as many form values as we have items in socialLinksRef
  const formValues = (
    values as { socialLinks: { link: string; label: string }[] }
  ).socialLinks;

  // Build social links array, but ONLY for items that exist in socialLinksRef
  // This prevents recreating deleted items if form hasn't caught up
  const socialLinks = socialLinksRef.value?.map((refItem, index) => {
    const formLink = formValues?.[index];
    return {
      id: refItem.id,
      link: formLink?.link || refItem.link,
      label: formLink?.label || refItem.label,
      order: index,
    };
  });

  let updateResponse = false;
  if (socialLinks) {
    updateResponse = await eventStore.deleteSocialLinks(event);
    updateResponse = await eventStore.createSocialLinks(
      event,
      socialLinks as SocialLink[]
    );
  }

  if (updateResponse) {
    handleCloseModal();

    await eventStore.fetchById(eventId);
    event = eventStore.event;
    socialLinksRef.value = (event.socialLinks || []).map((l, idx) => ({
      ...l,
      key: l.id ?? String(idx),
    }));
  }
}
</script>
