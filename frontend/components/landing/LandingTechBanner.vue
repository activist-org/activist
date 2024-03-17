<template>
  <div
    class="flex flex-col items-center justify-center w-full py-8 space-y-3 xl:space-y-4 sm:py-12 md:py-16 lg:py-24 xl:py-28 text-light-text dark:text-dark-text bg-light-layer-1 dark:bg-dark-layer-1"
  >
    <h2
      class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full xl:text-4xl"
    >
      {{ $t("components.landing-tech-banner.open-source-header") }}
    </h2>
    <p
      class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full xl:text-xl text-transform: text-light-distinct-text dark:text-dark-distinct-text"
    >
      {{ $t("components.landing-tech-banner.open-source-tagline") }}
    </p>
    <p
      class="w-10/12 pb-2 text-sm text-center sm:text-base sm:max-w-lg lg:max-w-xl"
    >
      {{ $t("components.landing-tech-banner.open-source-text") }}
    </p>
    <GridGitHubShields />
  </div>
</template>
