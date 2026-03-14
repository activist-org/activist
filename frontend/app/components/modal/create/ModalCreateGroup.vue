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

const { create } = useGroupMutations();

const router = useRouter();

async function handleSubmission(value: unknown) {
  const payload = value as CreateGroupInput;

  const result = await create(payload); 
  if (!result) return;

  const groupId = result.id;

  const organizationId = payload.organization;

  await router.push(`/organizations/${organizationId}/groups/${groupId}/about`);

  handleCloseModal();

}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
