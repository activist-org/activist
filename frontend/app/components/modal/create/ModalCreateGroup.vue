<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <h2>{{ t("i18n.components.modal_create_group.create_new_group") }}</h2>
    <Machine
      @close="handleCloseModal"
      :machine-type="createGroup"
      :options="flowOptions"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const { t } = useI18n();

const modalName = "ModalCreateGroup";
const { handleCloseModal } = useModalHandlers(modalName);
const createGroup = MachineCreateType.CreateGroup;
const router = useRouter();

const { create } = useGroupMutations({
  create: {
    onSuccess: (data: unknown) => {
      router.push(
        `/organizations/${(data as Group).org.id}/groups/${(data as Group).id}/about`
      );
    },
  },
});

/**
 * This function will be called by the machine when the flow completes.
 * @param {any} finalData The consolidated data from all steps.
 */
async function handleSubmission(value: unknown) {
  create(value as CreateGroupInput);
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
