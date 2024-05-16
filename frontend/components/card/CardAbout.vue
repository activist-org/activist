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
        <Icon class="h-10 w-10" :name="IconMap.CIRCLE_X_FILL" />
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
            :name="organization.name"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.get-involved'),
              $t('components._global.join-organization-link'),
            ]"
            :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
            :isOpen="modalIsOpen"
          />
          <ModalEditPageText
            v-if="group"
            @closeModal="handleCloseModal"
            :name="group.name"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.get-involved'),
              $t('components._global.join-group-link'),
            ]"
            :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
            :isOpen="modalIsOpen"
          />
          <ModalEditPageText
            v-if="event"
            @closeModal="handleCloseModal"
            :sectionsToEdit="[
              $t('_global.about'),
              $t('components._global.participate'),
              $t('components._global.offer-to-help-link'),
            ]"
            :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
            :isOpen="modalIsOpen"
          />
        </div>
        <div v-if="organization" class="flex-col space-y-3">
          <!-- <div class="flex items-center gap-3">
            <ShieldTopic v-for="(t, i) in organization.topics" :key="i" :topic="t" />
          </div> -->
          <!-- <ShieldTopic :topic="organization.topic" /> -->
          <div class="flex items-center gap-3">
            <MetaTagLocation :location="organization.location" />
            <!-- <MetaTagMembers
              :members="organization.members.length"
              :label="$t('components._global.members_lower')"
            /> -->
          </div>
          <div>
            <p
              ref="description"
              :class="{
                'line-clamp-5': !expandText,
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
          <!-- <div class="flex items-center gap-3">
            <ShieldTopic v-for="(t, i) in group.topics" :key="i" :topic="t" />
          </div> -->
          <div class="flex items-center gap-3">
            <MetaTagLocation :location="group.location" />
            <!-- <MetaTagMembers
              :members="group.members.length"
              :label="$t('components._global.members_lower')"
            /> -->
          </div>
          <div>
            <p
              ref="description"
              :class="{
                'line-clamp-5': !expandText,
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
import {
  useDescriptionText,
  useGetInvolvedText,
  useGetInvolvedURL,
} from "~/composables/useAppPageTexts";
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import { IconMap } from "~/types/icon-map";
import type { Organization } from "~/types/organization";
import ModalEditPageText from "../modal/ModalEditPageText.vue";

const props = defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
}>();

const { descriptionText } = useDescriptionText(props);
const { getInvolvedText } = useGetInvolvedText(props);
const { getInvolvedURL } = useGetInvolvedURL(props);

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
