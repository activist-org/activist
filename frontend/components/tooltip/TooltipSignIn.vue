<template>
  <TooltipBase
    header="Restricted content"
    :text="$t('components.tooltip-sign-in.text')"
  >
    <div class="grid w-max grid-cols-1 gap-4 md:grid-cols-2">
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign-in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn-route-internal.sign-in-aria-label')"
      />
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign-up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn-route-internal.sign-up-aria-label')"
      />
    </div>
  </TooltipBase>
</template>
