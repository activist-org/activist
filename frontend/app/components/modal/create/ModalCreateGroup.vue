<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <h2>{{ $t("i18n.components.modal_create_group.create_new_group") }}</h2>
    <Machine
      @close="handleCloseModal"
      :machine-type="MachineCreateType.CreateGroup"
      :options="flowOptions"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalCreateGroup";
const { handleCloseModal } = useModalHandlers(modalName);
const router = useRouter();
const route = useRoute();

const { create } = useGroupMutations();

/**
 * This function will be called by the machine when the flow completes.
 * @param {any} finalData The consolidated data from all steps.
 */
async function handleSubmission(value: unknown) {
  const result = await create(value as CreateGroupInput);

  const organizationId = route.params.id as string;

  await router.push(
    `/organizations/${organizationId}/groups/${result.id}/about`
  );

  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
