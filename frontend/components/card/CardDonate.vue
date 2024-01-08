<template>
  <div class="flex flex-col px-5 py-5 space-y-3 card-style">
    <div class="flex items-center gap-5">
      <h3 class="text-left responsive-h3 font-display">
        {{ $t("components.card-donate.header") }}
      </h3>
      <div
        class="p-1 break-all rounded-lg cursor-pointer transition-all hover:text-light-highlight dark:transition-all dark:hover:text-dark-highlight"
      >
        <Icon
          v-if="userIsAdmin && !editModeEnabled"
          @click="toggleEditMode"
          name="bi:pencil-square"
          size="1.2em"
        />
        <Icon
          v-else-if="userIsAdmin && editModeEnabled"
          @click="toggleEditMode"
          name="bi:x-lg"
          size="1.2em"
        />
      </div>
    </div>
    <p v-if="donationPrompt">{{ donationPrompt }}</p>
    <p v-else>
      {{ $t("components.card-donate.template-text") }}
    </p>
    <BtnLabeled
      class="flex"
      :cta="true"
      linkTo="/"
      label="components.btn-labeled.go-to-donation-page"
      fontSize="sm"
      rightIcon="bi:box-arrow-up-right"
      iconSize="1.25em"
      ariaLabel="components.btn-labeled.support-organization-aria-label"
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
