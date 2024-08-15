<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.roadmap") }}</Title>
    </Head>
    <PageDocs
      :imgURL="ARCTICONS_BIKE_LOCATION"
      imgAltText="pages.about._global.roadmap_img_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.roadmap") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          :name="IconMap.CIRCLE_INFO"
          size="1.25em"
        />
        <p>
          {{ $t("pages._global.visit_source_code_pt_1") }}
          <a
            class="focus-brand link-text items-center"
            href="https://github.com/activist-org/activist"
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
      </div>
      <p>
        {{ $t("pages.about.roadmap.section_1_paragraph_1") }}
      </p>
      <div>
        {{ $t("pages.about.roadmap.section_1_paragraph_2_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org/projects/1"
          target="_blank"
        >
          {{ $t("pages.about.roadmap.section_1_paragraph_2_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.about.roadmap.section_1_paragraph_2_3") }}
        {{ $t("pages.about.roadmap.section_1_paragraph_2_4") }}
        <ul class="list-disc space-y-1 pl-4 pt-2">
          <li>
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22"
              target="_blank"
            >
              {{ $t("pages.about.roadmap.section_1_paragraph_2_4_1") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
          </li>
          <li>
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Afeature"
              target="_blank"
            >
              {{ $t("pages.about.roadmap.section_1_paragraph_2_4_2") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
          </li>
          <li>
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Abug"
              target="_blank"
            >
              {{ $t("pages.about.roadmap.section_1_paragraph_2_4_3") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
          </li>
        </ul>
      </div>
      <PageCommunityFooter>
        <BtnRouteExternal
          class="w-full"
          :cta="true"
          label="components.btn_route_external.suggest_a_feature"
          linkTo="https://github.com/activist-org/activist/issues"
          fontSize="lg"
          ariaLabel="
                components.btn_route_external.suggest_a_feature_aria_label
              "
        />
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="components.btn_route_internal.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn_route_internal.return_home_aria_label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import { IconMap } from "~/types/icon-map";
</script>
