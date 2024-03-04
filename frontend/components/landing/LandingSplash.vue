<template>
  <div
    class="flex-1 w-full pt-10 pb-8 space-y-4 bg-light-layer-1 dark:bg-dark-layer-1 text-light-text dark:text-dark-text sm:pt-12 sm:pb-10 md:pt-16 md:pb-12 lg:pb-14 lg:pt-20 xl:pt-24 xl:pb-16 2xl:pt-28 2xl:pb-18 sm:space-y-9 xl:space-y-10"
  >
    <div class="flex justify-center">
      <h1
        class="w-10/12 text-3xl font-bold leading-snug text-center lg:font-bold sm:text-4xl md:text-5xl xl:text-6xl md:max-w-lg xl:max-w-2xl sm:leading-snug md:leading-snug xl:leading-snug font-display"
      >
        {{ $t("components.landing-splash.header") }}
      </h1>
    </div>
    <div class="flex justify-center">
      <p
        class="w-10/12 text-base text-center md:text-lg md:max-w-lg sm:text-xl xl:max-w-2xl xl:text-2xl"
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
