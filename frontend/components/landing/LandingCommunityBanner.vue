<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="responsive-py-4 flex w-full flex-col space-y-1 bg-highlight text-distinct-text sm:space-y-2 xl:space-y-4"
  >
    <div
      class="flex justify-center space-x-12 text-lg sm:space-x-8 xl:space-x-12 xl:text-xl"
    >
      <a
        class="focus-brand hover:text-primary-text"
        href="https://github.com/activist-org/activist"
        target="_blank"
        :aria-label="$t('i18n.components._global.github')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          :iconName="IconMap.GITHUB"
          :text="$t('i18n.components._global.github')"
          iconSize="1.1em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="focus-brand hover:text-primary-text"
        href="https://matrix.to/#/#activist_community:matrix.org"
        target="_blank"
        :aria-label="$t('i18n.components._global.matrix')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          :iconName="IconMap.MATRIX"
          :text="$t('i18n.components._global.matrix')"
          iconSize="1.061em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
      <a
        class="focus-brand hover:text-primary-text"
        href="https://instagram.com/activist_org"
        target="_blank"
        :aria-label="$t('i18n.components._global.instagram')"
      >
        <MetaTagSocialMedia
          class="!gap-2"
          :iconName="IconMap.INSTAGRAM"
          :text="$t('i18n.components._global.instagram')"
          iconSize="1em"
          textUtilityClasses="sr-only sm:not-sr-only"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
</script>
