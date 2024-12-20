<template>
  <CardAbout>
    <ModalQRCodeBtn v-if="group && !expandText" :group="group" type="icon" />
    <button
      v-if="expandText"
      @click="
        emit('expand-reduce-text');
        expand_reduce_text();
      "
      class="focus-brand absolute right-0 rounded-full p-1 text-distinct-text hover:text-primary-text"
    >
      <Icon class="h-10 w-10" :name="IconMap.CIRCLE_X_FILL" />
    </button>
    <div class="flex-col space-y-3">
      <div class="flex items-center gap-5">
        <h3 class="responsive-h3 text-left font-display">
          {{ $t("_global.about") }}
        </h3>
        <IconEdit
          @click="openModalEditTextGroup()"
          @keydown.enter="openModalEditTextGroup()"
        />
      </div>
      <div class="flex-col space-y-3">
        <!-- <div class="flex items-center gap-3">
            <ShieldTopic v-for="(t, i) in group.topics" :key="i" :topic="t" />
          </div> -->
        <div class="flex items-center gap-3">
          <MetaTagLocation
            :location="group.location.displayName.split(',')[0]"
          />
          <!-- <MetaTagMembers
              :members="group.members.length"
              :label="$t('components.card.about._global.members_lower')"
            /> -->
        </div>
        <div>
          <p
            ref="description"
            :class="{
              'line-clamp-5': !expandText,
            }"
          >
            {{ group.texts.description }}
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
                $t('components.card.about._global.full_text_aria_label')
              "
            >
              {{ $t("components.card.about._global.full_text") }}
            </button>
            <button
              v-else-if="descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              class="focus-brand mt-1 font-semibold text-link-text"
              :aria-label="
                $t('components.card.about._global.reduce_text_aria_label')
              "
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
import { useModalHandlers } from "~/composables/useModalHandlers";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalEditTextGroup } =
  useModalHandlers("ModalEditTextGroup");

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(id);

const { group } = groupStore;

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
