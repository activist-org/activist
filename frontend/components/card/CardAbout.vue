<template>
  <div class="card-style px-5 py-5">
    <div class="relative w-full flex-col">
      <ModalQRCodeBtn
        v-if="organization && !expandText"
        :organization="organization"
        type="icon"
      />
      <ModalQRCodeBtn v-if="group && !expandText" :group="group" type="icon" />
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
          <IconEdit @click="openModal()" @keydown.enter="openModal()" />
          <ModalEditPageText
            v-if="organization"
            @closeModal="handleCloseModal"
            :sectionsToEdit="[
              $t('_global.about'),
              // $t('components._global.get-involved'),
            ]"
            :textsToEdit="[organization.description]"
            :isOpen="modalIsOpen"
          />
          <ModalEditPageText
            v-if="event"
            @closeModal="handleCloseModal"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.participate'),
            ]"
            :textsToEdit="[event.description, event.getInvolvedDescription]"
            :isOpen="modalIsOpen"
          />
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
        <div v-else-if="group" class="flex-col space-y-3">
          <ShieldTopic :topic="group.topic" />
          <div class="flex items-center gap-3">
            <MetaTagLocation :location="group.location" />
            <MetaTagMembers
              :members="group.members"
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
              {{ group.description }}
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
        <div v-else-if="event" class="flex-col space-y-3">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
import ModalEditPageText from "../modal/ModalEditPageText.vue";

defineProps<{
  organization?: Organization;
  group?: Group;
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

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>
