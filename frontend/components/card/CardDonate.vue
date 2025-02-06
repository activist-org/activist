<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex flex-col space-y-3 px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t(i18nMap.components.card_donate.donate) }}
      </h3>
      <div
        class="cursor-pointer break-all rounded-lg p-1 text-primary-text transition-all hover:text-distinct-text"
      >
        <Icon
          v-if="userIsAdmin && !editModeEnabled"
          @click="toggleEditMode"
          :name="IconMap.EDIT"
          size="1.2em"
        />
        <Icon
          v-else-if="userIsAdmin && editModeEnabled"
          @click="toggleEditMode"
          :name="IconMap.X_LG"
          size="1.2em"
        />
      </div>
    </div>
    <p v-if="donationPrompt">{{ donationPrompt }}</p>
    <p v-else>
      {{ $t(i18nMap.components.card_donate.template_text) }}
    </p>
    <BtnRouteExternal
      class="flex"
      :cta="true"
      linkTo="/"
      :label="i18nMap.components.card_donate.donate"
      fontSize="sm"
      :rightIcon="IconMap.EXTERNAL_LINK"
      iconSize="1.25em"
      :ariaLabel="i18nMap.components.card_donate.go_to_donation_page_aria_label"
    />
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

defineProps<{
  userIsAdmin: boolean;
  donationPrompt?: string;
}>();

const editModeEnabled = ref(false);
const toggleEditMode = () => {
  editModeEnabled.value = !editModeEnabled.value;
};
</script>
