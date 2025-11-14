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

const modalName = "ModalSocialLinksGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
const { updateLink, createLinks, deleteLink } =
  useGroupSocialLinksMutations(groupId);

type SocialLinkWithKey = (GroupSocialLink | SocialLink) & { key: string };
const socialLinksRef = ref<SocialLinkWithKey[]>();

watch(
  () => group.value?.socialLinks ?? [],
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
// Individual CRUD operations.
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
  const existingIds = [...(group.value?.socialLinks || [])];

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
