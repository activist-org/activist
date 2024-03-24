<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card-change-account-info.password.header-cta')"
    :ctaAriaLabel="
      $t('components.card-change-account-info.password.cta-aria-label')
    "
  >
    <div class="space-y-4 pb-1 lg:grow">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card-change-account-info.password.header-cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="current-password" class="responsive-h4 pb-2 font-bold"
            >{{
              $t(
                "components.card-change-account-info.password.current-password"
              )
            }}
            *</label
          >
          <input
            id="current-password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.password.enter-current-password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="new-password" class="responsive-h4 pb-2 font-bold"
            >{{
              $t("components.card-change-account-info.password.new-password")
            }}
            *</label
          >
          <input
            id="password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.password.enter-new-password'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="repeat-password" class="responsive-h4 pb-2 font-bold"
            >{{ $t("_global.repeat-password") }} *</label
          >
          <input
            id="confirm-password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
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
