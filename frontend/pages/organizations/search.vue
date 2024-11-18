<template>
  <div class="bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ $t("pages.organizations.search.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.search.header_title')"
      :tagline="$t('pages.organizations.search.subheader')"
    >
      <ComboboxTopics />
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>
