<!-- TODO: Search works, but it's picking up the literal values of 'displayName' (eg. "_global.home").
              Search should instead look through the rendered values. -->
<!-- TODO: Figure out how to usefully implement the 'action' elements in the commandPaletteData objects (command-palette.ts).
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
<!-- TODO: Get @click on ComboboxOption elements to work. Right now only handleEnter works. It looks like the @click event handler
              on the ComboboxOption elements doesn't get rendered. It doesn't appear when 'inspecting' the element/s in the browser. -->

<!-- Here is a link to command palette resources: https://www.commandpalette.org/ -->

<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
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
          <!-- TODO: There should be one, unified way to handle selection, instead of 'handleClick' here -->
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
                  {{ $t("components.modal_command_palette.jump_to") }}
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
import { useRouter } from "vue-router";
import { IconMap } from "~/types/icon-map";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";

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

const modals = useModals();
const modalName = "ModalCommandPalette";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const searchTerm = ref("");
const selectedCommand = ref<Command | null>(null);
const filteredCommands = ref<Command[]>([]);

const router = useRouter();

const handleCloseModal = () => {
  searchTerm.value = "";
  modals.closeModal(modalName);
};

const handleClick = (command: Command) => {
  router.push(`/${command.path}`);
};

const handleEnter = () => {
  if (selectedCommand.value) {
    // selectedCommand.value.action();
    router.push(`/${selectedCommand.value.path}`);
  }
};

// Handle command selection. Combobox @change event handler. Handles selected ComboBoxOption.
// const handleCommand = (command: Command) => {
const handleCommand = () => {
  if (selectedCommand.value) {
    // if (command && typeof command.action === "function") {
    //   command.action();
    // } else {
    //   console.error(
    //     "Command action is not a function or command is null",
    //     command
    //   );
    // }
    router.push(`/${selectedCommand.value.path}`);
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
