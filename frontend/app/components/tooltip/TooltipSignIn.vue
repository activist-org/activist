<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase
    header="Restricted content"
    :text="$t('i18n.components.tooltip_sign_in.text')"
  >
    <div class="grid w-max grid-cols-1 gap-4 md:grid-cols-2">
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="i18n._global.sign_in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        ariaLabel="i18n._global.sign_in_aria_label"
      />
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="i18n._global.sign_up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        ariaLabel="i18n._global.sign_up_aria_label"
      />
    </div>
  </TooltipBase>
</template>
