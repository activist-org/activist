<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex flex-col px-3 py-4 md:px-5">
    <div class="relative flex w-full flex-col">
      <!-- Note: Header with Tabs -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-semibold">
          {{ $t("i18n.components.page_filter.filter") }}
        </h2>
        <div
          class="inline-flex overflow-hidden rounded-lg border border-primary-text"
        >
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2',
              activeTab === tab.id
                ? 'bg-cta-orange text-primary-text'
                : 'bg-[#C8C8C8] text-primary-text hover:bg-[#C8C8C8]/70',
              index !== tabs.length - 1 ? 'border-r border-primary-text' : '',
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
      <!-- Note: Search Input -->
      <div
        class="flex select-none items-center justify-between rounded-md bg-layer-2 py-1 pl-3 text-left text-distinct-text transition duration-200 elem-shadow-sm focus-within:mb-[-3px] focus-within:border-2 focus-within:border-link-text"
      >
        <div class="flex flex-1 items-center space-x-2 pl-1">
          <Icon
            class="my-1 h-4 w-4 shrink-0"
            :name="IconMap.SEARCH"
            size="1em"
          />
          <div class="min-w-0 flex-1">
            <label class="sr-only" for="input-search">
              {{ $t("i18n.components.page_filter.search_to_filer") }}
            </label>
            <input
              id="input-search"
              ref="input"
              v-model="searchQuery"
              @blur="onFocusLost"
              @focus="onFocus"
              class="w-full text-ellipsis bg-transparent py-2 outline-none"
              :placeholder="$t('i18n.components.page_filter.search_to_filer')"
              type="text"
            />
          </div>
        </div>
        <div
          ref="hotkeyIndicators"
          class="transition-duration-200 flex shrink-0 space-x-1 pr-1 transition-opacity"
        >
          <div
            class="has-tooltip flex rounded-md bg-highlight px-2 py-0.5 text-center text-sm text-distinct-text"
          >
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('i18n.components._global.slash_tooltip_label')"
            />
            <p class="-mt-[0.075rem]">
              <!-- Preserve line break. -->
              /
            </p>
          </div>
          <div
            v-if="isMacOS"
            class="has-tooltip flex rounded-md bg-highlight px-2 py-0.5 text-center text-sm text-distinct-text"
          >
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('i18n.components._global.command_tooltip_label')"
            />
            <p>⌘k</p>
          </div>
          <div
            v-else
            class="has-tooltip flex rounded-md bg-highlight px-2 py-0.5 text-center text-sm text-distinct-text"
          >
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('i18n.components._global.control_tooltip_label')"
            />
            <p>⌃k</p>
          </div>
        </div>
      </div>
      <!-- Tag Sections -->
      <div
        v-for="(section, sectionIndex) in sections"
        :key="sectionIndex"
        class="mt-4"
      >
        <h3 class="mb-3 flex items-center gap-2">
          <span
            class="font-redhat flex items-center text-[22px] font-semibold leading-[29.11px]"
          >
            {{ section.title }}
            <Icon
              v-if="section.icon"
              class="ml-2 h-4 w-4 text-primary-text"
              :name="section.icon"
            />
          </span>
        </h3>
        <!-- <GridFilterTags :tags="['Berlin', 'Activism', 'Eco']" class="mt-3" /> -->
        <div class="flex flex-wrap gap-2">
          <BtnTag
            v-for="tag in section.tags"
            :key="tag.id"
            @click="toggleTag(tag)"
            @keydown.enter="toggleTag(tag)"
            :ariaLabel="$t(tag.name)"
            class="flex max-h-10"
            :cta="tag.selected"
            fontSize="sm"
            :label="tag.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";

interface Tag {
  id: number;
  name: string;
  selected: boolean;
}

interface TagSection {
  title: string;
  tags: Tag[];
  icon?: string;
}

interface Tab {
  id: string;
  name: string;
}

const props = defineProps<{
  sections: TagSection[];
  tabs: Tab[];
}>();

const { isMacOS } = useDevice();

const searchQuery = ref("");
const input = ref();
const hotkeyIndicators = ref();
const isInputFocused = ref(false);

const { slash } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "/" && e.type === "keydown") e.preventDefault();
  },
});

whenever(slash ?? ref(false), () => {
  setTimeout(() => {
    if (input.value) {
      input.value.focus();
    }
  }, 0);
});

const onFocus = () => {
  hotkeyIndicators.value.classList.add("hide");
  setTimeout(() => {
    isInputFocused.value = true;
    hotkeyIndicators.value.classList.add("hidden");
  }, 200);
};

const onFocusLost = () => {
  hotkeyIndicators.value.classList.remove("hidden");
  isInputFocused.value = false;
  setTimeout(() => {
    hotkeyIndicators.value.classList.remove("hide");
  }, 200);
};

const emit = defineEmits<{
  "filter-change": [
    {
      search: string;
      activeTab: string;
      selectedTags: number[];
    },
  ];
}>();

const toggleTag = (tag: Tag) => {
  tag.selected = !tag.selected;
  emitChange();
};

const emitChange = () => {
  emit("filter-change", {
    search: searchQuery.value,
    activeTab: activeTab.value,
    selectedTags:
      props.sections[0]?.tags.filter((t) => t.selected).map((t) => t.id) || [],
  });
};

watch(searchQuery, () => {
  emitChange();
});

const activeTab = ref(props.tabs[0]?.id || "");

watch(activeTab, () => {
  emitChange();
});
</script>

<style scoped>
.hide {
  opacity: 0;
}

.search-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.125s;
}

.search-leave-active {
  transition: opacity 0.25s ease;
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
}

.search-enter-from {
  transition-delay: 0.25s;
}

.shortcuts-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.375s;
}

.shortcuts-leave-active {
  transition: opacity 0.125s ease;
}

.shortcuts-enter-from,
.shortcuts-leave-to {
  opacity: 0;
}
</style>
