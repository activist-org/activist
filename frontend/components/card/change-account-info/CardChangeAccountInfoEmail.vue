<template>
  <CardChangeAccountInfo
    :ctaLabel="$t('components.card-change-account-info.email.header-cta')"
    :ctaAriaLabel="
      $t('components.card-change-account-info.email.cta-aria-label')
    "
  >
    <div class="space-y-4 pb-1">
      <div class="flex items-center space-x-4">
        <h3 class="responsive-h3 font-bold">
          {{ $t("components.card-change-account-info.email.header-cta") }}
        </h3>
      </div>
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="old-email" class="responsive-h4 font-bold"
            >{{
              $t("components.card-change-account-info.email.old-email")
            }}
            *</label
          >
          <input
            id="old-email"
            class="border-light-text dark:border-dark-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="
              $t('components.card-change-account-info.email.enter-old-email')
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="new-email" class="responsive-h4 font-bold"
            >{{
              $t("components.card-change-account-info.email.new-email")
            }}
            *</label
          >
          <input
            id="new-email"
            class="border-light-text dark:border-dark-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="
              $t('components.card-change-account-info.email.enter-new-email')
            "
          />
        </div>
        <div class="flex w-full flex-col lg:w-1/3">
          <label for="password" class="responsive-h4 font-bold"
            >{{ $t("components._global.enter-password") }} *</label
          >
          <input
            id="password"
            class="border-light-text dark:border-dark-text peer rounded-sm border bg-transparent px-3 py-1"
            :placeholder="$t('components._global.enter-password')"
          />
        </div>
      </div>
    </div>
  </CardChangeAccountInfo>
</template>
