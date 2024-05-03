<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.roadmap") }}</Title>
    </Head>
    <PageDocs
      :imgURL="ARCTICONS_BIKE_LOCATION"
      imgAltText="pages.about._global.roadmap-img-alt-text"
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
          {{ $t("pages._global.visit-source-code-pt-1") }}
          <a
            class="focus-brand link-text items-center"
            href="https://github.com/activist-org/activist"
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
      </div>
      <p>
        {{ $t("pages.about.roadmap.section-1-paragraph-1") }}
      </p>
      <div>
        {{ $t("pages.about.roadmap.section-1-paragraph-2-1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org/projects/1"
          target="_blank"
        >
          {{ $t("pages.about.roadmap.section-1-paragraph-2-2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.about.roadmap.section-1-paragraph-2-3") }}
        {{ $t("pages.about.roadmap.section-1-paragraph-2-4") }}
        <ul class="list-disc space-y-1 pl-4 pt-2">
          <li>
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22"
              target="_blank"
            >
              {{ $t("pages.about.roadmap.section-1-paragraph-2-4-1") }}
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
              {{ $t("pages.about.roadmap.section-1-paragraph-2-4-2") }}
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
              {{ $t("pages.about.roadmap.section-1-paragraph-2-4-3") }}
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
          label="components.btn-route-external.suggest-a-feature"
          linkTo="https://github.com/activist-org/activist/issues"
          fontSize="lg"
          ariaLabel="
                components.btn-route-external.suggest-a-feature-aria-label
              "
        />
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import useRouteToName from "~/composables/useRouteToName";
import { IconMap } from "~/types/icon-map";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);
</script>
