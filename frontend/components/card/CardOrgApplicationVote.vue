<template>
  <div class="card-style px-10 py-5">
    <h3 class="responsive-h3 text-left font-display">{{ title }}</h3>
    <div class="flex flex-row py-3">
      <div
        v-for="organization in availableOrganizations"
        class="fill-primary-text mr-5"
      >
        <Icon
          v-if="organization.iconUrl === undefined"
          name="IconOrganization"
          size="3em"
        />
        <div v-else class="border-section-div rounded border">
          <img
            :src="organization.iconUrl"
            class="h-full w-12"
            :alt="
              $t('_global.entity_logo', {
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
        :leftIcon="IconMap.ARROW_UP"
        iconSize="1.25em"
        :disabled="isVotingDisabled"
        ariaLabel="components._global.upvote_application_aria_label"
      />
      <BtnAction
        @click="$emit('down-vote')"
        class="flex"
        :cta="true"
        :counter="downVotes"
        fontSize="sm"
        :leftIcon="IconMap.ARROW_DOWN"
        iconSize="1.25em"
        :disabled="isVotingDisabled"
        ariaLabel="components.card_org_application_vote.downvote_application_aria_label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/entities/organization";
import { IconMap } from "~/types/icon-map";

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
   * The up and down vote casted events.
   */
  (event: "up-vote" | "down-vote"): void;
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
