<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <div class="max-h-[80vh] px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ organization.name }}'s Application
        </p>
      </DialogTitle>
      <p
        class="responsive-h4 pt-2 text-light-accepted-green dark:text-dark-accepted-green"
      >
        {{ $t("components.modal-organization-status.status-accepted") }}
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

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};

const modalOrganizationStatusData = inject<{
  discussionEntries: DiscussionEntry[];
  organizationsInFavor: Organization[];
  upVotes: number;
  downVotes: number;
}>("modalOrganizationStatusData");
</script>
