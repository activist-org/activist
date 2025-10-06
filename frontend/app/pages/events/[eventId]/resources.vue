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
        class="flex flex-col gap-4"
        data-testid="event-resources-list"
        :touch-start-threshold="3"
        :force-fallback="false"
        :fallback-tolerance="0"
        :delay="0"
        :delay-on-touch-start="false"
        :swap-threshold="0.5"
        :invert-swap="false"
        :direction="'vertical'"
        :disabled="false"
        :animation="150"
        :ghost-class="'sortable-ghost'"
        :chosen-class="'sortable-chosen'"
        :drag-class="'sortable-drag'"
        :handle="'.drag-handle'"
        :distance="5"
        :fallback-class="'sortable-fallback'"
      >
        <template #item="{ element }">
          <CardResource
            :isReduced="true"
            :resource="element"
            :entityType="EntityType.EVENT"
          />
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

import { EntityType } from "~/types/entity";
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
watch(
  () => eventStore.event.resources,
  (newResources) => {
    resourceList.value = [...(newResources || [])];
  }
);
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.4;
  transition: opacity 0.05s ease;
}

.sortable-chosen {
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.05s ease;
}

.sortable-drag {
  transform: rotate(5deg);
  transition: transform 0.05s ease;
}

.sortable-fallback {
  display: none;
}

/* Ensure drag handles work properly */
.drag-handle {
  user-select: none;
}
</style>
