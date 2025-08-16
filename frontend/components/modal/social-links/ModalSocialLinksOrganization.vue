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
import type { OrganizationSocialLink } from "~/types/communities/organization";
import type { SocialLink } from "~/types/content/social-link";

const modalName = "ModalSocialLinksOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

let { organization } = organizationStore;

const socialLinksRef = ref<OrganizationSocialLink[] | SocialLink[]>();

socialLinksRef.value = organization.socialLinks;

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
    socialLinksRef.value = organization.socialLinks;
  }
}
</script>
