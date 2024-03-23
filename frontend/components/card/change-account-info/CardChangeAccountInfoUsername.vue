<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card-change-account-info.username.header-cta')"
    :ctaAriaLabel="
      $t('components.card-change-account-info.username.cta-aria-label')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card-change-account-info.username.header-cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/2">
          <label for="new-username" class="responsive-h4 font-bold"
            >{{
              $t("components.card-change-account-info.username.new-username")
            }}
            *</label
          >
          <input
            id="new-username"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="
              $t(
                'components.card-change-account-info.username.enter-new-username'
              )
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/2">
          <label for="password" class="responsive-h4 font-bold"
            >{{ $t("components._global.enter-password") }} *</label
          >
          <input
            id="password"
            class="peer rounded-sm border border-light-text bg-transparent px-3 py-1 dark:border-dark-text"
            :placeholder="$t('components._global.enter-password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
