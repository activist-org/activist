<template>
  <button
    class="flex items-center w-fit justify-center 2xl:space-x-10 xl:space-x-8 lg:space-x-4 md:space-x-4 lg:col-span-5 md:col-span-2 px-3 rounded border border-light-section-div dark:border-dark-section-div text-sm h-[48px] md:h-[40px] elem-shadow-sm"
    type="button"
    aria-label="test"
  >
    <span class="flex items-center space-x-4 whitespace-nowrap">
      <Icon name="bi:shield-fill-check" size="28px" />
      <span class="font-bold text-[18px] hidden lg:inline-block">{{
        $t("components.friendly-captcha.i-am-human")
      }}</span>
    </span>
    <span class="text-[12px] hidden lg:inline-block truncate">{{
      $t("components.friendly-captcha.label")
    }}</span>
  </button>
</template>
