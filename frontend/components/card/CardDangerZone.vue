<template>
  <div
    class="px-5 py-5 border bg-light-act-red/30 dark:bg-dark-act-red/20 border-light-act-red dark:border-dark-act-red card-style-base text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col gap-5">
      <h3 class="font-bold text-left responsive-h3 font-display">
        {{ $t("components.card-danger-zone.header") }}
      </h3>
      <p>{{ description }}</p>
      <form method="post">
        <div
          class="justify-between grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8"
        >
          <div class="flex flex-col gap-2">
            <label
              class="font-bold text-light-text dark:text-dark-text responsive-h4"
              for="username"
              :placeholder="
                $t('components.card-danger-zone.username-placeholder')
              "
            >
              {{ $t("components.card-danger-zone.username-label") }} *
            </label>
            <input
              class="px-3 py-1 bg-transparent border rounded-md border-light-text dark:border-dark-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              id="username"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="font-bold text-light-text dark:text-dark-text responsive-h4"
              for="password"
              :placeholder="
                $t('components.card-danger-zone.password-placeholder')
              "
            >
              {{ $t("components.card-danger-zone.password-label") }} *
            </label>
            <input
              class="px-3 py-1 bg-transparent border rounded-md border-light-text dark:border-dark-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              id="password"
              type="password"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            class="w-auto px-3 py-2 rounded-md text-light-distinct dark:text-dark-distinct bg-light-text dark:bg-dark-text hover:bg-light-act-red dark:hover:bg-dark-act-red"
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
  ctaBtnText: { type: string; required: true };
  ctaBtnAriaLabel: string;
}>();
</script>
