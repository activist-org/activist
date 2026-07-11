<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :selectedTab="2" :tabs="groupTabs" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ group?.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageGroup
      :header="group?.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.organizations._global.resources_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnActionAdd
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
          :element="$t('i18n._global.resources_lower')"
          :entity="group"
          label="i18n.pages._global.resources.add_new_resource"
          :onClick="
            () =>
              openModal({
                entityId: group?.id,
              })
          "
        />
      </div>
    </HeaderAppPageGroup>
    <!-- Draggable list -->
    <div
      v-if="(group?.resources || []).length"
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
        <template #item="{ element, index }">
          <CardResource
            :key="element.id"
            :ref="(el: any) => (resourceCardList[index] = el?.root)"
            @focusin="canEdit(group) ? onFocus(index) : undefined"
            @keydown.down.prevent="canEdit(group) ? moveDown() : undefined"
            @keydown.up.prevent="canEdit(group) ? moveUp() : undefined"
            :class="{
              selected: selectedIndex === index,
              selectedResource: selectedIndex === index,
            }"
            :entity="group"
            :entityType="EntityType.GROUP"
            :isReduced="true"
            :resource="element"
            :tabindex="canEdit(group) ? 0 : -1"
          />
        </template>
      </draggable>
    </div>
    <EmptyState v-else pageType="resources" :permission="canEdit(group)" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

const { openModal } = useModalHandlers("ModalResourceGroup");
const { canEdit } = useUser();

const route = useRoute();
const paramsGroupId = (route.params.groupId as string | undefined) ?? "";

const { data: group } = useGetGroup(paramsGroupId);
const resourceList = ref<Resource[]>([...(group.value?.resources || [])]);
const resourceCardList = ref<(HTMLElement | null)[]>([]);
const groupTabs = useGetGroupTabs();
const { reorderResources } = useGroupResourcesMutations(paramsGroupId);

const { selectedIndex, onFocus, moveUp, moveDown } =
  useDraggableKeyboardNavigation(
    resourceList as unknown as Ref<Record<string, unknown>[]>,
    async (list) => {
      await reorderResources(list as unknown as Resource[]);
    },
    resourceCardList as unknown as Ref<(HTMLElement | null)[]>
  );

export type CardExpose = {
  root: HTMLElement | null;
};
const onDragEnd = () => {
  resourceList.value = resourceList.value.map((resource, index) => ({
    ...resource,
    order: index,
  }));
  reorderResources(resourceList.value);
};
watch(
  () => group.value?.resources,
  (newResources) => {
    resourceList.value = [...(newResources || [])];
  },
  { deep: true }
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

.selected {
  background: highlight;
}
</style>
