<template>
  <div class="card-style py-10 px-5">
    <h3 class="text-left responsive-h3 font-display"> {{ title }} </h3>
    <div class="py-3 flex flex-row">
      <div
        v-for="organization in organizations"
        class="mr-5"
      >
      <Icon
        v-if="organization.imageURL === undefined"
        name="IconOrganization"
        size="1.25em"
      />
      <img
        v-else
        :src="organization.imageURL"
      />
      </div>
    </div>
    <div class="flex">
      <BtnLabeled
        class="flex mr-5"
        :cta="true"
        :label="`${upVotes}`"
        fontSize="sm"
        leftIcon="bi:arrow-up"
        iconSize="1.25em"
        ariaLabel="components.btn-labeled.upvote-application-aria-label"
        @click="upVotes++"
        :disabled="isVotingDisabled"
      />
      <BtnLabeled
        class="flex"
        :cta="true"
        :label="`${downVotes}`"
        fontSize="sm"
        leftIcon="bi:arrow-down"
        iconSize="1.25em"
        ariaLabel="components.btn-labeled.downvote-application-aria-label"
        @click="downVotes++"
        :disabled="isVotingDisabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Organization } from '~/types/organization';

/**
 * The component public properties.
 */
export interface Props {
  /**
   * The card title.
   */
  title: string;

  /**
   * The organizations in favor.
   */
  organizations: Organization[];

  /**
   * Indicates whether the voting should be disabled or not.
   */
  isVotingDisabled?: boolean;
}

// TODO: for testing purpose.
const upVotes = ref(123);
const downVotes = ref(123);

withDefaults(defineProps<Props>(), {
  'isVotingDisabled': true
});
</script>