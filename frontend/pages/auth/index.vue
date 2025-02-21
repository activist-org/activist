<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex w-full flex-col items-center justify-center space-y-10 sm:pt-2 lg:pt-4"
  >
    <span class="responsive-h3">{{
      $t("i18n.pages.auth.index.where_to_start")
    }}</span>
    <div
      class="grid w-full max-w-[60%] grid-cols-1 grid-rows-2 gap-y-4 sm:max-w-[50%] md:max-w-[60%] xl:max-w-[50%]"
    >
      <BtnRouteInternal
        class="w-full"
        label="i18n._global.sign_up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        ariaLabel="i18n._global.auth.sign_up_aria_label"
      />
      <BtnRouteInternal
        class="w-full"
        label="i18n._global.sign_in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        ariaLabel="i18n._global.auth.sign_in_aria_label"
      />
    </div>
  </div>
</template>
