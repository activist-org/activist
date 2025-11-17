<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="bg-layer-0 px-8">
    <Head>
      <Title>{{ $t("i18n.pages.organizations.index.header_title") }}</Title>
    </Head>

    <HeaderAppPage
      :header="$t('i18n.pages.organizations.index.header_title')"
      :tagline="$t('i18n.pages.organizations.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <ComboboxTopics />
      </div>
    </HeaderAppPage>

    <Loading v-if="pending && !loadingFetchMore" />

    <div v-else-if="showOrganizations">
      <div
        v-for="org in organizations"
        :key="org.id"
        class="space-y-6 pb-6 pt-3 md:pt-4"
      >
        <CardSearchResultEntityOrganization
          :isPrivate="false"
          :organization="org"
        />
      </div>

      <!-- sentinel -->
      <div ref="bottomSentinel">
        <h1 v-if="loadingFetchMore">Loading...</h1>
      </div>
    </div>

    <EmptyState v-else pageType="organizations" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { useGetOrganizations } from "~/composables/queries/useGetOrganizations";

const route = useRoute();
const filters = computed(() => route.query);

const loadingFetchMore = ref(false);
const { data: organizations, pending, getMore } = useGetOrganizations(filters);

const bottomSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const showOrganizations = computed(() => {
  return organizations.value.length > 0;
});

watch(pending, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    loadingFetchMore.value = false;
  }
});

onMounted(async () => {
  await nextTick();
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !pending.value) {
        loadingFetchMore.value = true;
        getMore();
      }
    },
    { root: null, rootMargin: "0px", threshold: 0.1 }
  );
  if (bottomSentinel.value) observer.observe(bottomSentinel.value);
});

onUnmounted(() => {
  if (observer && bottomSentinel.value) {
    observer.unobserve(bottomSentinel.value);
    observer.disconnect();
  }
});
</script>
