<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.supporters.join.title") }}</Title>
    </Head>
    <div class="flex flex-col space-y-4 responsive-py-4 responsive-px-5">
      <h1 class="font-bold responsive-h1">{{ $t("pages.supporters.join.title") }}</h1>
      <p>
        {{ $t("pages.supporters.join.paragraph-1-pt1") }}
        <NuxtLink :to="localePath('/supporters')" class="focus-brand link-text"
          >{{ $t("pages.supporters.join.paragraph-1-pt1") }}</NuxtLink
        >.
      </p>
      <h2 class="font-bold responsive-h4">{{ $t("pages.supporters.join.subtitle-1") }}</h2>
      <p>
        {{ $t("pages.supporters.join.paragraph-2-pt1") }}
        <a
          href="https://www.wikimedia.de/unlock"
          class="focus-brand link-text"
          target="_blank"
          >{{ $t("pages.supporters.join.paragraph-2-pt2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.paragraph-2-pt3") }}
      </p>
      <h2 class="font-bold responsive-h4">{{ $t("pages.supporters.join.subtitle-2") }}</h2>
      <p>
        {{ $t("pages.supporters.join.paragraph-3-pt1") }}
        <a href="" class="focus-brand link-text" target="_blank"
          >{{ $t("pages.supporters.join.paragraph-3-pt2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.paragraph-3-pt3") }}
      </p>
      <h2 class="font-bold responsive-h4">{{ $t("pages.supporters.join.subtitle-3") }}</h2>
      <p>
        {{ $t("pages.supporters.join.paragraph-4-pt1") }}
        <NuxtLink
          :to="localePath('/help/contact')"
          class="focus-brand link-text"
          >{{ $t("pages.supporters.join.paragraph-4-pt2") }}</NuxtLink
        >
        {{ $t("pages.supporters.join.paragraph-4-pt3") }}
      </p>
      <h2 class="font-bold responsive-h4">{{ $t("pages.supporters.join.subtitle-4") }}</h2>
      <p>
        {{ $t("pages.supporters.join.paragraph-5-pt1") }}
        <NuxtLink :to="localePath('/supporters')" class="focus-brand link-text"
          >{{ $t("pages.supporters.join.paragraph-5-pt2") }}</NuxtLink
        >.
      </p>
      <h2 class="font-bold responsive-h4">{{ $t("pages.supporters.join.subtitle-5") }}</h2>
      <p>
        {{ $t("pages.supporters.join.paragraph-6-pt1") }}
        <a
          href="https://explore.transifex.com/activist-org/activist"
          class="focus-brand link-text"
          target="_blank"
          >{{ $t("pages.supporters.join.paragraph-6-pt2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.paragraph-6-pt3") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
