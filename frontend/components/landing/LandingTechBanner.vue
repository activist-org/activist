<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex w-full flex-col items-center justify-center space-y-3 bg-layer-1 py-8 text-primary-text sm:py-12 md:py-16 lg:py-24 xl:space-y-4 xl:py-28"
  >
    <h2
      class="w-10/12 text-center text-2xl font-semibold sm:w-full sm:text-3xl xl:text-4xl"
    >
      {{ $t("components.landing_tech_banner.open_header") }}
    </h2>
    <p
      class="text-transform: w-10/12 text-center text-base uppercase tracking-wider text-distinct-text sm:w-full sm:text-lg xl:text-xl"
    >
      {{ $t("components.landing_tech_banner.open_source_tagline") }}
    </p>
    <p
      class="w-10/12 pb-2 text-center text-sm sm:max-w-lg sm:text-base md:text-lg lg:max-w-xl"
    >
      {{ $t("components.landing_tech_banner.open_source_text") }}
    </p>
    <GridGitHubShields />
  </div>
</template>
