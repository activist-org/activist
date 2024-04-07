<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-1 dark:bg-dark-layer-1 flex w-full flex-col items-center justify-center space-y-3 py-8 sm:py-12 md:py-16 lg:py-24 xl:space-y-4 xl:py-28"
  >
    <h2
      class="w-10/12 text-center text-2xl font-semibold sm:w-full sm:text-3xl xl:text-4xl"
    >
      {{ $t("components.landing-tech-banner.open-source-header") }}
    </h2>
    <p
      class="text-transform: text-light-distinct-text dark:text-dark-distinct-text w-10/12 text-center text-base uppercase tracking-wider sm:w-full sm:text-lg xl:text-xl"
    >
      {{ $t("components.landing-tech-banner.open-source-tagline") }}
    </p>
    <p
      class="w-10/12 pb-2 text-center text-sm sm:max-w-lg sm:text-base lg:max-w-xl"
    >
      {{ $t("components.landing-tech-banner.open-source-text") }}
    </p>
    <GridGitHubShields />
  </div>
</template>
