<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Here is a link to command palette resources: https://www.commandpalette.org/ -->

<template>
  <ModalBase @closeModal="closeCommandPalette" :modalName="modalName">
    <!-- MARK: Main element -->
    <div>
      <Combobox v-model="selectedCommand" @change="handleCommand" as="div">
        <div
          class="focus-inside elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md bg-layer-2 px-2 py-1 text-left text-distinct-text transition duration-200"
        >
          <Icon :name="IconMap.SEARCH" size="1em" class="text-black" />
          <!-- MARK: Search text input. -->
          <ComboboxInput
            @keydown.enter="handleEnter"
            @change="searchTerm = $event.target.value"
            class="h-9 w-full bg-transparent pl-1 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
            :placeholder="$t('_global.search')"
          />
        </div>
        <div v-if="searchTerm.length > 0 && filteredCommands.length > 0">
          <span class="font-bold italic">Searching for:</span> {{ searchTerm }}
        </div>
        <!-- MARK: Search results output. -->
        <ComboboxOptions
          v-if="searchTerm.length > 0 && filteredCommands.length > 0"
          class="max-h-40 overflow-y-auto pt-2"
        >
          <!-- MARK: Individual search result/s. -->
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
                active ? 'bg-highlight' : '',
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
  paletteData: Command[];
}>();

interface Command {
  id: number;
  path: string;
  iconName: string;
  displayName: string;
  action: () => void;
}

const modalName = "ModalCommandPalette";

const searchTerm = ref("");
const selectedCommand = ref<Command | null>(null);
const filteredCommands = ref<Command[]>([]);

const router = useRouter();

const closeCommandPalette = () => {
  // Watch for closeModal emit and do cleanup when it happens.
  searchTerm.value = "";
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
