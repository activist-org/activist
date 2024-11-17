<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card_change_account_info_email.header_cta')"
    :ctaAriaLabel="
      $t('components.card_change_account_info_email.cta_aria_label')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card_change_account_info_email.header_cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="old-email" class="responsive-h4 font-bold"
            >{{
              $t("components.card_change_account_info_email.old_email")
            }}
            *</label
          >
          <input
            id="old-email"
            class="border-primary-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="
              $t('components.card_change_account_info_email.enter_old_email')
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="new-email" class="responsive-h4 font-bold"
            >{{
              $t("components.card_change_account_info_email.new_email")
            }}
            *</label
          >
          <input
            id="new-email"
            class="border-primary-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="
              $t('components.card_change_account_info_email.enter_new_email')
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="password" class="responsive-h4 font-bold"
            >{{ $t("_global.enter_password") }} *</label
          >
          <input
            id="password"
            class="border-primary-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="$t('_global.enter_password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
