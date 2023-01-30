<template>
  <footer
    class="px-6 py-8 sm:py-12 lg:px-10 xl:py-16 xl:px-14 bg-light-header dark:bg-dark-header text-light-special-text dark:text-dark-special-text"
  >
    <div
      class="justify-center flex-1 sm:grid sm:grid-rows-2 lg:flex lg:justify-start"
    >
      <!-- Note: Content Sections Top -->
      <div
        class="max-w-xl text-center sm:text-left lg:hidden grid sm:grid-cols-3 gap-0 sm:gap-12 md:gap-16 justify-items-center"
      >
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("connect") }}
          </p>
          <a
            href="https://github.com/activist-org/activist"
            class="flex items-center mt-3 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:github" size="1em" />
            <p>@activist-org</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:twitter" size="1em" />
            <p>@activist_org</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:instagram" size="1em" />
            <p>@activist_org</p>
          </a>
        </div>
        <div>
          <p
            class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text"
          >
            {{ $t("resources") }}
          </p>
          <p
            class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/docs/faq')" class="focus-brand"> {{ $t("faq") }} </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'help' })" class="focus-brand">
              {{ $t("help") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'docs' })" class="focus-brand">
              {{ $t("documentation") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/help/contact')" class="focus-brand">
              {{ $t("contact") }}
            </NuxtLink>
          </p>
        </div>
        <div>
          <p
            class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text"
          >
            {{ $t("organization") }}
          </p>
          <p
            class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'about' })" class="focus-brand">
              {{ $t("about") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'supporters' })" class="focus-brand">
              {{ $t("supporters") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'impress' })" class="focus-brand">
              {{ $t("impress") }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Note: Content Sections Bottom or Left -->
      <div
        class="mt-6 md:mt-4 grid grid-rows-5 lg:mt-0 justify-items-center lg:justify-items-start lg:w-[60%]"
      >
        <div class="relative z-0 h-10 w-36">
          <LogosActivist
            class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
          />
        </div>
        <p class="mt-3 text-base">
          {{ $t("activist-tagline") }}
        </p>
        <div class="flex mt-3 xl:mt-5">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/trademark-policy')" class="focus-brand">
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/privacy-policy')" class="focus-brand">
              {{ $t("privacy-policy") }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex mt-2">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a href="https://github.com/activist-org/activist/releases" class="focus-brand">
              v0.0.1
            </a>
          </div>
          <div>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/docs/roadmap')" class="focus-brand">
              {{ $t("roadmap") }}
            </NuxtLink>
          </div>
        </div>
        <div>{{ $t("website-copyright") }}</div>
      </div>

      <!-- Note: Content Sections Right -->
      <div class="justify-end hidden w-full lg:flex lg:space-x-8 xl:space-x-24">
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("connect") }}
          </p>
          <a
            href="https://github.com/activist-org/activist"
            class="flex items-center mt-3 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:github" size="1em" />
            <p>@activist-org</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:twitter" size="1em" />
            <p>@activist_org</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="bi:instagram" size="1em" />
            <p>@activist_org</p>
          </a>
        </div>
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("resources") }}
          </p>
          <p
            class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/docs/faq')" class="focus-brand"> {{ $t("faq") }} </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'help' })" class="focus-brand">
              {{ $t("help") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'docs' })" class="focus-brand">
              {{ $t("documentation") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/help/contact')" class="focus-brand">
              {{ $t("contact") }}
            </NuxtLink>
          </p>
        </div>
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("organization") }}
          </p>
          <p
            class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'about' })" class="focus-brand">
              {{ $t("about") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'supporters' })" class="focus-brand">
              {{ $t("supporters") }}
            </NuxtLink>
          </p>
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath({ name: 'impress' })" class="focus-brand">
              {{ $t("impress") }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
