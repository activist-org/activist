<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <section
    v-if="entity"
    class="mx-4 mb-4 rounded-md border border-section-div bg-layer-1 p-3 elem-shadow-sm sm:mx-8"
    data-testid="entity-logo-mobile"
  >
    <div class="flex items-center gap-3">
      <div class="relative h-16 w-16 shrink-0">
        <ImageOrganization
          v-if="entityType === EntityType.ORGANIZATION"
          :alt="entityLogoAlt"
          class="elem-shadow-sm"
          :imgUrl="imgUrl"
        />
        <ImageEvent
          v-else-if="entityType === EntityType.EVENT"
          :alt="entityLogoAlt"
          class="elem-shadow-sm"
          :eventType="eventType || 'action'"
          :imgUrl="imgUrl"
          size="2.75em"
        />
        <div
          v-else
          class="flex h-full w-full justify-center rounded-md border border-section-div bg-layer-0"
        >
          <img
            v-if="imgUrl"
            :alt="entityLogoAlt"
            class="h-full w-full rounded-md object-cover"
            :src="imgUrl"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-primary-text"
          >
            <Icon :name="IconMap.GROUP" size="2.75em" />
          </div>
        </div>
        <button
          v-if="canEditEntity"
          @click="handleEdit"
          :aria-label="editAriaLabel"
          class="absolute bottom-1 right-1 z-10 flex rounded-md border border-black/80 bg-white/80 p-1 text-black/80 focus-brand dark:border-white/80 dark:bg-black/80 dark:text-white/80"
          data-testid="entity-logo-mobile-edit"
          type="button"
        >
          <Icon :name="IconMap.EDIT" size="1em" />
        </button>
      </div>
      <div class="min-w-0">
        <p class="truncate font-bold">
          {{ entity.name }}
        </p>
        <p v-if="tagline" class="truncate text-sm font-bold text-distinct-text">
          {{ tagline }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  entity: Entity | null;
  entityType: EntityType;
  eventType?: EventType;
  imgUrl?: string;
  tagline?: string;
}>();

const { openModal } = useModalHandlers("ModalUploadImageIcon");
const { showToastError } = useToaster();
const { canEdit } = useUser();
const { t } = useI18n();

const canEditEntity = computed(() => canEdit(props.entity));

const entityLogoAlt = computed(() =>
  t("i18n._global.entity_logo", {
    entity_name: props.entity?.name ?? "",
  })
);

const editAriaLabel = computed(() => {
  if (props.entityType === EntityType.ORGANIZATION) {
    return t(
      "i18n.components.sidebar_left_content_organization.edit_aria_label"
    );
  }

  if (props.entityType === EntityType.EVENT) {
    return t("i18n.components.sidebar_left_content_event.edit_aria_label");
  }

  return t("i18n.components.sidebar_left_content_group_page.edit_aria_label");
});

function handleEdit(): void {
  if (!props.entity?.id) {
    return;
  }

  if (props.entityType === EntityType.GROUP) {
    showToastError("THIS FEATURE IS COMING SOON!");
    return;
  }

  openModal({
    entityId: props.entity.id,
    entityType: props.entityType,
  });
}
</script>
