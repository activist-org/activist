<template>
  <TooltipBase
    header="Restricted content"
    :text="$t('components.tooltip_sign_in.text')"
  >
    <div class="grid w-max grid-cols-1 gap-4 md:grid-cols-2">
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign_in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn_route_internal.sign_in_aria_label')"
      />
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign_up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn_route_internal.sign_up_aria_label')"
      />
    </div>
  </TooltipBase>
</template>
