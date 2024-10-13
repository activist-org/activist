<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ event.name }}&nbsp;{{ $t("pages._global.team.team_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('pages._global.team.team_lower')"
      :tagline="$t('pages.events.team.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="pages._global.team.invite_someone"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="pages.events.team.invite_someone_event_aria_label"
        />
      </div>
    </HeaderAppPage>
    <PagePreviewTeam />
    <!-- <div v-if="event.members" class="space-y-3 py-4">
      <CardSearchResultUser
        v-for="(u, i) in event.members"
        :key="i"
        :isReduced="true"
        :user="u"
      />
    </div>
    <EmptyState v-else pageType="users" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
</script>
