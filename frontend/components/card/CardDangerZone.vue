<template>
  <div
    class="card-style-base text-primary-text border-action-red bg-action-red/30 dark:bg-action-red/20 border px-5 py-5"
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
              class="responsive-h4 text-primary-text font-bold"
              for="username"
              :placeholder="
                $t('components.card_danger_zone.username_placeholder')
              "
            >
              {{ $t("components.card_danger_zone.username_label") }} *
            </label>
            <input
              id="username"
              class="border-primary-text focus:ring-primary-text rounded-md border bg-transparent px-3 py-1 focus:outline-none focus:ring-1"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="responsive-h4 text-primary-text font-bold"
              for="password"
              :placeholder="$t('_global.enter_password')"
            >
              {{ $t("components.card_danger_zone.password_label") }} *
            </label>
            <input
              id="password"
              class="border-primary-text focus:ring-primary-text rounded-md border bg-transparent px-3 py-1 focus:outline-none focus:ring-1"
              type="password"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            class="text-layer-1 hover:bg-action-red bg-primary-text w-auto rounded-md px-3 py-2"
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
