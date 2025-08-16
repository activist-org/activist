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
import type { OrganizationSocialLink } from "~/types/communities/organization";
import type { SocialLink } from "~/types/content/social-link";

const modalName = "ModalSocialLinksOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

type SocialLinkWithKey = (OrganizationSocialLink | SocialLink) & {
  __key: string;
};
const socialLinksRef = ref<SocialLinkWithKey[]>();

let { organization } = organizationStore;
socialLinksRef.value = (organization.socialLinks || []).map((l, idx) => ({
  ...l,
  __key: l.id ?? String(idx),
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

// Reactive key to force form reset when dragging
const formKey = ref(0);

interface SocialLinksValue {
  socialLinks: { link: string; label: string }[];
}

// Handle updates from FormSocialLink (dragging, removing, adding)
function updateSocialLinksRef(updatedList: SocialLinkItem[]) {
  const oldLength = socialLinksRef.value?.length || 0;
  const newLength = updatedList.length;
  const isAddOperation = newLength > oldLength;

  socialLinksRef.value = updatedList as SocialLinkWithKey[];

  // Only reset form for drag/remove operations, not for add operations
  if (!isAddOperation) {
    formKey.value++;
  }
}

// Attn: Currently we're deleting the social links and rewriting all of them.
async function handleSubmit(values: unknown) {
  const socialLinks = socialLinksRef.value?.map((socialLink, index) => {
    const formLink = (values as SocialLinksValue).socialLinks[index];
    return {
      id: socialLink.id,
      // Use form values if they exist in the form, otherwise use socialLink values
      link: formLink ? formLink.link : socialLink.link,
      label: formLink ? formLink.label : socialLink.label,
      order: socialLink.order,
    };
  });

  let updateResponse = false;
  if (socialLinks) {
    updateResponse = await organizationStore.deleteSocialLinks(organization);
    updateResponse = await organizationStore.createSocialLinks(
      organization,
      socialLinks as SocialLink[]
    );
  }

  if (updateResponse) {
    handleCloseModal();

    await organizationStore.fetchById(orgId);
    organization = organizationStore.organization;
    socialLinksRef.value = (organization.socialLinks || []).map((l, idx) => ({
      ...l,
      __key: l.id ?? String(idx),
    }));
  }
}
</script>
