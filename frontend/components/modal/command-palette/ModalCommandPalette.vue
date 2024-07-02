<!-- TODO: Search works, but it's pickiing up the literal values of 'displayName' (eg. "_global.home"). 
              Search should instead look through the rendered values. -->
<!-- TODO: Figure out how to usefully implement the 'action' elements in the paletteData objects (CommandPaletteData.js).
              Right now they're not used, and we have three different ways to navigate to a target path.
              Keep the 'action' thingies because some time in the future we can use them for actions other than just
                page navigation. 
-->
<!-- TODO: Find a way to use a single event handler to replace
              handleCommand
              handleClick
              handleEnter
-->
<!-- TODO: Sometimes router.push() loses the i18n part of the path (eg: /en/the.path.name)-->

<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <!-- MARK: Main element -->
    <div>
      <!-- TODO: There should be one, unifed way to handle selection, instead of 'handleCommand' here -->
      <Combobox v-model="selectedCommand" @change="handleCommand" as="div">
        <div
          class="focus-inside elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md bg-light-layer-2 px-2 py-1 text-left text-light-distinct-text transition duration-200 dark:bg-dark-layer-2 dark:text-dark-distinct-text"
        >
          <Icon :name="IconMap.SEARCH" size="1em" class="text-black" />
          <!-- MARK: Search text input. -->
          <!-- TODO: There should be one, unifed way to handle selection, instead of 'handleEnter' here -->
          <ComboboxInput
            @keydown.enter="handleEnter"
            @change="searchTerm = $event.target.value"
            class="h-9 w-full bg-transparent pl-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
            :placeholder="$t('_global.search')"
          />
        </div>
        <div v-if="searchTerm.length > 0">
          <span class="font-bold italic">Searching for:</span> {{ searchTerm }}
        </div>
        <!-- MARK: Search results output. -->
        <ComboboxOptions
          v-if="searchTerm.length > 0 && filteredCommands.length > 0"
          class="max-h-40 overflow-y-auto pt-2"
        >
          <!-- MARK: Individual search result/s. -->
          <!-- TODO: There should be one, unifed way to handle selection, instead of 'handleClick' here -->
          <ComboboxOption
            v-for="command in filteredCommands"
            @click="handleClick(command)"
            v-slot="{ active }"
            :key="command.id"
            :value="command"
            as="li"
          >
            <li
              :class="[
                'w-6/7 group relative flex items-center space-x-2 rounded-md py-1',
                active ? 'bg-light-highlight dark:bg-dark-highlight' : '',
              ]"
            >
              <Icon
                :name="IconMap[command.iconName as keyof typeof IconMap]"
                size="1em"
                :alt="$t(`${command.displayName}`)"
              />
              <div class="relative flex-grow pl-1">
                {{ $t(`${command.displayName}`) }}
                <span
                  class="link-text invisible absolute right-3 w-16"
                  :class="{ visible: active }"
                >
                  {{ $t("components.modal-command-palette.jump-to") }}
                </span>
              </div>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
        <div v-else-if="searchTerm.length > 0 && filteredCommands.length == 0">
          No results for: {{ searchTerm }}
        </div>
      </Combobox>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { useRouter } from "vue-router";

import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { ref, computed, watch, defineProps, defineEmits } from "vue";

// Define props with proper types
const props = defineProps<{
  isOpen: boolean;
  paletteData: Command[];
}>();

interface Command {
  id: number;
  path: string;
  iconName: string;
  displayName: string;
  action: () => void;
}

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);
const searchTerm = ref("");
const selectedCommand = ref<Command | null>(null);
const filteredCommands = ref<Command[]>([]);

const router = useRouter();
const emit = defineEmits(["closeModal"]);

// Handle modal close
const handleCloseModal = () => {
  searchTerm.value = "";
  emit("closeModal");
};

const handleClick = (command: Command) => {
  router.push(`/${command.path}`);
};

// Handle Enter key press
const handleEnter = () => {
  if (selectedCommand.value) {
    // selectedCommand.value.action();
    router.push(`/${selectedCommand.value.path}`);
    emit("closeModal");
  }
};

// Handle command selection
// const handleCommand = (command: Command) => {
const handleCommand = () => {
  if (selectedCommand.value) {
    // if (command && typeof command.action === "function") {
    //   command.action();
    //   emit("closeModal");
    // } else {
    //   console.error(
    //     "Command action is not a function or command is null",
    //     command
    //   );
    // }
    router.push(`/${selectedCommand.value.path}`);
    emit("closeModal");
  }
};

watch(searchTerm, (newVal) => {
  if (newVal.length > 0) {
    filteredCommands.value = props.paletteData.filter((dataItem) =>
      dataItem.displayName.toLowerCase().includes(newVal.toLowerCase())
    );
  } else {
    filteredCommands.value = [];
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
