<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormSocialLink
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
      :title="title"
      :socialLinksRef="socialLinksRef || []"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

const modalName = "ModalSocialLinksEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

let { event } = eventStore;

const socialLinksRef = ref<EventSocialLink[] | SocialLink[]>();

socialLinksRef.value = event.socialLinks;

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink) => ({
    label: socialLink.label,
    link: socialLink.link,
    order: socialLink.order,
    id: socialLink.id,
  })),
}));

const submitLabel = "i18n.components.modal.social_links._global.update_links";
const title = "i18n.components._global.social_links";

interface SocialLinksValue {
  socialLinks: { link: string; label: string }[];
}

// Attn: Currently we're deleting the social links and rewriting all of them.
async function handleSubmit(values: unknown) {
  const socialLinks = socialLinksRef.value?.map((socialLink, index) => ({
    id: socialLink.id,
    link: (values as SocialLinksValue).socialLinks[index].link,
    label: (values as SocialLinksValue).socialLinks[index].label,
    order: socialLink.order,
  }));

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
    socialLinksRef.value = event.socialLinks;
  }
}
</script>
