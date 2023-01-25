<template>
  <footer
    class="py-16 mx-auto px-14 bg-light-header dark:bg-dark-header text-light-special-text dark:text-dark-special-text"
  >
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex h-8">
          <LogosActivist />
        </div>
        <p class="max-w-md mt-3 text-med">
          {{ $t("activist-tagline") }}
        </p>
        <div class="grid max-w-xs grid-cols-11 mt-5 text-med">
          <div class="col-span-5 hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/trademark-policy')">
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div class="col-span-1 ml-[-16px]">•</div>
          <div
            class="col-span-5 ml-[-28px] hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/legal/privacy-policy')">
              {{ $t("privacy-policy") }}
            </NuxtLink>
          </div>
        </div>
        <p class="max-w-md mt-2 text-med">{{ $t("website-copyright") }}</p>
      </div>
      <div class="grid max-w-2xl grid-cols-3 gap-24">
        <div>
          <p class="text-xl text-light-text dark:text-dark-text">{{ $t("connect") }}</p>
          <a
            href="https://github.com/activist-org/activist"
            class="flex items-center mt-3 space-x-2 text-med hover:text-light-text dark:hover:text-dark-text"
          >
            <Icon name="bi:github" size="1em" />
            <p>@activist-org</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 space-x-2 text-med hover:text-light-text dark:hover:text-dark-text"
          >
            <Icon name="bi:twitter" size="1em" />
            <p>@activist_org</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 space-x-2 text-med hover:text-light-text dark:hover:text-dark-text"
          >
            <Icon name="bi:instagram" size="1em" />
            <p>@activist_org</p>
          </a>
        </div>
        <div>
          <p class="text-xl text-light-text dark:text-dark-text">{{ $t("resources") }}</p>
          <p class="mt-3 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'help' })"> {{ $t("help") }} </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'docs' })">
              {{ $t("documentation") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/help/contact')"> {{ $t("contact") }} </NuxtLink>
          </p>
        </div>
        <div>
          <p class="text-xl text-light-text dark:text-dark-text">{{ $t("organization") }}</p>
          <p class="mt-3 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'about' })"> {{ $t("about") }} </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'supporters' })">
              {{ $t("supporters") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'impress' })"> {{ $t("impress") }} </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
