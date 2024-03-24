<template>
  <ModalBase>
    <template #normalDisplay>
      <div class="has-tooltip w-5 cursor-pointer sm:w-6 md:w-7 xl:w-9">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            class="fill-light-accepted-green dark:fill-dark-accepted-green"
            d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417L5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
          />
          <path
            class="fill-light-accepted-green/40 dark:fill-dark-accepted-green/40"
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417L5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
          />
          <path
            class="fill-light-accepted-green dark:fill-dark-accepted-green"
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
        </svg>
        <TooltipBase
          class="invisible -ml-36 mt-3 max-w-96"
          :text="
            $t(
              'components.modal-organization-status.approved-tooltip-hover-text',
              {
                org_name: organization.name,
                year: new Date().toISOString().slice(0, 10),
                num_supporters: 6,
              },
            )
          "
        />
      </div>
    </template>
    <template #modalDisplay>
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
            :discussionTexts="modalOrganizationStatusData!.discussionTexts"
            :organization="organization"
          />
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "~/components/modal/ModalBase.vue";
import type { DiscussionText } from "~/types/card-discussion-text";
import type { Organization } from "~/types/organization";

const modalOrganizationStatusData = inject<{
  discussionTexts: DiscussionText[];
  organizationsInFavor: Organization[];
  upVotes: number;
  downVotes: number;
}>("modalOrganizationStatusData");

defineProps<{
  organization: Organization;
}>();
</script>
