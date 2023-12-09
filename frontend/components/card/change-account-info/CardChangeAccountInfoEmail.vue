<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card-change-account-info.email.header-cta')"
    :ctaAriaLabel="
      $t('components.card-change-account-info.email.cta-aria-label')
    "
  >
    <div class="pb-1 space-y-4">
      <div class="flex items-center space-x-4">
        <h3 class="font-bold responsive-h3">
          {{ $t("components.card-change-account-info.email.header-cta") }}
        </h3>
      </div>
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="old-email" class="font-bold responsive-h4"
            >{{
              $t("components.card-change-account-info.email.old-email")
            }}
            *</label
          >
          <input
            id="old-email"
            class="peer border border-light-text rounded-sm bg-transparent py-1 px-3 dark:border-dark-text"
            :placeholder="
              $t('components.card-change-account-info.email.enter-old-email')
            "
          />
        </div>
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="new-email" class="font-bold responsive-h4"
            >{{
              $t("components.card-change-account-info.email.new-email")
            }}
            *</label
          >
          <input
            id="new-email"
            class="peer border border-light-text rounded-sm bg-transparent py-1 px-3 dark:border-dark-text"
            :placeholder="
              $t('components.card-change-account-info.email.enter-new-email')
            "
          />
        </div>
        <div class="flex flex-col w-full lg:w-1/3">
          <label for="password" class="font-bold responsive-h4"
            >{{ $t("components._global.enter-password") }} *</label
          >
          <input
            id="password"
            class="peer border border-light-text rounded-sm bg-transparent py-1 px-3 dark:border-dark-text"
            :placeholder="$t('components._global.enter-password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
