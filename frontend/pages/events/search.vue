<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ $t("i18n.pages.events.search.header_title") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('i18n.pages.events.search.header_title')"
      :tagline="$t('i18n.pages.events.search.subheader')"
    >
      <ComboboxTopics />
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>
