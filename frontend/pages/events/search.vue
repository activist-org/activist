<template>
  <div class="text-primary-text bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ $t("pages.events.search.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.events.search.header_title')"
      :tagline="$t('pages.events.search.subheader')"
    >
      <ComboboxTopics />
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>
