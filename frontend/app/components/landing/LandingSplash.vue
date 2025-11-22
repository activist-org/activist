<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="2xl:pb-18 w-full flex-1 space-y-4 bg-layer-1 pb-8 pt-10 sm:space-y-9 sm:pb-10 sm:pt-12 md:pb-12 md:pt-16 lg:pb-14 lg:pt-20 xl:space-y-10 xl:pb-16 xl:pt-24 2xl:pt-28"
  >
    <div class="flex justify-center">
      <h1
        id="landing-splash-header"
        class="w-10/12 text-center font-display text-3xl font-bold leading-snug sm:text-4xl sm:leading-snug md:max-w-lg md:text-5xl md:leading-snug lg:font-bold xl:max-w-2xl xl:text-6xl xl:leading-snug"
      >
        {{ $t("i18n.components.landing_splash.header") }}
      </h1>
    </div>
    <div class="flex justify-center">
      <div class="w-10/12 text-center">
        <div v-if="aboveMediumBP" class="block flex-col space-y-1 xl:space-y-2">
          <h4>{{ $t("i18n.components.landing_splash.message_1") }}</h4>
          <h4>{{ $t("i18n.components.landing_splash.message_2") }}</h4>
        </div>
        <h4 v-else>
          {{ $t("i18n.components.landing_splash.message_1") }}&nbsp;{{
            $t("i18n.components.landing_splash.message_2")
          }}
        </h4>
      </div>
    </div>
    <div class="flex justify-center rounded-md">
      <div v-if="devMode.active" class="style-btns-next-to-one-another">
        <BtnRouteInternal
          id="view-organizations"
          ariaLabel="i18n.components.landing_splash.view_organizations_aria_label"
          class="w-full"
          :cta="true"
          fontSize="xl"
          label="i18n.components.landing_splash.view_organizations"
          linkTo="/organizations"
        />
        <BtnRouteInternal
          id="view-events"
          ariaLabel="i18n.components.landing_splash.view_events_aria_label"
          class="w-full"
          :cta="true"
          fontSize="xl"
          label="i18n.components.landing_splash.view_events"
          linkTo="/events"
        />
      </div>
      <BtnRouteExternal
        id="request-access"
        v-else
        ariaLabel="i18n.components.landing_splash.request_access_aria_label"
        :cta="true"
        fontSize="xl"
        label="i18n.components.landing_splash.request_access"
        :linkTo="REQUEST_ACCESS_URL"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");
const devMode = useDevMode();
devMode.check();
</script>
