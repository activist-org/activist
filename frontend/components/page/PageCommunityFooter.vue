<template>
  <div class="flex-col">
    <p class="font-bold responsive-h4">
      {{ $t("components.page-community-footer.invite-text-1") }}
    </p>
    <ul class="pl-4 list-disc pt-3 space-y-1 pb-1">
      <li>
        {{ $t("components.page-community-footer.invite-text-2-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("components.page-community-footer.invite-text-2-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page-community-footer.invite-text-2-3") }}
      </li>
      <li>
        {{ $t("components.page-community-footer.invite-text-3-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("_global.public-matrix-chat-rooms") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page-community-footer.invite-text-3-3") }}
      </li>
      <li>
        {{ $t("_global.visit-our") }}
        <a
          class="items-center focus-brand link-text"
          href="https://explore.transifex.com/activist-org/activist/"
          target="_blank"
        >
          {{ $t("components.page-community-footer.invite-text-4-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page-community-footer.invite-text-4-3") }}
      </li>
    </ul>
  </div>
  <div
    class="grid grid-cols-1 max-w-[70%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[80%] gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 mx-auto sm:mx-0 sm:grid-cols-2 sm:grid-rows-1"
  >
    <!-- Slot is formatted to accept buttons for the bottom of the page. -->
    <slot />
  </div>
</template>
