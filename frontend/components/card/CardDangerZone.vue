<template>
  <div
    class="card-style-base border border-light-action-red bg-light-action-red/30 px-5 py-5 text-light-text dark:border-dark-action-red dark:bg-dark-action-red/20 dark:text-dark-text"
  >
    <div class="flex flex-col gap-5">
      <h3 class="responsive-h3 text-left font-display font-bold">
        {{ $t("components.card_danger_zone.header") }}
      </h3>
      <p>{{ description }}</p>
      <form method="post">
        <div
          class="grid grid-cols-1 justify-between gap-4 sm:grid-cols-2 sm:gap-8"
        >
          <div class="flex flex-col gap-2">
            <label
              class="responsive-h4 font-bold text-light-text dark:text-dark-text"
              for="username"
              :placeholder="
                $t('components.card_danger_zone.username_placeholder')
              "
            >
              {{ $t("components.card_danger_zone.username_label") }} *
            </label>
            <input
              id="username"
              class="rounded-md border border-light-text bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black dark:border-dark-text dark:focus:ring-white"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="responsive-h4 font-bold text-light-text dark:text-dark-text"
              for="password"
              :placeholder="$t('components._global.enter_password')"
            >
              {{ $t("components.card_danger_zone.password_label") }} *
            </label>
            <input
              id="password"
              class="rounded-md border border-light-text bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black dark:border-dark-text dark:focus:ring-white"
              type="password"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            class="w-auto rounded-md bg-light-text px-3 py-2 text-light-layer-1 hover:bg-light-action-red dark:bg-dark-text dark:text-dark-layer-1 dark:hover:bg-dark-action-red"
            type="button"
            :aria-label="ctaBtnAriaLabel"
          >
            {{ ctaBtnText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description: string;
  ctaBtnText: string;
  ctaBtnAriaLabel: string;
}>();
</script>
