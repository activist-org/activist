<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("pages.organizations.affiliates.affiliates_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name +
        ' ' +
        $t('pages.organizations.affiliates.affiliates_lower')
      "
      :tagline="$t('pages.organizations.affiliates.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3"></div>
    </HeaderAppPage>
    <PagePreviewAffiliates />
    <!-- <div v-if="orgSupporters.length > 0" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in orgSupporters"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState
      v-else
      pageType="organizations"
      :permission="false"
      class="py-4"
    /> -->
  </div>
</template>

<script setup lang="ts">
const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchByID(id);

const { organization } = organizationStore;

// const orgSupporters = [];
</script>
