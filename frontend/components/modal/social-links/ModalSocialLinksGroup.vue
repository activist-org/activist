<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormSocialLink
      @addLink="addNewLink"
      @removeLink="removeLink"
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
      :title="title"
      :socialLinksRef="socialLinksRef || []"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { GroupSocialLink } from "~/types/communities/group";
import type { SocialLink } from "~/types/content/social-link";

const modalName = "ModalSocialLinksGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const socialLinksRef = ref<GroupSocialLink[] | SocialLink[]>();

let { group } = groupStore;
socialLinksRef.value = group.socialLinks;

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink) => ({
    label: socialLink.label,
    link: socialLink.link,
    order: socialLink.order,
    id: socialLink.id,
  })),
}));

const submitLabel = "i18n.components.modal.social_links._global.update_links";
const title = "i18n.components.modal.social_links._global.social_links";

interface SocialLinksValue {
  socialLinks: { link: string; label: string }[];
}

// Attn: Currently we're deleting the social links and rewriting all of them.
async function handleSubmit(values: unknown) {
  const socialLinks = socialLinksRef.value?.map((socialLink, _index) => ({
    id: socialLink.id,
    link: (values as SocialLinksValue).socialLinks[_index].link,
    label: (values as SocialLinksValue).socialLinks[_index].label,
    order: socialLink.order,
  }));

  let updateResponse = false;
  if (socialLinks) {
    updateResponse = await groupStore.deleteSocialLinks(group);
    updateResponse = await groupStore.createSocialLinks(
      group,
      socialLinks as SocialLink[]
    );
  }

  if (updateResponse) {
    handleCloseModal();

    await groupStore.fetchById(groupId);
    group = groupStore.group;
    socialLinksRef.value = group.socialLinks;
  }
}

async function addNewLink(newLink: {
  link: string;
  label: string;
  order: number;
}) {
  socialLinksRef.value?.push({
    ...newLink,
    id: "",
  } as GroupSocialLink & SocialLink);
}

async function removeLink(order: number): Promise<void> {
  const indexToRemove = socialLinksRef.value?.findIndex(
    (link) => link.order === order
  );

  if (indexToRemove !== undefined && indexToRemove >= 0) {
    // Remove the item directly from the array.
    // This will mutate the original array and signal a reactivity update.
    socialLinksRef.value?.splice(indexToRemove, 1);

    // Re-index the remaining items to ensure the 'order' field is correct.
    socialLinksRef.value?.forEach((link, index) => {
      link.order = index;
    });
  }
}
</script>
