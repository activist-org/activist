<template>
  <div
    class="flex flex-col w-full space-y-1 sm:space-y-2 xl:space-y-4 responsive-py-4 bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
  >
    <div
      class="flex justify-center text-lg space-x-12 sm:space-x-8 xl:space-x-12 xl:text-xl"
    >
      <a
        href="https://github.com/activist-org/activist"
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
      >
        <Icon name="cib:github" size="1em" />
        <p class="sr-only sm:not-sr-only">GitHub</p>
      </a>
      <a
        href="https://matrix.to/#/#activist_community:matrix.org"
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
      >
        <Icon name="IconMatrix" size="1.061em" />
        <p class="sr-only sm:not-sr-only">Matrix</p>
      </a>
      <a
        href="https://twitter.com/activist_org"
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
      >
        <Icon name="cib:twitter" size="1em" />
        <p class="sr-only sm:not-sr-only">Twitter</p>
      </a>
      <a
        href="https://instagram.com/activist_org"
        class="flex items-center space-x-3 hover:text-light-text dark:hover:text-dark-text focus-brand"
      >
        <Icon name="cib:instagram" size="1em" />
        <p class="sr-only sm:not-sr-only">Instagram</p>
      </a>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
