<!-- use https://www.youtube.com/watch?v=-jix4KyxLuQ as reference. -->

<template>
  <!-- TODO: transition / animation? Maybe do this in ModalBase? -->
  <!-- TODO: ComboboxOption doesn't jumpTo the target link when Enter key is pressed.
                @click on NuxtLink works, but @keypress.enter doesn't.
                It looks like the Enter key event is already handled somewhere in the 
                  ComboboxInput element, but where ever this is handled, it doesn't
                  jump to the target link.
                Something like:
                  @keypress.enter.stop.prevent="handleEnterKey"
                Tried setting @keypress.enter on different components (CB, CB.OptionItem, the div before NuxtLink, etc), 
                  but none of them work.
   -->
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <Combobox as="div" class="space-x-2 divide-y divide-gray-400">
      <div
        class="focus-inside elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md bg-light-layer-2 px-2 py-1 text-left text-light-distinct-text transition duration-200 dark:bg-dark-layer-2 dark:text-dark-distinct-text"
      >
        <Icon :name="IconMap.SEARCH" size="1em" class="text-black" />
        <ComboboxInput
          @change="searchTerm = $event.target.value"
          class="h-9 w-full bg-transparent pl-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
          :placeholder="$t('_global.search')"
        />
      </div>
      <ComboboxOptions
        v-show="searchResults.length > 0"
        static
        class="max-h-40 overflow-y-auto pt-2"
      >
        <ComboboxOption
          v-for="data in searchResults"
          :key="data.id"
          v-slot="{ active }"
          :value="data.path"
          as="template"
        >
          <div
            :class="[
              'w-6/7 group relative flex items-center space-x-2 rounded-md  py-1',
              active ? 'bg-light-highlight dark:bg-dark-highlight' : '',
            ]"
          >
            <!-- TODO: enable Enter key / @keydown.enter="handleKeydownEnter" / usw -->
            <NuxtLink
              @click="handleCloseModal"
              class="flex w-full items-center"
              :to="localePath(`/${data.path}`)"
            >
              <Icon
                :name="IconMap[data.iconName as keyof typeof IconMap]"
                size="1em"
                :alt="$t(`_global.${data.displayName}`)"
              />
              <div class="relative flex-grow pl-1">
                {{ $t(`_global.${data.displayName}`) }}
                <span
                  class="link-text invisible absolute right-3 w-16"
                  :class="{ visible: active }"
                >
                  {{ $t("components.modal-command-palette.jump-to") }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>
  </ModalBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

const localePath = useLocalePath();

interface PaletteDataItem {
  id: number;
  category: string;
  path: string;
  iconName: string;
  displayName: string;
}

const props = defineProps<{
  isOpen: boolean;
  paletteData: PaletteDataItem[];
}>();
// TODO: maybe get rid of isOpen, modalIsOpen and modalShouldClose, since all we really
//  need is the 'closeModal' emit in 'handleCloseModal'
const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const searchTerm = ref("");
const searchResults = ref<PaletteDataItem[]>([]);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  searchTerm.value = "";
  searchResults.value = [];
  emit("closeModal");
};
// Watch the searchTerm ref variable
// TODO: Filter paletteData with useFuse, for fuzzy matching, instead of JS .filter()
// https://github.com/vueuse/vueuse/blob/main/packages/integrations/useFuse/demo.vue
watch(searchTerm, (newVal) => {
  if (newVal.length > 0) {
    searchResults.value = props.paletteData.filter((dataItem) =>
      dataItem.category.toLowerCase().includes(newVal.toLowerCase())
    );
  } else {
    searchResults.value = [];
  }
});
</script>

<style scoped>
.link-text.visible {
  visibility: visible !important;
}

.link-text.invisible {
  visibility: hidden;
}
</style>
