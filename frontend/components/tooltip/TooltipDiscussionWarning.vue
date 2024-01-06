<template>
  <TooltipBase
    :text="$t('components.tooltip-discussion-warning.text')"
    class="w-fit md:right-0"
  >
    <ul class="pl-6 text-left list-disc space-y-1 w-72 md:w-96">
      <li>{{ $t("components.tooltip-discussion-warning.names") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.home-addresses") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.phone-numbers") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.email-addresses") }}</li>
    </ul>
  </TooltipBase>
</template>
