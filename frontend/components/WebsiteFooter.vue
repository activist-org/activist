<template>
  <footer
    class="responsive-px-4 responsive-py-4 bg-light-header dark:bg-dark-header text-light-special-text dark:text-dark-special-text"
  >
    <!-- Note: Content Sections Top -->
    <div class="flex flex-col items-center justify-center space-y-5 lg:hidden">
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="relative z-0 h-10 w-36">
          <LogosActivist
            class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
          />
        </div>
        <p class="text-light-text dark:text-dark-text">
          {{ $t("activist-tagline") }}
        </p>
        <div class="flex">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a
              href="https://github.com/activist-org/activist/releases"
              class="focus-brand"
            >
              v0.0.1
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a
              href="https://github.com/activist-org/activist"
              class="focus-brand"
            >
              {{ $t("source-code") }}
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/docs/roadmap')" class="focus-brand">
              {{ $t("roadmap") }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <div
        class="max-w-xl text-center grid gap-0 sm:text-left justify-items-center sm:grid-cols-3 sm:gap-12 md:gap-16 lg:hidden"
      >
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("connect") }}
          </p>
          <a
            href="https://github.com/activist-org/activist"
            class="flex items-center mt-3 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:github" size="1em" />
            <p>GitHub</p>
          </a>
          <a
            href="https://matrix.to/#/#activist_community:matrix.org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:matrix" size="1em" />
            <p>Matrix</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:twitter" size="1em" />
            <p>Twitter</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:instagram" size="1em" />
            <p>Instagram</p>
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
            <NuxtLink :to="localePath('/help/faq')" class="focus-brand">
              {{ $t("faq") }}
            </NuxtLink>
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
            <NuxtLink
              :to="localePath({ name: 'supporters' })"
              class="focus-brand"
            >
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

      <div class="flex flex-col items-center justify-center">
        <div class="flex">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              :to="localePath('/legal/trademark-policy')"
              class="focus-brand"
            >
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              :to="localePath('/legal/privacy-policy')"
              class="focus-brand"
            >
              {{ $t("privacy-policy") }}
            </NuxtLink>
          </div>
        </div>
        <div class="mt-2 text-light-text dark:text-dark-text">
          {{ $t("website-copyright") }}
        </div>
      </div>
    </div>

    <!-- Note: Content Sections Left and Right -->
    <div class="flex flex-col justify-center lg:flex-row lg:justify-start">
      <!-- Note: Content Sections Left -->
      <div class="mt-0 justify-items-start w-[70%] hidden lg:flex lg:flex-col">
        <div class="relative z-0 h-10 w-36">
          <LogosActivist
            class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
          />
        </div>
        <p class="mt-3 text-light-text dark:text-dark-text lg:block">
          {{ $t("activist-tagline") }}
        </p>
        <div class="flex justify-start mt-2">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a
              href="https://github.com/activist-org/activist/releases"
              class="focus-brand"
            >
              v0.0.1
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a
              href="https://github.com/activist-org/activist"
              class="focus-brand"
            >
              {{ $t("source-code") }}
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/docs/roadmap')" class="focus-brand">
              {{ $t("roadmap") }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex mt-5">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              :to="localePath('/legal/trademark-policy')"
              class="focus-brand"
            >
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              :to="localePath('/legal/privacy-policy')"
              class="focus-brand"
            >
              {{ $t("privacy-policy") }}
            </NuxtLink>
          </div>
        </div>
        <div class="mt-2 text-light-text dark:text-dark-text">
          {{ $t("website-copyright") }}
        </div>
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
            <Icon name="cib:github" size="1em" />
            <p>GitHub</p>
          </a>
          <a
            href="https://matrix.to/#/#activist_community:matrix.org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:matrix" size="1em" />
            <p>Matrix</p>
          </a>
          <a
            href="https://twitter.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:twitter" size="1em" />
            <p>Twitter</p>
          </a>
          <a
            href="https://instagram.com/activist_org"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
          >
            <Icon name="cib:instagram" size="1em" />
            <p>Instagram</p>
          </a>
        </div>
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("resources") }}
          </p>
          <p
            class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text"
          >
            <NuxtLink :to="localePath('/help/faq')" class="focus-brand">
              {{ $t("faq") }}
            </NuxtLink>
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
            <NuxtLink
              :to="localePath({ name: 'supporters' })"
              class="focus-brand"
            >
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
