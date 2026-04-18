<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormSocialLink
      :formData="formData"
      :handleSubmit="handleSubmit"
      :socialLinksRef="socialLinksRef || []"
      :submitLabel="submitLabel"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalSocialLinksOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrganizationId = useRoute().params.orgId;
const orgId =
  typeof paramsOrganizationId === "string" ? paramsOrganizationId : "";

const { data: organization } = useGetOrganization(orgId);
const { updateLink, createLinks, deleteLink } =
  useOrganizationSocialLinksMutations(orgId);

type SocialLinkWithKey = (OrganizationSocialLink | SocialLink) & {
  key: string;
};
const socialLinksRef = ref<SocialLinkWithKey[]>();

watch(
  () => organization.value?.socialLinks ?? [],
  (newVal) => {
    socialLinksRef.value = (newVal || []).map((l, idx) => ({
      ...l,
      key: l?.id ?? String(idx),
    }));
  },
  { immediate: true }
);

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink, index) => ({
    label: socialLink.label,
    link: socialLink.link,
    order: index,
    id: socialLink.id,
  })),
}));

const submitLabel = "i18n.components.modal.social_links._global.update_links";

/**
 * Handles the submission of the organization social links update form. This function takes the form values as input, processes them to determine which links need to be created, updated, or deleted, and then performs the necessary operations using the corresponding mutations. After all operations are completed, the modal is closed.
 * @param values The values from the organization social links update form, which include the link, label, and order for each social link. These values are used to update the organization's social links on the server when the form is submitted. The function processes these values and interacts with the createLinks, updateLink, and deleteLink mutations to perform the necessary operations.
 */
async function handleSubmit(values: unknown) {
  const formValues = (
    values as {
      socialLinks: {
        link: string;
        label: string;
        id?: string;
        order: number;
      }[];
    }
  ).socialLinks.map((socialLink, index) => ({
    link: socialLink.link,
    label: socialLink.label,
    id: socialLink.id ?? "",
    order: index,
  }));

  // Track existing IDs.
  const existingIds = [...(organization.value?.socialLinks || [])];

  // MARK: Delete

  const toDelete =
    existingIds.filter(
      (link) =>
        link.id && !formValues?.some((existing) => existing.id === link.id)
    ) ?? [];
  await Promise.all(toDelete.map((link) => deleteLink(link.id!)));

  // MARK: Update

  const toUpdate =
    formValues.filter(
      (link) =>
        link.id &&
        existingIds?.some(
          (existing) =>
            existing.id === link?.id &&
            (existing.link !== link.link ||
              existing.label !== link.label ||
              existing.order !== link.order)
        )
    ) || [];
  await Promise.all(
    toUpdate.map(async (refItem) => {
      await updateLink(refItem.id, {
        link: refItem.link,
        label: refItem.label,
        order: refItem.order,
      });
    })
  );

  // MARK: Create

  const toCreate = formValues?.filter((link) => link.id === "") || [];
  if (toCreate.length > 0) {
    await createLinks(
      toCreate.map((link) => ({
        link: link.link,
        label: link.label,
        order: link.order,
      }))
    );
  }

  // Close modal after data is updated.
  handleCloseModal();
}
</script>
