<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ $t("_global.search") }}</Title>
    </Head>
    <HeaderAppPage
      :header="$t('pages.search.index.header')"
      :tagline="$t('pages.search.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ShieldTopic topic="My topics dropdown" />
      </div>
    </HeaderAppPage>
    <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" />
  </div>
</template>
