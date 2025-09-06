<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Tabs class="pt-2 md:pt-0" :tabs="groupTabs" :selectedTab="2" />
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
          class="w-max"
          :cta="true"
          linkTo="/"
          label="i18n._global.new_resource"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="i18n.pages._global.resources.new_resource_aria_label"
        />
        <ModalResourceGroup />
      </div>
    </HeaderAppPageGroup>
    <!-- Draggable list -->
    <div v-if="props.group.resources?.length" class="py-4">
      <draggable
        v-model="resourceList"
        @end="onDragEnd"
        item-key="id"
        class="flex flex-col gap-4"
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

import type { Group } from "~/types/communities/group";
import type { Resource } from "~/types/content/resource";

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
</script>
