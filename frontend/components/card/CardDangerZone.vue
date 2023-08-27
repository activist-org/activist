<template>
  <div
    class="px-6 py-5 border bg-light-act-red/30 dark:bg-dark-act-red/30 border-light-act-red dark:border-dark-act-red card-style-base text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col gap-5">
      <h3
        class="font-bold text-left text-light-act-red dark:text-dark-act-red responsive-h3 font-display"
      >
        {{ $t("components.card.card-danger-zone.title") }}
      </h3>
      <p class="">{{ description }}</p>
      <form method="post">
        <div
          class="grid justify-between grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8"
        >
          <div class="flex flex-col gap-2">
            <label
              for="username"
              class="font-bold text-light-text dark:text-dark-text responsive-h4"
              :placeholder="$t('components.card.card-danger-zone.placeholder-username')"
              >{{ $t("components.card.card-danger-zone.label-username") }} *</label
            >
            <input
              id="username"
              class="px-3 py-1 bg-transparent border rounded-md border-light-text dark:border-dark-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              for="password"
              class="font-bold text-light-text dark:text-dark-text responsive-h4"
              :placeholder="$t('components.card.card-danger-zone.placeholder-password')"
              >{{ $t("components.card.card-danger-zone.label-password") }} *</label
            >
            <input
              id="password"
              type="password"
              class="px-3 py-1 bg-transparent border rounded-md border-light-text dark:border-dark-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            aria-label="Delete account"
            type="button"
            class="w-auto px-3 py-2 rounded-md text-light-distinct dark:text-dark-distinct bg-light-text dark:bg-dark-text hover:bg-light-act-red dark:hover:bg-dark-act-red"
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
}>();
</script>
