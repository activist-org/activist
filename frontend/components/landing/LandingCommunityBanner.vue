<template>
  <div
    class="flex flex-col w-full space-y-1 sm:space-y-2 xl:space-y-4 responsive-py-4 bg-light-highlight dark:bg-dark-highlight text-light-distinct-text dark:text-dark-distinct-text"
  >
    <div
      class="flex justify-center text-lg space-x-12 sm:space-x-8 xl:space-x-12 xl:text-xl"
    >
      <a
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://github.com/activist-org/activist"
        target="_blank"
        :aria-label="$t('components._global.github')"
      >
        <Icon name="simple-icons:github" size="1.1em" />
        <p class="sr-only sm:not-sr-only">
          {{ $t("components._global.github") }}
        </p>
      </a>
      <a
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://matrix.to/#/#activist_community:matrix.org"
        target="_blank"
        :aria-label="$t('components._global.matrix')"
      >
        <Icon name="IconMatrix" size="1.061em" />
        <p class="sr-only sm:not-sr-only">
          {{ $t("components._global.matrix") }}
        </p>
      </a>
      <a
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://instagram.com/activist_org"
        target="_blank"
        :aria-label="$t('components._global.instagram')"
      >
        <Icon name="simple-icons:instagram" size="1em" />
        <p class="sr-only sm:not-sr-only">
          {{ $t("components._global.instagram") }}
        </p>
      </a>
    </div>
  </div>
</template>
