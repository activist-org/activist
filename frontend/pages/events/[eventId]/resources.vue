<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ event.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageEvent
      :header="event.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.events.resources.tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          @click.stop="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
        />
      </div>
      <ModalResourceEvent />
    </HeaderAppPageEvent>
    <!-- Draggable list -->
    <div v-if="props.event.resources?.length" class="py-4">
      <draggable
        v-model="resourceList"
        @end="onDragEnd"
        item-key="id"
        class="py-4"
      >
        <template #item="{ element }">
          <CardSearchResultResource :isReduced="true" :resource="element" />
        </template>
      </draggable>
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

import type { Resource } from "~/types/content/resource";
import type { Event } from "~/types/events/event";

import { IconMap } from "~/types/icon-map";

const { openModal } = useModalHandlers("ModalResourceEvent");
const props = defineProps<{
  event: Event;
}>();

const resourceList = ref<Resource[]>([...(props.event.resources || [])]);
const eventStore = useEventStore();
const onDragEnd = () => {
  resourceList.value.forEach((resource, index) => {
    resource.order = index;
  });

  eventStore.reorderResource(props.event, resourceList.value);
};
</script>
