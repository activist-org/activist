<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <section
    v-if="entity"
    class="mx-4 mb-4 rounded-md border border-section-div bg-layer-1 p-3 elem-shadow-sm sm:mx-8"
    data-testid="entity-logo-mobile"
  >
    <div class="flex items-center gap-3">
      <div class="relative h-16 w-16 shrink-0">
        <div
          class="flex h-full w-full justify-center overflow-hidden rounded-md border border-section-div bg-layer-0 elem-shadow-sm"
        >
          <div
            v-if="accentClass"
            class="h-full w-[20%] rounded-l-md"
            :class="accentClass"
          ></div>
          <img
            v-if="imgUrl"
            :alt="entityLogoAlt"
            class="h-full object-cover"
            :class="imageClass"
            :src="imgUrl"
          />
          <div
            v-else
            class="flex h-full items-center justify-center text-primary-text"
            :class="fallbackClass"
          >
            <Icon :name="icon" size="2.75em" />
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
  accentClass?: string;
  icon: string;
  imgUrl?: string;
  tagline?: string;
}>();

const emit = defineEmits(["edit"]);
const { canEdit } = useUser();
const { t } = useI18n();

const canEditEntity = computed(() => canEdit(props.entity));
const imageClass = computed(() => (props.accentClass ? "w-[80%]" : "w-full"));
const fallbackClass = computed(() =>
  props.accentClass ? "w-[80%] rounded-r-md" : "w-full"
);

const entityLogoAlt = computed(() =>
  t("i18n._global.entity_logo", {
    entity_name: props.entity?.name ?? "",
  })
);

const editAriaLabel = computed(() =>
  t("i18n.components._global.edit_aria_label")
);

function handleEdit(): void {
  emit("edit");
}
</script>
