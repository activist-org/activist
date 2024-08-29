<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.legal.trademark_policy.title") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_TRADEMARK_URL"
      imgAltText="pages.legal._global.trademark_policy_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.trademark_policy") }}
      </h1>
      <p
        class="responsive-h4 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.legal.trademark_policy.last_updated") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_1") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_2") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_3") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_4") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_5_1") }}
        <a class="focus-brand link-text -mr-1" href="mailto:team@activist.org">
          team@activist.org
        </a>
        .
        {{ $t("pages.legal.trademark_policy.section_1_paragraph_5_2") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.trademark_policy.section_2_subheader") }}
      </h2>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_1") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_2") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_3") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_4") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_5") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_6") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_7") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_2_list_1_item_8") }}
        </li>
      </ul>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.trademark_policy.section_3_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.trademark_policy.section_3_paragraph_1") }}
      </p>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark_policy.section_3_list_1_item_1") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark_policy.section_3_list_1_item_2") }}
        </li>
      </ul>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.trademark_policy.section_4_subheader") }}
      </h2>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark_policy.section_4_list_1_item_1") }}
        </li>
      </ul>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.trademark_policy.section_5_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.trademark_policy.section_5_paragraph_1") }}
      </p>
      <PageCommunityFooter>
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
