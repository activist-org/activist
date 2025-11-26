<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div id="topics-dropdown" class="z-10 flex">
    <Combobox v-model="selectedTopics" multiple>
      <div class="relative">
        <div
          class="relative flex w-full cursor-default overflow-hidden rounded-lg elem-shadow-sm focus-brand"
        >
          <ComboboxInput
            @blur="inputFocussed = false"
            @change="query = $event.target.value"
            @click="inputFocussed = true"
            @focus="handleInputFocus"
            @keyup.enter="inputFocussed = false"
            :aria-label="$t('i18n.components.combobox_topics.filter_by_topic')"
            class="style-cta rounded-lg border py-2 pl-4 selection:bg-highlight dark:selection:bg-white/20"
            :displayValue="displayValueHandler"
            :placeholder="$t('i18n.components.combobox_topics.filter_by_topic')"
          />
          <ComboboxButton
            :aria-label="$t('i18n.components.combobox_topics.toggle_dropdown')"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text dark:text-cta-orange"
          >
            <Icon :name="IconMap.CHEVRON_EXPAND" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          @after-leave="query = ''"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions
            id="isVisibleElement"
            class="elem-shadow-lg absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-layer-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
            data-testid="topics-dropdown-options"
            role="listbox"
          >
            <div
              v-if="filteredTopics.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-distinct-text"
            >
              {{ $t("i18n.components.combobox_topics.no_matching_topics") }}
            </div>
            <ComboboxOption
              v-for="topic in filteredTopics"
              :key="topic.id"
              v-slot="{ selected, active }"
              @click="inputFocussed = false"
              as="template"
              :value="topic"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-cta-orange/80 text-primary-text dark:bg-cta-orange/40 dark:text-cta-orange':
                    active,
                  'text-primary-text': !active,
                }"
                data-testid="topics-dropdown-option"
                role="option"
              >
                <span class="block truncate">
                  {{ $t(topic.label) }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{
                    'text-primary-text dark:text-cta-orange': active,
                    'text-cta-orange dark:text-cta-orange': !active,
                  }"
                >
                  <Icon :name="IconMap.CHECK" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from "@headlessui/vue";

const props = defineProps<{
  receivedSelectedTopics?: TopicEnum[];
}>();
const { t } = useI18n();

const { data: topics } = useGetTopics();

const options = ref<{ label: string; value: TopicEnum; id: string }[]>([]);
options.value = topics.value.map((topic: Topic) => ({
  label: t(GLOBAL_TOPICS.find((t) => t.topic === topic.type)?.label || ""),
  value: topic.type as TopicEnum,
  id: topic.id,
}));
const emit = defineEmits<{
  (e: "update:selectedTopics", value: TopicEnum[]): void;
}>();

const selectedTopics = ref<{ label: string; value: TopicEnum; id: string }[]>(
  []
);

// Flag to prevent emitting when updating from props
const isUpdatingFromProps = ref(false);

watch(
  () => props.receivedSelectedTopics,
  (newVal) => {
    // Set flag to prevent emission during prop update
    isUpdatingFromProps.value = true;
    selectedTopics.value = options.value.filter((option) =>
      newVal?.includes(option.value)
    );
    // Clear flag after update completes
    nextTick(() => {
      isUpdatingFromProps.value = false;
    });
  },
  { immediate: true }
);

// Re-sort options when selectedTopics changes to keep selected items on top.
watch(
  selectedTopics,
  (newVal) => {
    options.value = options.value.sort((a, b) => {
      const aSelected = newVal.some(
        (selected: { label: string; value: TopicEnum; id: string }) =>
          selected.value === a.value
      );
      const bSelected = newVal.some(
        (selected: { label: string; value: TopicEnum; id: string }) =>
          selected.value === b.value
      );

      if (aSelected && !bSelected) {
        return -1;
      }
      if (!aSelected && bSelected) {
        return 1;
      } else {
        return 0;
      }
    });
    // Only emit if this change came from user interaction, not from prop update
    if (!isUpdatingFromProps.value) {
      // Emit only the values of the selected topics.
      emit(
        "update:selectedTopics",
        options.value
          .filter((option) =>
            newVal.some(
              (selected: { label: string; value: TopicEnum; id: string }) =>
                selected.value === option.value
            )
          )
          .map((option) => option.value)
      );
    }
  },
  { immediate: true, deep: true }
);
const query = ref("");
const inputFocussed = ref(false);

const filteredTopics = computed(() =>
  query.value === ""
    ? options.value
    : options.value.filter((topic) =>
        topic.label
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

function displayValue(): string {
  if (inputFocussed.value) {
    return "";
  } else {
    return t("i18n.components.combobox_topics.filter_by_topic");
  }
  return "";
}

const displayValueHandler = () => {
  return t(displayValue());
};

function handleInputFocus(e: Event) {
  // A timeout to make sure the dropdown exist before checking.
  setTimeout(() => {
    const isVisible = document.getElementById("isVisibleElement")?.offsetParent;

    // If the dropdown does not exist, click on the input to trigger it.
    if (!isVisible) {
      const target = e.target as HTMLElement;
      target?.click();
    }
  }, 100);
}
</script>
