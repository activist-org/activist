<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card_change_account_info_password.header_cta')"
    :ctaAriaLabel="
      $t('components.card_change_account_info_password.cta_aria_label')
    "
  >
    <div class="space-y-4 pb-1 lg:grow">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card_change_account_info_password.header_cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="current-password" class="responsive-h4 pb-2 font-bold"
            >{{
              $t(
                "components.card_change_account_info_password.current_password"
              )
            }}
            *</label
          >
          <input
            id="current-password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card_change_account_info_password.enter_current_password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="new-password" class="responsive-h4 pb-2 font-bold"
            >{{
              $t("components.card_change_account_info_password.new_password")
            }}
            *</label
          >
          <input
            id="password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card_change_account_info_password.enter_new_password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="repeat-password" class="responsive-h4 pb-2 font-bold"
            >{{ $t("_global.repeat_password") }} *</label
          >
          <input
            id="confirm-password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card_change_account_info_password.enter_repeat_password'
              )
            "
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
