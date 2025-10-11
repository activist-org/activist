<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :selectedTab="2" :tabs="groupTabs" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ group.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageGroup
      :header="group.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.organizations._global.resources_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnAction
          @click.stop="openModal()"
          @keydown.enter="openModal()"
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n._global.new_resource"
          :leftIcon="IconMap.PLUS"
          linkTo="/"
        />
        <ModalResourceGroup />
      </div>
    </HeaderAppPageGroup>
    <!-- Draggable list -->
    <div
      v-if="props.group.resources?.length"
      class="py-4"
      data-testid="organization-group-resources-list"
    >
      <draggable
        v-model="resourceList"
        @end="onDragEnd"
        :animation="150"
        chosen-class="sortable-chosen"
        class="flex flex-col gap-4"
        :delay="0"
        :delay-on-touch-start="false"
        direction="vertical"
        :disabled="false"
        :distance="5"
        drag-class="sortable-drag"
        fallback-class="sortable-fallback"
        :fallback-tolerance="0"
        :force-fallback="false"
        ghost-class="sortable-ghost"
        handle=".drag-handle"
        :invert-swap="false"
        item-key="id"
        :swap-threshold="0.5"
        :touch-start-threshold="3"
      >
        <template #item="{ element }">
          <CardResource
            :entityType="EntityType.GROUP"
            :isReduced="true"
            :resource="element"
          />
        </template>
      </draggable>
    </div>
    <EmptyState v-else pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

import type { Group } from "~/types/communities/group";
import type { Resource } from "~/types/content/resource";

import { EntityType } from "~/types/entity";
import { IconMap } from "~/types/icon-map";

const { openModal } = useModalHandlers("ModalResourceGroup");

const props = defineProps<{
  group: Group;
}>();
const resourceList = ref<Resource[]>([...(props.group.resources || [])]);
const groupTabs = getGroupTabs();
const groupStore = useGroupStore();
const onDragEnd = () => {
  resourceList.value.forEach((resource, index) => {
    resource.order = index;
  });

  groupStore.reorderResource(props.group, resourceList.value);
};
watch(
  () => groupStore.group.resources,
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

/* Ensure drag handles work properly. */
.drag-handle {
  user-select: none;
}
</style>
