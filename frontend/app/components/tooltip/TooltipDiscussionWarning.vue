<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase
    class="w-fit md:right-0"
    :text="$t('i18n.components.tooltip_discussion_warning.text')"
  >
    <ul class="w-72 list-disc space-y-1 pl-6 text-left md:w-96">
      <li>{{ $t("i18n.components.tooltip_discussion_warning.names") }}</li>
      <li>
        {{ $t("i18n.components.tooltip_discussion_warning.home_addresses") }}
      </li>
      <li>
        {{ $t("i18n.components.tooltip_discussion_warning.phone_numbers") }}
      </li>
      <li>
        {{ $t("i18n.components.tooltip_discussion_warning.email_addresses") }}
      </li>
    </ul>
  </TooltipBase>
</template>
