<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.legal.privacy_policy.title") }}</Title>
    </Head>
    <PageDocs
      :imgUrl="BOOTSTRAP_SHIELD_CHECK_URL"
      imgAltText="pages.legal._global.privacy_policy_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.privacy_policy") }}
      </h1>
      <p
        class="responsive-h4 text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ $t("pages.legal.privacy_policy.last_updated") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy_policy.section_1_paragraph_1") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy_policy.section_1_paragraph_2") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy_policy.section_1_paragraph_3") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_2_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_2_paragraph_1") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_3_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_3_paragraph_1") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_4_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_4_paragraph_1") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_5_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_5_paragraph_1") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy_policy.section_5_paragraph_2") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_6_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_6_paragraph_1") }}
      </p>
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.privacy_policy.section_7_subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy_policy.section_7_paragraph_1") }}
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
