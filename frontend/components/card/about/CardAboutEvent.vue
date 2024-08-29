<template>
  <CardAbout>
    <div class="flex-col space-y-3">
      <div class="flex items-center gap-5">
        <h3 class="responsive-h3 text-left font-display">
          {{ $t("_global.about") }}
        </h3>
        <IconEdit @click="openModal()" @keydown.enter="openModal()" />
        <ModalEditAboutEvent
          @closeModal="handleCloseModal"
          :event="event"
          :description="event.description"
          :getInvolved="event.getInvolved"
          :getInvolvedURL="event.getInvolvedURL"
          :isOpen="modalIsOpen"
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
              :aria-label="$t('components.card.about._global.full_text_aria_label')"
            >
              {{ $t("components.card.about._global.full_text") }}
            </button>
            <button
              v-else-if="descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              class="focus-brand mt-1 font-semibold text-light-link-text dark:text-dark-link-text"
              :aria-label="$t('components.card.about._global.reduce_text_aria_label')"
            >
              {{ $t("components.card.about._global.reduce_text") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </CardAbout>
</template>

<script setup lang="ts">
import CardAbout from "./CardAbout.vue";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchByID(id);

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

const modals = useModals();
const modalName = "ModalEditAboutEvent";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>
