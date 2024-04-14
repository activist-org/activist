<template>
  <div class="card-style px-10 py-5">
    <h3 class="responsive-h3 text-left font-display">{{ title }}</h3>
    <div class="flex flex-row py-3">
      <div
        v-for="organization in availableOrganizations"
        class="mr-5 fill-light-text dark:fill-dark-text"
      >
        <Icon
          v-if="organization.imageURL === undefined"
          name="IconOrganization"
          size="3em"
        />
        <div
          v-else
          class="rounded border border-light-section-div dark:border-dark-section-div"
        >
          <img
            :src="organization.imageURL"
            class="h-full w-12"
            :alt="
              $t('components._global.entity-logo', {
                entity_name: organization.name,
              })
            "
          />
        </div>
      </div>
    </div>
    <div class="flex">
      <BtnAction
        @click="$emit('up-vote')"
        class="mr-5 flex"
        :cta="true"
        :counter="upVotes"
        fontSize="sm"
        leftIcon="bi:arrow-up"
        iconSize="1.25em"
        ariaLabel="components.btn-action.upvote-application-aria-label"
        :disabled="isVotingDisabled"
      />
      <BtnAction
        @click="$emit('down-vote')"
        class="flex"
        :cta="true"
        :counter="downVotes"
        fontSize="sm"
        leftIcon="bi:arrow-down"
        iconSize="1.25em"
        ariaLabel="components.btn-action.downvote-application-aria-label"
        :disabled="isVotingDisabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/organization";

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

  /**
   * The up votes count.
   */
  upVotes: number;

  /**
   * The down votes count.
   */
  downVotes: number;
}

/**
 * The available component events.
 */
export interface Emits {
  /**
   * The up vote casted event.
   */
  (event: "up-vote"): void;

  /**
   * The down vote casted event.
   */
  (event: "down-vote"): void;
}

defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  isVotingDisabled: true,
});

const maximumCountOrganizations = 10;
const availableOrganizations = computed(() =>
  props.organizations.slice(0, maximumCountOrganizations)
);
</script>
