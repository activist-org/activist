<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
    :data-resource-id="resource.id"
    data-testid="resource-card"
  >
    <div class="flex items-center space-x-2">
      <IconDraggableEdit
        class="drag-handle cursor-grab select-none"
        :class="dragIconSizeClass"
        data-testid="resource-drag-handle"
        :entity="entity"
        size="2em"
      />
      <div class="flex flex-col md:flex-row">
        <NuxtLink
          :aria-label="$t(ariaLabel)"
          data-testid="resource-link"
          target="_blank"
          :to="localePath(linkUrl)"
        >
          <div class="h-min w-max rounded-md border border-section-div p-2">
            <Icon
              class="text-primary-text"
              :class="imageSizeClass"
              data-testid="resource-icon"
              :name="IconMap.RESOURCE"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
      <div class="-mb-2 flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <NuxtLink
            :aria-label="$t(ariaLabel)"
            target="_blank"
            :to="localePath(linkUrl)"
          >
            <h3 class="font-bold">
              {{ resource.name }}
            </h3>
          </NuxtLink>
          <MenuSearchResult
            class="max-md:relative max-md:z-[60]"
            :resource="resource"
          />
        </div>
        <div
          v-if="aboveMediumBP"
          class="flex items-center space-x-3 lg:space-x-5"
        >
          <slot name="desktop-meta-tags" />
        </div>
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div
          v-if="!aboveMediumBP"
          class="flex items-center justify-center space-x-4"
        >
          <slot name="mobile-meta-tags" />
        </div>
        <div
          v-if="!isReduced"
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
        >
          <MetaTagOrganization
            v-if="!isReduced && resource.org"
            class="pt-2"
            :organization="resource.org"
          />
        </div>
      </div>
      <p
        class="justify-center md:justify-start md:px-0 md:py-0"
        :class="{
          'line-clamp-3': isReduced,
          'line-clamp-4 lg:line-clamp-5': !isReduced,
        }"
      >
        {{ description }}
      </p>
    </div>
    <div class="flex items-center space-x-2">
      <IconEdit
        @click.stop="openModalEdit()"
        @keydown.enter="openModalEdit()"
        :entity="entity"
      />
      <IconDelete
        @click.stop="openModalDeleteConfirm()"
        @keydown.enter="openModalDeleteConfirm()"
        :entity="entity"
      />
    </div>
    <ModalResourceGroup
      v-if="EntityType.GROUP === entityType"
      :resource="resource"
    />
    <ModalResourceEvent
      v-if="EntityType.EVENT === entityType"
      :resource="resource"
    />
    <ModalResourceOrganization
      v-if="EntityType.ORGANIZATION === entityType"
      :resource="resource"
    />
    <ModalAlert
      :confirmBtnLabel="'i18n.components.card_resource.confirm_delete'"
      :message="'i18n.components.card_resource.confirm_delete_message'"
      :name="modalAlertName"
      :onConfirmation="handleDeleteResource"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  resource: Resource;
  entityType: EntityType;
  entity: Entity | null;
  isReduced?: boolean;
}>();

const { t } = useI18n();
const aboveMediumBP = useBreakpoint("md");
const localePath = useLocalePath();

const groupResourcesMutations = useGroupResourcesMutations(
  props.entity?.id ?? ""
);

const organizationResourcesMutations = useOrganizationResourcesMutations(
  props.entity?.id ?? ""
);

const eventResourcesMutations = useEventResourcesMutations(
  props.entity?.id ?? ""
);

const description = computed(() => {
  return props.resource.description || "";
});

const linkUrl = computed(() => {
  return props.resource.url || "";
});

const ariaLabel = computed(() => {
  return t("i18n.components.card_resource.navigate_to_resource_aria_label");
});

const imageSizeClass = computed(() => ({
  "h-[125px] w-[125px]": props.isReduced,
  "h-[150px] w-[150px]": !props.isReduced,
}));
const dragIconSizeClass = computed(() => ({
  "h-[25px] w-[25px]": props.isReduced,
  "h-[50px] w-[50px]": !props.isReduced,
}));

const openModalEdit = () => {
  const name = `ModalResource${props.entityType.charAt(0).toUpperCase() + props.entityType.slice(1)}${props.resource.id}`;
  useModalHandlers(name).openModal();
};

// Delete confirmation modal.
const modalAlertName = `ModalAlertResource${props.resource.id}`;
const { openModal: openModalDeleteConfirm } = useModalHandlers(modalAlertName);

// Map entity type to delete mutation.
const deleteByEntityType = {
  [EntityType.GROUP]: groupResourcesMutations?.deleteResource,
  [EntityType.ORGANIZATION]: organizationResourcesMutations?.deleteResource,
  [EntityType.EVENT]: eventResourcesMutations?.deleteResource,
};

const handleDeleteResource = async () => {
  const deleteResource = deleteByEntityType[props.entityType];
  if (deleteResource && props.resource.id) {
    await deleteResource(props.resource.id);
  }
};
</script>
