<template>
  <div
    class="flex w-full flex-col items-center justify-center space-y-10 sm:pt-2 lg:pt-4"
  >
    <span class="responsive-h3">{{
      $t("pages.auth.index.where-to-start")
    }}</span>
    <div
      class="grid w-full max-w-[60%] grid-cols-1 grid-rows-2 gap-y-4 sm:max-w-[50%] md:max-w-[60%] xl:max-w-[50%]"
    >
      <BtnRouteInternal
        class="w-full"
        label="_global.sign-up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        ariaLabel="_global.auth.sign-up-aria-label"
      />
      <BtnRouteInternal
        class="w-full"
        label="_global.sign-in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        ariaLabel="_global.auth.sign-in-aria-label"
      />
    </div>
  </div>
</template>
