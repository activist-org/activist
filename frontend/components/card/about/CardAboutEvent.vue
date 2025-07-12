<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardAbout>
    <div class="flex-col space-y-3">
      <div class="flex items-center gap-5">
        <h3 class="text-left font-display">
          {{ $t("i18n._global.about") }}
        </h3>
        <IconEdit
          v-if="userIsSignedIn"
          @click="openModalEditTextEvent"
          @keydown.enter="openModalEditTextEvent"
        />
      </div>
      <div class="flex-col space-y-3">
        <!-- <div class="flex items-center gap-3">
            <ShieldTopic v-for="(t, i) in event.topics" :key="i" :topic="t" />
          </div> -->
        <div>
          <p
            ref="description"
            :class="{
              'line-clamp-2': !expandText,
            }"
          >
            {{ event.texts.description }}
          </p>
          <div class="flex justify-center">
            <button
              v-if="!expandText && descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              class="focus-brand mt-1 font-semibold text-link-text"
              :aria-label="
                $t('i18n.components.card.about._global.full_text_aria_label')
              "
            >
              {{ $t("i18n.components.card.about._global.full_text") }}
            </button>
            <button
              v-else-if="descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              class="focus-brand mt-1 font-semibold text-link-text"
              :aria-label="
                $t('i18n.components.card.about._global.reduce_text_aria_label')
              "
            >
              {{ $t("i18n.components.card.about._global.reduce_text") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </CardAbout>
</template>

<script setup lang="ts">
const { openModal: openModalEditTextEvent } =
  useModalHandlers("ModalEditTextEvent");

const { userIsSignedIn } = useUser();

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);
const { event } = eventStore;

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
