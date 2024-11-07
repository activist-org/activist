<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.about_us") }}</Title>
    </Head>
    <PageDocs
      imgUrl="/icons/activist/activist_icon"
      imgAltText="_global.activist_icon_img_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("pages.about.activist.header") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          :name="IconMap.CIRCLE_INFO"
          size="1.25em"
        />
        <p>
          {{ $t("pages._global.see_the") }}
          <a
            class="focus-brand link-text items-center"
            href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=805%3A231&t=vNWHCPdiq5EbPaO9-1"
            target="_blank"
          >
            {{ $t("pages.about.activist.subheader_2") }}
            <Icon
              :name="IconMap.EXTERNAL_LINK"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages._global.to_learn_more") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.activist.section_1_paragraph_1") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section_1_paragraph_2") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section_1_paragraph_3") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section_1_paragraph_4") }}
      </p>
      <PageCommunityFooter>
        <BtnRouteExternal
          class="w-full"
          :cta="true"
          label="_global.request_access"
          :linkTo="REQUEST_ACCESS_URL"
          fontSize="lg"
          ariaLabel="
                _global.request_access-aria-label
              "
        />
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="_global.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="_global.return_home_aria_label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import { IconMap } from "~/types/icon-map";
</script>
