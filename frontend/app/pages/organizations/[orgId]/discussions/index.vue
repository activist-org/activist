<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages._global.discussions_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization.name + ' ' + $t('i18n.pages._global.discussions_lower')
      "
      :tagline="$t('i18n.pages.organizations.discussions.index.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          v-if="aboveMediumBP"
          ariaLabel="i18n.pages._global.new_discussion_aria_label"
          class="block w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n.pages._global.new_discussion"
          :leftIcon="IconMap.PLUS"
          linkTo="/"
        />
      </div>
    </HeaderAppPageOrganization>
    <!-- <div v-if="organization.discussions" class="space-y-6 pb-6 pt-3 md:pt-4">
      <CardDiscussion
        v-for="(d, i) in organization.discussions"
        :key="i"
        :isPrivate="false"
        :discussion="d"
      />
    </div>
    <EmptyState v-else pageType="discussions" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");

defineProps<{
  organization: Organization;
}>();
</script>
