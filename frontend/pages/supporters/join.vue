<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.become_supporter") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_MODIFIED_JOIN_ICON_URL"
      imgAltText="pages.supporters._global.join_img_alt_text"
    >
      <h1 class="responsive-h1 font-bold">
        {{ $t("pages._global.become_supporter") }}
      </h1>
      <p>
        {{ $t("pages.supporters.join.section_1_paragraph_1_1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section_1_paragraph_1_2") }} </NuxtLink
        >.
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section_2_subheader") }}
      </h2>
      <p>
        {{ $t("pages._global.visit_source_code_pt_1") }}
        <a
          class="focus-brand link-text"
          href="https://www.wikimedia.de/unlock"
          target="_blank"
        >
          {{ $t("pages._global.visit_source_code_pt_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages._global.visit_source_code_pt_3") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section_3_subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section_3_paragraph_1_1") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section_4_subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section_4_paragraph_1_1") }}
        <NuxtLink
          class="focus-brand link-text"
          :to="localePath('/help/contact')"
        >
          {{ $t("pages._global.contact_page") }}
        </NuxtLink>
        {{ $t("pages.supporters.join.section_4_paragraph_1_3") }}
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section_5_subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section_5_paragraph_1_1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section_5_paragraph_1_2") }}
        </NuxtLink>
        .
      </p>
      <h2 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.join.section_6_subheader") }}
      </h2>
      <p>
        {{ $t("_global.visit_our") }}
        <a
          class="focus-brand link-text"
          href="https://hosted.weblate.org/projects/activist/activist"
          target="_blank"
        >
          {{ $t("pages.supporters.join.section_6_paragraph_1_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.section_6_paragraph_1_3") }}
      </p>
    </PageDocs>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();
</script>
