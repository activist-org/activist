<template>
  <div
    class="flex flex-col w-full py-6 space-y-4 bg-light-highlight dark:bg-dark-highlight text-light-special-text dark:text-dark-special-text"
  >
    <p class="text-xl font-semibold text-center text-light-text dark:text-dark-text">{{ $t("join-our-community") }}</p>
    <div class="flex text-xl justify-center space-x-12 text-med">
      <a
        href="https://github.com/activist-org/activist"
        class="flex space-x-3 items-center hover:text-light-text dark:hover:text-dark-text"
      >
        <Icon name="bi:github" size="1em" />
        <p>GitHub</p>
      </a>
      <a
        href="https://twitter.com/activist_org"
        class="flex space-x-3 items-center hover:text-light-text dark:hover:text-dark-text"
      >
        <Icon name="bi:twitter" size="1em" />
        <p>Twitter</p>
      </a>
      <a
        href="https://instagram.com/activist_org"
        class="flex space-x-3 items-center hover:text-light-text dark:hover:text-dark-text"
      >
        <Icon name="bi:instagram" size="1em" />
        <p>Instagram</p>
      </a>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
