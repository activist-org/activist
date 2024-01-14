<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card-change-account-info.password.header-cta')"
    :ctaAriaLabel="
      $t('components.card-change-account-info.password.cta-aria-label')
    "
  >
    <div class="pb-1 space-y-4 lg:grow">
      <div class="flex items-center space-x-4">
        <h3 class="font-bold responsive-h3">
          {{ $t("components.card-change-account-info.password.header-cta") }}
        </h3>
      </div>
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="current-password" class="pb-2 font-bold responsive-h4"
            >{{
              $t(
                "components.card-change-account-info.password.current-password"
              )
            }}
            *</label
          >
          <input
            id="current-password"
            class="px-3 py-1 bg-transparent border rounded-sm peer border-light-text dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.password.enter-current-password'
              )
            "
          />
        </div>
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="new-password" class="pb-2 font-bold responsive-h4"
            >{{
              $t("components.card-change-account-info.password.new-password")
            }}
            *</label
          >
          <input
            id="password"
            class="px-3 py-1 bg-transparent border rounded-sm peer border-light-text dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.password.enter-new-password'
              )
            "
          />
        </div>
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="repeat-password" class="pb-2 font-bold responsive-h4"
            >{{ $t("_global.repeat-password") }} *</label
          >
          <input
            id="confirm-password"
            class="px-3 py-1 bg-transparent border rounded-sm peer border-light-text dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.password.enter-repeat-password'
              )
            "
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
