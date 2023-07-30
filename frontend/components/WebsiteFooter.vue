<template>
  <footer
    class="responsive-px-5 responsive-py-5 bg-light-header dark:bg-dark-header text-light-special-text dark:text-dark-special-text">
    <!-- Note: Content Sections Top -->
    <div class="flex flex-col items-center justify-center space-y-5 lg:hidden">
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="relative z-0 h-10 w-36">
          <LogoActivist class="absolute inset-0 flex items-center justify-center z-1 overflow-clip" />
        </div>
        <p class="text-light-text dark:text-dark-text">
          {{ $t("activist-tagline") }}
        </p>
        <div class="flex flex-wrap items-center justify-center">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a href="https://github.com/activist-org/activist/releases" target="_blank" class="focus-brand">
              v0.0.1
            </a>
          </div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <span class="px-2 flex-inline">•</span>
            <a href="https://github.com/activist-org/activist" target="_blank" class="focus-brand">
              {{ $t("source-code") }}
            </a>
          </div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <span class="px-2 flex-inline">•</span>
            <NuxtLink :to="localePath('/about/roadmap')" class="focus-brand">
              {{ $t("roadmap") }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <div
        class="grid max-w-xl gap-0 text-center sm:text-left justify-items-center sm:grid-cols-3 sm:gap-12 md:gap-16 lg:hidden">
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("connect") }}
          </p>
          <div class="flex gap-10 mt-1 sm:mt-0 sm:flex-col sm:gap-0">
            <a href="https://github.com/activist-org/activist" target="_blank"
              class="flex items-center mt-2 space-x-2 text-base sm:mt-3 hover:text-light-text dark:hover:text-dark-text focus-brand">
              <Icon name="cib:github" class="text-2xl sm:text-base" />
              <p class="sr-only sm:not-sr-only">GitHub</p>
            </a>
            <a href="https://matrix.to/#/#activist_community:matrix.org" target="_blank"
              class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
              <Icon name="IconMatrix" class="text-2xl sm:text-base" />
              <p class="sr-only sm:not-sr-only">Matrix</p>
            </a>
            <a href="https://twitter.com/activist_org" target="_blank"
              class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
              <Icon name="cib:twitter" class="text-2xl sm:text-base" />
              <p class="sr-only sm:not-sr-only">Twitter</p>
            </a>
            <a href="https://instagram.com/activist_org" target="_blank"
              class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
              <Icon name="cib:instagram" class="text-2xl sm:text-base" />
              <p class="sr-only sm:not-sr-only">Instagram</p>
            </a>
          </div>
        </div>
        <div>
          <p class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text">
            {{ $t("resources") }}
          </p>
          <div class="flex flex-wrap justify-center sm:flex-col gap-x-1 sm:gap-0">
            <p class="mt-2 text-base sm:mt-3 hover:text-light-text dark:hover:text-dark-text">
              <NuxtLink :to="localePath('/help/faq')" class="focus-brand">
                {{ $t("faq") }}
              </NuxtLink>
            </p>
            <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
              <span class="px-2 flex-inline sm:hidden">•</span>
              <NuxtLink :to="localePath({ name: 'help' })" class="focus-brand">
                {{ $t("help") }}
              </NuxtLink>
            </p>
            <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
              <span class="px-2 flex-inline sm:hidden">•</span>
              <NuxtLink :to="localePath({ name: 'docs' })" class="focus-brand">
                {{ $t("documentation") }}
              </NuxtLink>
            </p>
            <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
              <span class="px-2 flex-inline sm:hidden">•</span>
              <NuxtLink :to="localePath('/help/contact')" class="focus-brand">
                {{ $t("contact") }}
              </NuxtLink>
            </p>
          </div>
        </div>
        <div>
          <p class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text">
            {{ $t("organization") }}
          </p>
          <div class="flex flex-wrap justify-center sm:flex-col gap-x-1 sm:gap-0">
            <p class="mt-2 text-base sm:mt-3 hover:text-light-text dark:hover:text-dark-text">
              <NuxtLink :to="localePath({ name: 'about' })" class="focus-brand">
                {{ $t("about") }}
              </NuxtLink>
            </p>
            <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
              <span class="px-2 flex-inline sm:hidden">•</span>
              <NuxtLink :to="localePath({ name: 'supporters' })" class="focus-brand">
                {{ $t("supporters") }}
              </NuxtLink>
            </p>
            <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
              <span class="px-2 flex-inline sm:hidden">•</span>
              <NuxtLink :to="localePath('/about/impress')" class="focus-brand">
                {{ $t("impress") }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-wrap items-center justify-center">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/trademark-policy')" class="focus-brand">
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <span class="px-2 flex-inline">•</span>
            <NuxtLink :to="localePath('/legal/privacy-policy')" class="focus-brand">
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
          <LogoActivist class="absolute inset-0 flex items-center justify-center z-1 overflow-clip" />
        </div>
        <p class="mt-3 text-light-text dark:text-dark-text lg:block">
          {{ $t("activist-tagline") }}
        </p>
        <div class="flex justify-start mt-2">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a href="https://github.com/activist-org/activist/releases" target="_blank" class="focus-brand">
              v0.0.1
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <a href="https://github.com/activist-org/activist" target="_blank" class="focus-brand">
              {{ $t("source-code") }}
            </a>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/about/roadmap')" class="focus-brand">
              {{ $t("roadmap") }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex mt-5">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/trademark-policy')" class="focus-brand">
              {{ $t("trademark-policy") }}
            </NuxtLink>
          </div>
          <div class="px-2">•</div>
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/legal/privacy-policy')" class="focus-brand">
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
          <a href="https://github.com/activist-org/activist" target="_blank"
            class="flex items-center mt-3 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
            <Icon name="cib:github" size="1em" />
            <p>GitHub</p>
          </a>
          <a href="https://matrix.to/#/#activist_community:matrix.org" target="_blank"
            class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
            <Icon name="IconMatrix" size="1.061em" />
            <p>Matrix</p>
          </a>
          <a href="https://twitter.com/activist_org" target="_blank"
            class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
            <Icon name="cib:twitter" size="1em" />
            <p>Twitter</p>
          </a>
          <a href="https://instagram.com/activist_org" target="_blank"
            class="flex items-center mt-2 space-x-2 text-base hover:text-light-text dark:hover:text-dark-text focus-brand">
            <Icon name="cib:instagram" size="1em" />
            <p>Instagram</p>
          </a>
        </div>
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("resources") }}
          </p>
          <p class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/help/faq')" class="focus-brand">
              {{ $t("faq") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'help' })" class="focus-brand">
              {{ $t("help") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'docs' })" class="focus-brand">
              {{ $t("documentation") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/help/contact')" class="focus-brand">
              {{ $t("contact") }}
            </NuxtLink>
          </p>
        </div>
        <div>
          <p class="text-xl font-medium text-light-text dark:text-dark-text">
            {{ $t("organization") }}
          </p>
          <p class="mt-3 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'about' })" class="focus-brand">
              {{ $t("about") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath({ name: 'supporters' })" class="focus-brand">
              {{ $t("supporters") }}
            </NuxtLink>
          </p>
          <p class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink :to="localePath('/about/impress')" class="focus-brand">
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
