<script setup lang="ts">
import { i18nMap } from '~/types/i18n-map';

</script>

<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardChangeAccountInfo
    :ctaLabel="$t(i18nMap.components.card_change_account_info_email.header_cta)"
    :ctaAriaLabel="
      $t(i18nMap.components.card_change_account_info_email.cta_aria_label)
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t(i18nMap.components.card_change_account_info_email.header_cta) }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="old-email" class="responsive-h4 font-bold"
            >{{
              $t(i18nMap.components.card_change_account_info_email.old_email)
            }}
            *</label
          >
          <input
            id="old-email"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(i18nMap.components.card_change_account_info_email.enter_old_email)
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="new-email" class="responsive-h4 font-bold"
            >{{
              $t(i18nMap.components.card_change_account_info_email.new_email)
            }}
            *</label
          >
          <input
            id="new-email"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(i18nMap.components.card_change_account_info_email.enter_new_email)
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="password" class="responsive-h4 font-bold"
            >{{ $t(i18nMap._global.enter_password) }} *</label
          >
          <input
            id="password"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="$t(i18nMap._global.enter_password)"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
