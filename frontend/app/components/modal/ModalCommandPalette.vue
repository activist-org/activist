<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Here is a link to command palette resources: https://www.commandpalette.org/ -->
<template>
  <ModalBase @closeModal="closeCommandPalette" :modalName="modalName">
    <!-- MARK: Main element -->
    <div>
      <Combobox v-model="selectedCommand" as="div" class="flex flex-col w-6/7">
        <div
          class="my-[0.625rem] flex select-none items-center justify-between rounded-md bg-layer-2 px-2 py-1 text-left text-distinct-text transition duration-200 elem-shadow-sm focus-inside">
          <Icon class="my-1 ml-1 size-4 shrink-0" :name="IconMap.SEARCH" size="1em" />
          <!-- MARK: Search text input. -->
          <ComboboxInput ref="paletteInput" @change="searchTerm = $event.target.value"
            class="h-5 ml-1 w-full bg-transparent pl-1 focus:outline-none focus:ring-0"
            :placeholder="t('i18n._global.search')" />
        </div>
        <!-- MARK: Search results output. -->
        <ComboboxOptions v-if="searchTerm.length > 0 && filteredCommands.length > 0"
          class="max-h-40 overflow-y-auto pt-2">
          <!-- MARK: Individual search result/s. -->
          <ComboboxOption v-for="command in filteredCommands" :key="command.id" v-slot="{ active }" :value="command">
            <div :class="[
              'group relative flex items-center space-x-2 rounded-md p-4 cursor-pointer',
              active ? 'bg-highlight' : '',
            ]">
              <Icon :alt="t(`${command.displayName}`)" :name="IconMap[command.iconName as keyof typeof IconMap]"
                size="1em" />
              <div class="relative flex flex-grow justify-between pl-1">
                {{ t(`${command.displayName}`) }}
                <span class="link-text invisible w-16" :class="{ visible: active }">
                  {{ t("i18n.components.modal_command_palette.jump_to") }}
                </span>
              </div>
            </div>
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
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  paletteData: Command[];
}>();

const { t } = useI18n();

interface Command {
  id: number;
  path: string;
  iconName: string;
  displayName: string;
  action: () => void;
}

const modalName = "ModalCommandPalette";

const paletteInput = ref<typeof ComboboxInput | null>(null);
const searchTerm = ref("");
const selectedCommand = ref<Command | null>(null);
const filteredCommands = ref<Command[]>([]);

const router = useRouter();

const closeCommandPalette = () => {
  // Watch for closeModal emit and do cleanup when it happens.
  searchTerm.value = "";
};

watch(selectedCommand, (val) => {
  if (val) {
    router.push(`/${val.path}`);
  }
});

watch(searchTerm, (newVal) => {
  if (newVal.length > 0) {
    filteredCommands.value = props.paletteData.filter((dataItem) =>
      dataItem.displayName.toLowerCase().includes(newVal.toLowerCase())
    );
  } else {
    filteredCommands.value = [];
  }
});

onMounted(() => {
  nextTick(() => {
    paletteInput.value?.$el.focus()
  })
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
