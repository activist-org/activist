<template>
  <ModalBase>
    <template #normalDisplay>
      <div class="w-5 sm:w-6 md:w-7 xl:w-9 has-tooltip cursor-pointer">
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
          class="invisible mt-3 -ml-36"
          :text="
            organization.name +
            ' joined activist on ' +
            // organization +
            ' based on the support of ' +
            organization.supporters +
            ' organizations already on activist. Click here to see their application.'
          "
        />
      </div>
    </template>
    <template #modalDisplay>
      <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2 max-h-[80vh]">
        <DialogTitle class="font-display">
          <p class="responsive-h2 font-bold">
            {{ organization.name }}'s Application
          </p>
        </DialogTitle>
        <div class="py-6 space-y-6">
          <h3 class="text-left responsive-h3 font-display">
            {{ $t("_global.discussion") }}
          </h3>
          <hr />
          <CardOrgApplicationVote
            title="Votes in favor"
            :is-voting-disabled="true"
            :organizations="modalOrganizationStatusData!.organizationsInFavor"
            :up-votes="modalOrganizationStatusData!.upVotes"
            :down-votes="modalOrganizationStatusData!.downVotes"
          />
          <CardDiscussionText
            :is-private="false"
            :discussion-texts="modalOrganizationStatusData!.discussionTexts"
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
