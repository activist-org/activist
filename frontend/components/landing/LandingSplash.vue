<template>
  <div
    class="bg-light-layer-1 dark:bg-dark-layer-1 text-light-text dark:text-dark-text 2xl:pb-18 w-full flex-1 space-y-4 pb-8 pt-10 sm:space-y-9 sm:pb-10 sm:pt-12 md:pb-12 md:pt-16 lg:pb-14 lg:pt-20 xl:space-y-10 xl:pb-16 xl:pt-24 2xl:pt-28"
  >
    <div class="flex justify-center">
      <h1
        class="font-display w-10/12 text-center text-3xl font-bold leading-snug sm:text-4xl sm:leading-snug md:max-w-lg md:text-5xl md:leading-snug lg:font-bold xl:max-w-2xl xl:text-6xl xl:leading-snug"
      >
        {{ $t("components.landing-splash.header") }}
      </h1>
    </div>
    <div class="flex justify-center">
      <p
        class="w-10/12 text-center text-base sm:text-xl md:max-w-lg md:text-lg xl:max-w-2xl xl:text-2xl"
      >
        {{ $t("components.landing-splash.message") }}
      </p>
    </div>
    <div class="flex justify-center rounded-md">
      <BtnRouteExternal
        :cta="true"
        label="components.btn-route-external.request-access"
        linkTo="https://tally.so/r/nprxbq"
        fontSize="xl"
        ariaLabel="components.btn-route-external.request-access-aria-label"
      />
    </div>
  </div>
</template>
