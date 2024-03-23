<template>
  <div
    class="responsive-py-4 flex w-full flex-col space-y-1 bg-light-highlight text-light-distinct-text dark:bg-dark-highlight dark:text-dark-distinct-text sm:space-y-2 xl:space-y-4"
  >
    <div
      class="flex justify-center space-x-12 text-lg sm:space-x-8 xl:space-x-12 xl:text-xl"
    >
      <a
        class="focus-brand hover:text-light-text dark:hover:text-dark-text"
        href="https://github.com/activist-org/activist"
        target="_blank"
        :aria-label="$t('components._global.github')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          iconName="simple-icons:github"
          :text="$t('components._global.github')"
          iconSize="1.1em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="focus-brand hover:text-light-text dark:hover:text-dark-text"
        href="https://matrix.to/#/#activist_community:matrix.org"
        target="_blank"
        :aria-label="$t('components._global.matrix')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          iconName="IconMatrix"
          :text="$t('components._global.matrix')"
          iconSize="1.061em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="focus-brand hover:text-light-text dark:hover:text-dark-text"
        href="https://instagram.com/activist_org"
        target="_blank"
        :aria-label="$t('components._global.instagram')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          iconName="simple-icons:instagram"
          :text="$t('components._global.instagram')"
          iconSize="1em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
    </div>
  </div>
</template>
