<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex w-full flex-col items-center justify-center space-y-10 sm:pt-2 lg:pt-4"
  >
    <h3>{{ $t("i18n.pages.auth.index.where_to_start") }}</h3>
    <div
      class="grid w-full max-w-[60%] grid-cols-1 grid-rows-2 gap-y-4 sm:max-w-[50%] md:max-w-[60%] xl:max-w-[50%]"
    >
      <BtnRouteInternal
        ariaLabel="i18n._global.sign_up_aria_label"
        class="w-full"
        :cta="true"
        fontSize="lg"
        label="i18n._global.sign_up"
        linkTo="/auth/sign-up"
      />
      <BtnRouteInternal
        ariaLabel="i18n._global.sign_in_aria_label"
        class="w-full"
        :cta="true"
        fontSize="lg"
        label="i18n._global.sign_in"
        linkTo="/auth/sign-in"
      />
    </div>
  </div>
</template>
