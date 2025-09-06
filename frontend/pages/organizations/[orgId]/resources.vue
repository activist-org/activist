<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{ $t("i18n._global.resources_lower") }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="organization.name + ' ' + $t('i18n._global.resources_lower')"
      :tagline="$t('i18n.pages.organizations._global.resources_tagline')"
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
        <ModalResourceOrganization />
      </div>
    </HeaderAppPageOrganization>
    <!-- Draggable list -->
    <div v-if="props.organization.resources?.length" class="py-4">
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
    <EmptyState v-else pageType="resources" :permission="false" class="py-4" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

import type { Organization } from "~/types/communities/organization";
import type { Resource } from "~/types/content/resource";

import { IconMap } from "~/types/icon-map";

const { openModal } = useModalHandlers("ModalResourceOrganization");
const props = defineProps<{
  organization: Organization;
}>();
const resourceList = ref<Resource[]>([...(props.organization.resources || [])]);
const orgStore = useOrganizationStore();
const onDragEnd = () => {
  resourceList.value.forEach((resource, index) => {
    resource.order = index;
  });

  orgStore.reorderResource(props.organization, resourceList.value);
};
</script>
