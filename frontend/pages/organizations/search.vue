<template>
  <div
    class="bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ $t("pages.organizations.search.header-title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.organizations.search.header-title')"
      :tagline="$t('pages.organizations.search.subheader')"
    >
      <ComboboxTopics />
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>
