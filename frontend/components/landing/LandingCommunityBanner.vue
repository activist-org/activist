<template>
  <div
    class="flex flex-col w-full space-y-1 sm:space-y-2 xl:space-y-4 responsive-py-4 bg-light-highlight dark:bg-dark-highlight text-light-distinct-text dark:text-dark-distinct-text"
  >
    <div
      class="flex justify-center text-lg space-x-12 sm:space-x-8 xl:space-x-12 xl:text-xl"
    >
      <a
        class="flex items-center space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://github.com/activist-org/activist"
        target="_blank"
      >
        <MetaTagSocialMedia
          iconName="simple-icons:github"
          :text="$t('components._global.github')"
          iconSize="1.1em"
          textStyleClass="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="flex items-center space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://matrix.to/#/#activist_community:matrix.org"
        target="_blank"
      >
        <MetaTagSocialMedia
          iconName="IconMatrix"
          :text="$t('components._global.matrix')"
          iconSize="1.061em"
          textStyleClass="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="flex items-center space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://instagram.com/activist_org"
        target="_blank"
      >
        <MetaTagSocialMedia
          iconName="simple-icons:instagram"
          :text="$t('components._global.instagram')"
          iconSize="1em"
          textStyleClass="sr-only sm:not-sr-only"
        />
      </a>
    </div>
  </div>
</template>
