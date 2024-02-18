<template>
  <div class="px-5 py-5 card-style">
    <div class="relative flex-col w-full gap-5">
      <ModalQRCode
        v-if="organization && !expandText"
        :entityName="organization.name"
      />
      <ModalQRCode v-if="event && !expandText" :entityName="event.name" />
      <button
        v-if="expandText"
        @click="
          emit('expand-reduce-text');
          expand_reduce_text();
        "
        class="absolute right-0 p-1 rounded-full text-light-distinct-text dark:text-dark-distinct-text hover:text-light-text hover:dark:text-dark-text focus-brand"
      >
        <Icon class="w-10 h-10" name="bi:x-circle-fill" />
      </button>
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="text-left responsive-h3 font-display">
            {{ $t("_global.about") }}
          </h3>
          <Icon name="bi:pencil-square" size="1.2em" />
        </div>
        <div v-if="event" class="flex-col space-y-3">
          <ShieldTopic :topic="event.topic" />
          <div class="flex items-center gap-3">
            <MetaTagOrganization
              :organizations="event.organizations"
            ></MetaTagOrganization>
          </div>
          <div class="flex flex-col gap-3 md:gap-8 sm:flex-row sm:items-center">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ event.inPersonLocation }}</p>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="bi:calendar-plus" size="1.2em" />
              <p>{{ event.date }}</p>
            </div>
          </div>
          <div>
            <p
              ref="description"
              :class="{
                'line-clamp-2': !expandText,
              }"
            >
              {{ event.description }}
            </p>
            <div class="flex justify-end">
              <button
                v-if="!expandText && descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="mt-1 font-semibold text-light-link-text dark:text-dark-link-text focus-brand"
                :aria-label="$t('components.card-about.full-text-aria-label')"
              >
                {{ $t("components.card-about.full-text") }}
              </button>
              <button
                v-else-if="descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="mt-1 font-semibold text-light-link-text dark:text-dark-link-text focus-brand"
                :aria-label="$t('components.card-about.reduce-text-aria-label')"
              >
                {{ $t("components.card-about.reduce-text") }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="organization" class="flex-col space-y-3">
          <ShieldTopic :topic="organization.topic" />
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ organization.location }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="bi:people" size="1.2em" />
              <p>{{ organization.members }}</p>
            </div>
          </div>
          <div>
            <p
              ref="description"
              :class="{
                'line-clamp-3': !expandText,
              }"
            >
              {{ organization.description }}
            </p>
            <div class="flex justify-end">
              <button
                v-if="!expandText && descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="mt-1 font-semibold text-light-link-text dark:text-dark-link-text focus-brand"
                :aria-label="$t('components.card-about.full-text-aria-label')"
              >
                {{ $t("components.card-about.full-text") }}
              </button>
              <button
                v-else-if="descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="mt-1 font-semibold text-light-link-text dark:text-dark-link-text focus-brand"
                :aria-label="$t('components.card-about.reduce-text-aria-label')"
              >
                {{ $t("components.card-about.reduce-text") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

defineProps<{
  organization?: Organization;
  event?: Event;
}>();

const description = ref();
const descriptionExpandable = ref(false);

function setDescriptionExpandable(): void {
  descriptionExpandable.value =
    description.value.scrollHeight > description.value.clientHeight
      ? true
      : false;
}

onMounted(() => {
  window.addEventListener("resize", setDescriptionExpandable);
  setDescriptionExpandable();
});

onUnmounted(() => {
  window.removeEventListener("resize", setDescriptionExpandable);
});

const emit = defineEmits(["expand-reduce-text"]);
const expandText = ref(false);

function expand_reduce_text() {
  expandText.value = !expandText.value;
}
</script>
