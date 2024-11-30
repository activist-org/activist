<template>
  <div class="card-style flex flex-col px-3 py-4 md:px-5">
    <div class="relative flex w-full flex-col">
      <!-- Header with Tabs -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Filter</h2>
        <div class="inline-flex overflow-hidden rounded-lg border border-primary-text">
          <button
            v-for="(tab, index) in tabs"
            @click="activeTab = tab.id"
            :key="tab.id"
            :class="[
              'px-4 py-2',
              activeTab === tab.id ? 'bg-cta-orange text-primary-text' : 'bg-[#C8C8C8] text-primary-text hover:bg-[#C8C8C8]/70',
              index !== tabs.length - 1 ? 'border-r border-primary-text' : ''
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Search Input -->
      <div class="elem-shadow-sm flex select-none items-center justify-between rounded-md bg-layer-2 py-1 pl-[12px] text-left text-distinct-text transition duration-200 focus-within:mb-[-3px] focus-within:border-2 focus-within:border-link-text">
        <div class="flex flex-1 items-center space-x-2 pl-1">
          <Icon
            class="my-1 h-4 w-4 flex-shrink-0"
            :name="IconMap.SEARCH"
            size="1em"
          />
          <div class="flex-1 min-w-0">
            <label for="input-search" class="sr-only">{{ "Search to filter" }}</label>
            <input
              v-model="searchQuery"
              @focus="onFocus"
              @blur="onFocusLost"
              ref="input"
              id="input-search"
              class="w-full bg-transparent outline-none py-2 text-ellipsis"
              type="text"
              placeholder="Search to filter"
            />
          </div>
        </div>
        <div
          ref="hotkeyIndicators"
          class="flex-shrink-0 transition-duration-200 flex space-x-1 pr-1 transition-opacity"
        >
          <div class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text">
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('components._global.slash_tooltip_label')"
            />
            <p class="-mt-[0.075rem]">/</p>
          </div>
          <div
            v-if="isMacOS"
            class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text"
          >
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('components._global.command_tooltip_label')"
            />
            <p>⌘k</p>
          </div>
          <div
            v-else
            class="has-tooltip flex rounded-md bg-highlight px-2 py-[0.125rem] text-center text-sm text-distinct-text"
          >
            <TooltipBase
              class="invisible -mt-8"
              :text="$t('components._global.control_tooltip_label')"
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
        <h3 class="flex items-center gap-2 mb-3">
          <span class="flex items-center font-redhat text-[22px] font-[600] leading-[29.11px]">
            {{ section.title }}
            <Icon
              v-if="section.icon"
              :name="section.icon"
              class="h-4 w-4 text-primary-text ml-2"
            />
          </span>
        </h3>
        <div class="flex flex-wrap gap-2">
          <BtnTag
            v-for="tag in section.tags"
            @click="toggleTag(tag)"
            @keydown.enter="toggleTag(tag)"
            :key="tag.id"
            class="flex max-h-[40px]"
            :cta="tag.selected"
            :label="tag.name"
            fontSize="sm"
            :ariaLabel="$t(tag.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMagicKeys, whenever } from "@vueuse/core";
import { IconMap } from "~/types/icon-map";

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
}>()

const { isMacOS } = useDevice();

const searchQuery = ref('')
const input = ref();
const hotkeyIndicators = ref();
const isInputFocused = ref(false);

const { slash } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "/" && e.type === "keydown") e.preventDefault();
  },
});

whenever(slash, () => {
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
  'filter-change': [{
    search: string,
    activeTab: string,
    selectedTags: number[],
  }]
}>()

const toggleTag = (tag: Tag) => {
  tag.selected = !tag.selected
  emitChange()
}

const emitChange = () => {
  emit('filter-change', {
    search: searchQuery.value,
    activeTab: activeTab.value,
    selectedTags: props.sections[0].tags.filter(t => t.selected).map(t => t.id)
  })
}

watch(searchQuery, () => {
  emitChange()
})

const activeTab = ref(props.tabs[0]?.id || '')

watch(activeTab, () => {
  emitChange()
})
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
