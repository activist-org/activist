<template>
  <!-- TODO: Transition / animation? Maybe do this in ModalBase? -->
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <!-- MARK: Search Box -->
    <div
      class="focus-inside elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md bg-light-layer-2 px-2 py-1 text-left text-light-distinct-text transition duration-200 dark:bg-dark-layer-2 dark:text-dark-distinct-text"
    >
      <div class="flex items-center space-x-2">
        <Icon :name="IconMap.SEARCH" size="1em" />
        <label for="search-input" class="sr-only">{{
          $t("_global.search")
        }}</label>
        <!-- TODO: Figure out if/why we need the ref="input" attrib. -->
        <!-- TODO: Add cancel functionality inside of input box. -->
        <input
          v-model="searchTerm"
          ref="input"
          id="search-input"
          class="bg-transparent outline-none"
          type="text"
          size="100"
          :placeholder="$t('_global.search')"
        />
      </div>
    </div>
    <!-- MARK: Search Results -->
    <!-- TODO: <CommandPaletteSearchResults results='searchResults' />. -->
    <div v-if="searchTerm != ''">searchTerm: {{ searchTerm }}</div>
    <!-- useFuse() goes here -->

    <div class="max-h-[30rem] overflow-y-auto">
      <!-- MARK: Pages -->
      <DialogTitle class="mt-5 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components.modal-command-palette.pages-header") }}
        </p>
      </DialogTitle>
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="home"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="upcoming-events"
      />
      <!-- Don't have notifications yet. -->
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="notifications"
      />
      <!-- Don't have discussions yet. -->
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="discussions"
      />

      <!-- MARK: Organizations -->
      <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components._global.organizations") }}
        </p>
      </DialogTitle>
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />

      <!-- MARK: Resources -->
      <!-- TODO: Enable this when we have a better idea of what resources. -->
      <!-- <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("_global.resources") }}
        </p>
      </DialogTitle>
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      /> -->

      <!-- MARK: Events -->
      <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("_global.events") }}
        </p>
      </DialogTitle>
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="events"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="events"
      />
      <ModalCommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="events"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";
import { IconMap } from "~/types/icon-map";

// TODO: maybe get rid of isOpen, modalIsOpen and modalShouldClose, since all we really
// need is the 'closeModal' emit in 'handleCloseModal'.
const props = defineProps<{
  isOpen: boolean;
  modalName: string;
}>();

const localePath = useLocalePath();

const modals = useModals();
const modalName = props.modalName;
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

function handleCloseModal() {
  modals.closeModal(modalName);
}

const searchTerm = ref("");
// const searchResults = []

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  emit("closeModal");
};

// Watch the searchTerm ref variable.
watch(searchTerm, (newVal) => {
  console.log("searchTerm changed: " + newVal);

  // TODO: Filter items based on selected filters.
  // Create fake data to demo basic search functionality/
});
</script>
