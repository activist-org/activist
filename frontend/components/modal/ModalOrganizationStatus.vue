<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div class="max-h-[80vh] px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <h2 class="font-bold">
          {{
            $t(
              "i18n.components.modal_organization_status.organization_application",
              {
                organization_name: organization.name,
              }
            )
          }}
        </h2>
      </DialogTitle>
      <h4 class="pt-2 text-accepted-green dark:text-accepted-green">
        {{ $t("i18n.components.modal_organization_status.status_accepted") }}
      </h4>
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
import type { Organization } from "~/types/communities/organization";
import type { DiscussionEntry } from "~/types/content/discussion";

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
