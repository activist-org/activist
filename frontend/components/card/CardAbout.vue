<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col gap-5">
      <ModalQRCode
        v-if="organization && !expandText"
        :entityName="organization.name"
      />
      <button
        v-if="expandText"
        @click="
          emit('expand-reduce-text');
          expand_reduce_text();
        "
        class="focus-brand absolute right-0 rounded-full p-1 text-light-distinct-text hover:text-light-text dark:text-dark-distinct-text hover:dark:text-dark-text"
      >
        <Icon class="h-10 w-10" name="bi:x-circle-fill" />
      </button>
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="responsive-h3 text-left font-display">
            {{ $t("_global.about") }}
          </h3>
          <IconEdit />
        </div>
        <div v-if="event" class="flex-col space-y-3">
          <ShieldTopic :topic="event.topic" />
          <div>
            <p
              ref="description"
              :class="{
                'line-clamp-2': !expandText,
              }"
            >
              {{ event.description }}
            </p>
            <div class="flex justify-center">
              <button
                v-if="!expandText && descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="focus-brand mt-1 font-semibold text-light-link-text dark:text-dark-link-text"
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
                class="focus-brand mt-1 font-semibold text-light-link-text dark:text-dark-link-text"
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
            <MetaTagLocation :location="organization.location" />
            <MetaTagMembers
              :members="organization.members"
              :label="$t('components._global.members_lower')"
            />
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
            <div class="flex justify-center">
              <button
                v-if="!expandText && descriptionExpandable"
                @click="
                  emit('expand-reduce-text');
                  expand_reduce_text();
                "
                class="focus-brand mt-1 font-semibold text-light-link-text dark:text-dark-link-text"
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
                class="focus-brand mt-1 font-semibold text-light-link-text dark:text-dark-link-text"
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
