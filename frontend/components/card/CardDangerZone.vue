<template>
  <div
    class="bg-light-action-red/30 dark:bg-dark-action-red/20 border-light-action-red dark:border-dark-action-red card-style-base text-light-text dark:text-dark-text border px-5 py-5"
  >
    <div class="flex flex-col gap-5">
      <h3 class="responsive-h3 font-display text-left font-bold">
        {{ $t("components.card-danger-zone.header") }}
      </h3>
      <p>{{ description }}</p>
      <form method="post">
        <div
          class="grid grid-cols-1 justify-between gap-4 sm:grid-cols-2 sm:gap-8"
        >
          <div class="flex flex-col gap-2">
            <label
              class="text-light-text dark:text-dark-text responsive-h4 font-bold"
              for="username"
              :placeholder="
                $t('components.card-danger-zone.username-placeholder')
              "
            >
              {{ $t("components.card-danger-zone.username-label") }} *
            </label>
            <input
              id="username"
              class="border-light-text dark:border-dark-text rounded-md border bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="text-light-text dark:text-dark-text responsive-h4 font-bold"
              for="password"
              :placeholder="$t('components._global.enter-password')"
            >
              {{ $t("components.card-danger-zone.password-label") }} *
            </label>
            <input
              id="password"
              class="border-light-text dark:border-dark-text rounded-md border bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              type="password"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            class="text-light-layer-1 dark:text-dark-layer-1 bg-light-text dark:bg-dark-text hover:bg-light-action-red dark:hover:bg-dark-action-red w-auto rounded-md px-3 py-2"
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
