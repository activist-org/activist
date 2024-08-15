<template>
  <div class="card-style flex flex-col space-y-3 px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.donate") }}
      </h3>
      <div
        class="cursor-pointer break-all rounded-lg p-1 text-light-text transition-all hover:text-light-distinct-text dark:text-dark-text dark:hover:text-dark-distinct-text"
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
      {{ $t("components.card_donate.template_text") }}
    </p>
    <BtnRouteExternal
      class="flex"
      :cta="true"
      linkTo="/"
      label="components._global.donate"
      fontSize="sm"
      :rightIcon="IconMap.EXTERNAL_LINK"
      iconSize="1.25em"
      ariaLabel="components.btn_route_external.go_to_donation_page_aria_label"
    />
  </div>
</template>

<script setup lang="ts">
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
