<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardChangeAccountInfo
    :ctaLabel="
      $t('i18n.components.card_change_account_info_username.header_cta')
    "
    :ctaAriaLabel="
      $t('i18n.components.card_change_account_info_username.cta_aria_label')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{
            $t("i18n.components.card_change_account_info_username.header_cta")
          }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/2">
          <label for="new-username" class="responsive-h4 font-bold">
            {{
              $t(
                "i18n.components.card_change_account_info_username.new_username"
              )
            }}
            *
          </label>
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
          <label for="password" class="responsive-h4 font-bold">
            {{ $t("i18n._global.enter_password") }} *
          </label>
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
