<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardChangeAccountInfo
    :ctaLabel="
      $t('i18n.components.card_change_account_info_password.header_cta')
    "
    :ctaAriaLabel="
      $t('i18n.components.card_change_account_info_password.cta_aria_label')
    "
  >
    <div class="space-y-4 pb-1 lg:grow">
      <div class="flex items-center space-x-4">
        <h3 class="font-bold">
          {{
            $t("i18n.components.card_change_account_info_password.header_cta")
          }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <h4 for="current-password" class="pb-2 font-bold">
            {{
              $t(
                "i18n.components.card_change_account_info_password.current_password"
              )
            }}
            *
          </h4>
          <input
            id="current-password"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(
                'i18n.components.card_change_account_info_password.enter_current_password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <h4 for="new-password" class="pb-2 font-bold">
            {{
              $t(
                "i18n.components.card_change_account_info_password.new_password"
              )
            }}
            *
          </h4>
          <input
            id="password"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(
                'i18n.components.card_change_account_info_password.enter_new_password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <h4 for="repeat-password" class="pb-2 font-bold">
            {{ $t("i18n._global.repeat_password") }} *
          </h4>
          <input
            id="confirm-password"
            class="peer rounded-sm border border-primary-text bg-transparent px-3 py-1"
            :placeholder="
              $t(
                'i18n.components.card_change_account_info_password.enter_repeat_password'
              )
            "
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
