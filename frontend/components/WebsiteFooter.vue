<template>
  <footer
    class="py-16 mx-auto px-14 bg-light-header-bg dark:bg-dark-header-bg text-light-text dark:text-dark-text"
  >
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex h-8">
          <LogosActivist />
        </div>
        <p class="max-w-md mt-3 text-med">
          Free, open-source activism network.
        </p>
        <div class="grid max-w-xs grid-cols-11 mt-5 text-med">
          <div class="col-span-5 hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath('/legal/trademark-policy')">
              Trademark Policy
            </NuxtLink>
          </div>
          <div class="col-span-1 ml-[-16px]">•</div>
          <div
            class="col-span-5 ml-[-28px] hover:text-black dark:hover:text-white"
          >
            <NuxtLink :to="localePath('/legal/privacy-policy')">
              Privacy Policy
            </NuxtLink>
          </div>
        </div>
        <p class="max-w-md mt-2 text-med">Copyright © 2023 activist.</p>
      </div>
      <div class="grid max-w-2xl grid-cols-3 gap-24">
        <div>
          <p class="text-xl">Connect</p>
          <a
            href="https://github.com/activist-org/activist"
            class="flex items-center mt-3 space-x-2 text-med hover:text-black dark:hover:text-white"
          >
            <Icon name="bi:github" size="1em" />
            <p>@activist-org</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 space-x-2 text-med hover:text-black dark:hover:text-white"
          >
            <Icon name="bi:twitter" size="1em" />
            <p>@activist_org</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 space-x-2 text-med hover:text-black dark:hover:text-white"
          >
            <Icon name="bi:instagram" size="1em" />
            <p>@activist_org</p>
          </a>
        </div>
        <div>
          <p class="text-xl">Resources</p>
          <p class="mt-3 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath({ name: 'help' })"> Help </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath({ name: 'docs' })">
              Documentation
            </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath('/help/contact')"> Contact </NuxtLink>
          </p>
        </div>
        <div>
          <p class="text-xl">Organization</p>
          <p class="mt-3 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath({ name: 'about' })"> About </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath({ name: 'supporters' })">
              Supporters
            </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-black dark:hover:text-white">
            <NuxtLink :to="localePath({ name: 'impress' })"> Impress </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
