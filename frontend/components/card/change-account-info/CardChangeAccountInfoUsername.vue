<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card_change_account_info.username.header_cta')"
    :ctaAriaLabel="
      $t('components.card_change_account_info.username.cta_aria_label')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card_change_account_info.username.header_cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/2">
          <label for="new-username" class="responsive-h4 font-bold"
            >{{
              $t("components.card_change_account_info.username.new_username")
            }}
            *</label
          >
          <input
            id="new-username"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card_change_account_info.username.enter_new_username'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/2">
          <label for="password" class="responsive-h4 font-bold"
            >{{ $t("components._global.enter_password") }} *</label
          >
          <input
            id="password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="$t('components._global.enter_password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
