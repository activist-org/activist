<script setup lang="ts">
import { i18nMap } from '~/types/i18n-map';

</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase
    header="Restricted content"
    :text="$t(i18nMap.components.tooltip_sign_in.text)"
  >
    <div class="grid w-max grid-cols-1 gap-4 md:grid-cols-2">
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign_in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t(i18nMap._global.sign_in_aria_label)"
      />
      <BtnRouteInternal
        class="flex max-h-[40px] items-center justify-center truncate"
        label="_global.sign_up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t(i18nMap._global.sign_up_aria_label)"
      />
    </div>
  </TooltipBase>
</template>
