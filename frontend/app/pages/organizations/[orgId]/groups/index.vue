<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization?.name }}&nbsp;{{
          $t("i18n.pages.organizations.groups.index.groups_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization?.name +
        ' ' +
        $t('i18n.pages.organizations.groups.index.groups_lower')
      "
      :tagline="$t('i18n.pages.organizations.groups.index.tagline')"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          ariaLabel="i18n.pages.organizations.groups.index.new_group_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n._global.new_group"
          :leftIcon="IconMap.PLUS"
          linkTo="/"
        />
      </div>
    </HeaderAppPageOrganization>
    <div
      v-if="(organization?.groups || []).length > 0"
      class="space-y-3 py-4"
      data-testid="organization-groups-list"
    >
      <CardSearchResultEntityGroup
        v-for="(g, i) in organization?.groups || []"
        :key="i"
        :group="g"
        :isPrivate="false"
        :isReduced="true"
      />
    </div>
    <EmptyState v-else class="py-4" pageType="groups" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const { data: organization } = useGetOrganization(
  (useRoute().params.orgId as string) ?? ""
);
</script>
