<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.resources_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.resources_lower')"
      :tagline="$t('pages.events.resources.tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn_route_internal.new_resource_aria_label"
        />
      </div>
    </HeaderAppPage>
    <div v-if="event.resources" class="space-y-3 py-4">
      <CardSearchResultResource
        v-for="(r, i) in event.resources"
        :key="i"
        :isReduced="true"
        :resource="r"
      />
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testClimateEvent } from "~/utils/testEntities";

const event = testClimateEvent;
</script>
