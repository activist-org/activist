<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardChangeAccountInfo
    :ctaAriaLabel="
      $t('i18n.components.card_change_account_info_username.cta_aria_label')
    "
    :ctaLabel="
      $t('i18n.components.card_change_account_info_username.header_cta')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="font-bold">
          {{
            $t("i18n.components.card_change_account_info_username.header_cta")
          }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/2">
          <h4 class="font-bold" for="new-username">
            {{
              $t(
                "i18n.components.card_change_account_info_username.new_username"
              )
            }}
            *
          </h4>
          <input
            id="new-username"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(
                'i18n.components.card_change_account_info_username.enter_new_username'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/2">
          <h4 class="font-bold" for="password">
            {{ $t("i18n._global.enter_password") }} *
          </h4>
          <input
            id="password"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="$t('i18n._global.enter_password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
