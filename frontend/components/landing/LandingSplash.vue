<template>
  <div
    class="2xl:pb-18 w-full flex-1 space-y-4 bg-light-layer-1 pb-8 pt-10 text-light-text dark:bg-dark-layer-1 dark:text-dark-text sm:space-y-9 sm:pb-10 sm:pt-12 md:pb-12 md:pt-16 lg:pb-14 lg:pt-20 xl:space-y-10 xl:pb-16 xl:pt-24 2xl:pt-28"
  >
    <div class="flex justify-center">
      <h1
        id="landing-splash-header"
        class="w-10/12 text-center font-display text-3xl font-bold leading-snug sm:text-4xl sm:leading-snug md:max-w-lg md:text-5xl md:leading-snug lg:font-bold xl:max-w-2xl xl:text-6xl xl:leading-snug"
      >
        {{ $t("components.landing-splash.header") }}
      </h1>
    </div>
    <div class="flex justify-center">
      <div
        class="w-10/12 text-center text-base sm:text-xl md:w-3/4 md:text-lg xl:text-2xl"
      >
        <div v-if="aboveMediumBP" class="block flex-col space-y-1 xl:space-y-2">
          <p>{{ $t("components.landing-splash.message-1") }}</p>
          <p>{{ $t("components.landing-splash.message-2") }}</p>
        </div>
        <p v-else>
          {{ $t("components.landing-splash.message-1") }}&nbsp;{{
            $t("components.landing-splash.message-2")
          }}
        </p>
      </div>
    </div>
    <div class="flex justify-center rounded-md">
      <BtnRouteExternal
        id="request-access"
        :cta="true"
        label="components.btn-route-external.request-access"
        :linkTo="REQUEST_ACCESS_URL"
        fontSize="xl"
        ariaLabel="components.btn-route-external.request-access-aria-label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useBreakpoint from "~/composables/useBreakpoint";

const aboveMediumBP = useBreakpoint("md");
</script>
