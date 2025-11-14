<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-10 py-5">
    <h3 class="text-left font-display">
      {{ title }}
    </h3>
    <div class="flex flex-row py-3">
      <div
        v-for="organization in availableOrganizations"
        class="mr-5 fill-primary-text"
      >
        <Icon
          v-if="organization?.iconUrl === undefined"
          name="IconOrganization"
          size="3em"
        />
        <div v-else class="rounded border border-section-div">
          <img
            :alt="
              $t('i18n._global.entity_logo', {
                entity_name: organization?.name,
              })
            "
            class="h-full w-12"
            :src="organization?.iconUrl?.fileObject"
          />
        </div>
      </div>
    </div>
    <div class="flex">
      <BtnAction
        @click="$emit('up-vote')"
        ariaLabel="i18n.components._global.upvote_application_aria_label"
        class="mr-5 flex"
        :counter="upVotes"
        :cta="true"
        :disabled="isVotingDisabled"
        fontSize="sm"
        iconSize="1.25em"
        :leftIcon="IconMap.ARROW_UP"
      />
      <BtnAction
        @click="$emit('down-vote')"
        ariaLabel="i18n.components.card_org_application_vote.downvote_application_aria_label"
        class="flex"
        :counter="downVotes"
        :cta="true"
        :disabled="isVotingDisabled"
        fontSize="sm"
        iconSize="1.25em"
        :leftIcon="IconMap.ARROW_DOWN"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

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
