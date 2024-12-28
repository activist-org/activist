<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div class="max-h-[80vh] px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ organization.name }}'s Application
        </p>
      </DialogTitle>
      <p
        class="responsive-h4 pt-2 text-accepted-green dark:text-accepted-green"
      >
        {{ $t("components.modal_organization_status.status_accepted") }}
      </p>
      <div class="space-y-6 py-6">
        <CardOrgApplicationVote
          title="Votes in favor"
          :isVotingDisabled="true"
          :organizations="modalOrganizationStatusData!.organizationsInFavor"
          :upVotes="modalOrganizationStatusData!.upVotes"
          :downVotes="modalOrganizationStatusData!.downVotes"
        />
        <Discussion
          :discussionEntries="modalOrganizationStatusData!.discussionEntries"
          :organization="organization"
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/content/discussion";
import type { Organization } from "~/types/entities/organization";

const props = defineProps<{
  organization: Organization;
  isOpen: boolean;
}>();

const modals = useModals();
const modalName = "ModalOrganizationStatus";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};

const modalOrganizationStatusData = inject<{
  discussionEntries: DiscussionEntry[];
  organizationsInFavor: Organization[];
  upVotes: number;
  downVotes: number;
}>("modalOrganizationStatusData");
</script>
