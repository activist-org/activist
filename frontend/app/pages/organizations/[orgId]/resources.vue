<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization?.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization?.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.organizations._global.resources_tagline')"
      :underDevelopment="false"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnActionAdd
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
          :element="$t('i18n._global.resources_lower')"
          :onClick="openModal"
        />
        <ModalResourceOrganization />
      </div>
    </HeaderAppPageOrganization>
    <!-- Draggable list -->
    <div v-if="(organization?.resources ?? []).length" class="py-4">
      <draggable
        v-model="resourceList"
        @end="onDragEnd"
        :animation="150"
        chosen-class="sortable-chosen"
        class="flex flex-col gap-4"
        data-testid="organization-resources-list"
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
            @focus="canEdit(organization) ? onFocus(index) : undefined"
            @keydown.down.prevent="canEdit(organization) ? moveDown() : undefined"
            @keydown.up.prevent="canEdit(organization) ? moveUp() : undefined"
            :class="{
              selected: selectedIndex === index,
              selectedResource: selectedIndex === index,
            }"
            :entity="organization"
            :entityType="EntityType.ORGANIZATION"
            :isReduced="true"
            :resource="element"
            :tabindex="canEdit(organization) ? 0 : -1"
          />
        </template>
      </draggable>
    </div>
    <EmptyState v-else class="py-4" pageType="resources" :permission="false" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

const { openModal } = useModalHandlers("ModalResourceOrganization");
const { canEdit } = useUser();

const route = useRoute();
const paramsOrgId = (route.params.orgId as string | undefined) ?? "";

const { data: organization } = useGetOrganization(paramsOrgId);
const { reorderResources } = useOrganizationResourcesMutations(paramsOrgId);
const resourceList = ref<Resource[]>([
  ...(organization.value?.resources || []),
]);
const resourceCardList = ref<(HTMLElement | null)[]>([]);

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
  resourceList.value.forEach((resource, index) => {
    resource.order = index;
  });

  reorderResources(resourceList.value);
};
watch(
  () => organization.value?.resources,
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

.selected {
  transform: scale(1.025);
  background: highlight;
}
</style>
