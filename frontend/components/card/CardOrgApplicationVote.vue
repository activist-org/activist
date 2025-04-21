<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-10 py-5">
    <h3 class="responsive-h3 text-left font-display">
      {{ title }}
    </h3>
    <div class="flex flex-row py-3">
      <div
        v-for="organization in availableOrganizations"
        class="mr-5 fill-primary-text"
      >
        <Icon
          v-if="organization.iconUrl === undefined"
          name="IconOrganization"
          size="3em"
        />
        <div v-else class="rounded border border-section-div">
          <img
            :src="organization.iconUrl.fileObject"
            class="h-full w-12"
            :alt="
              $t('i18n._global.entity_logo', {
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
        ariaLabel="i18n.components._global.upvote_application_aria_label"
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
        ariaLabel="i18n.components.card_org_application_vote.downvote_application_aria_label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

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
