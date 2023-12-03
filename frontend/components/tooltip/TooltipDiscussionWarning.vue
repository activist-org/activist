<template>
  <TooltipBase
    :text="$t('components.tooltip-discussion-warning.text')"
    class="w-fit right-0"
  >
    <ul class="list-disc pl-6 space-y-1 w-96">
      <li>{{ $t("components.tooltip-discussion-warning.names") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.home-addresses") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.phone-numbers") }}</li>
      <li>{{ $t("components.tooltip-discussion-warning.email-addresses") }}</li>
    </ul>
  </TooltipBase>
</template>
