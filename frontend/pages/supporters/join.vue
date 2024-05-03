<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.become-supporter") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_MODIFIED_JOIN_ICON_URL"
      imgAltText="pages.supporters._global.join-img-alt-text"
    >
      <h1 class="responsive-h1 font-bold">
        {{ $t("pages._global.become-supporter") }}
      </h1>
      <p>
        {{ $t("pages.supporters.join.section-1-paragraph-1-1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section-1-paragraph-1-2") }} </NuxtLink
        >.
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section-2-subheader") }}
      </h2>
      <p>
        {{ $t("pages._global.visit-source-code-pt-1") }}
        <a
          class="focus-brand link-text"
          href="https://www.wikimedia.de/unlock"
          target="_blank"
        >
          {{ $t("pages._global.visit-source-code-pt-2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages._global.visit-source-code-pt-3") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section-3-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-3-paragraph-1-1") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section-4-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-4-paragraph-1-1") }}
        <NuxtLink
          class="focus-brand link-text"
          :to="localePath('/help/contact')"
        >
          {{ $t("pages._global.contact-page") }}
        </NuxtLink>
        {{ $t("pages.supporters.join.section-4-paragraph-1-3") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section-5-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-5-paragraph-1-1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section-5-paragraph-1-2") }}
        </NuxtLink>
        .
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section-6-subheader") }}
      </h2>
      <p>
        {{ $t("_global.visit-our") }}
        <a
          class="focus-brand link-text"
          href="https://explore.transifex.com/activist-org/activist"
          target="_blank"
        >
          {{ $t("pages.supporters.join.section-6-paragraph-1-2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.section-6-paragraph-1-3") }}
      </p>
    </PageDocs>
  </div>
</template>

<script setup lang="ts">
import useRouteToName from "~/composables/useRouteToName";
import { IconMap } from "~/types/icon-map";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const localePath = useLocalePath();
</script>
