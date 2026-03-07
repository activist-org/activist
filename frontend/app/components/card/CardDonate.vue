<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex flex-col space-y-3 px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="text-left font-display">
        {{ $t("i18n.components.card_donate.donate") }}
      </h3>
      <button
        v-if="userIsAdmin"
        @click="toggleEditMode"
        :aria-label="
          editModeEnabled
            ? $t(
                'i18n.components.card_donate.cancel_edit_donation_info_alt_text'
              )
            : $t('i18n.components.card_donate.edit_donation_info_alt_text')
        "
        class="cursor-pointer break-all rounded-lg p-1 text-primary-text transition-all focus-brand hover:text-distinct-text"
        type="button"
      >
        <Icon v-if="!editModeEnabled" :name="IconMap.EDIT" size="1.2em" />
        <Icon v-else :name="IconMap.X_LG" size="1.2em" />
      </button>
    </div>
    <p v-if="donationPrompt">
      {{ donationPrompt }}
    </p>
    <p v-else>
      {{ $t("i18n.components.card_donate.template_text") }}
    </p>
    <BtnRouteExternal
      ariaLabel="i18n.components.card_donate.go_to_donation_page_aria_label"
      class="flex"
      :cta="true"
      fontSize="sm"
      iconSize="1.25em"
      label="i18n.components.card_donate.donate"
      linkTo="/"
      :rightIcon="IconMap.EXTERNAL_LINK"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  userIsAdmin: boolean;
  donationPrompt?: string;
}>();

const editModeEnabled = ref(false);
const toggleEditMode = () => {
  editModeEnabled.value = !editModeEnabled.value;
};
</script>
