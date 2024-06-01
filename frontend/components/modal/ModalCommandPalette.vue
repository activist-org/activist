<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <!-- SEARCH BOX -->
    <div
      class="focus-inside elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md bg-light-layer-2 px-2 py-1 text-left text-light-distinct-text transition duration-200 dark:bg-dark-layer-2 dark:text-dark-distinct-text"
    >
      <div class="flex items-center space-x-2 pl-1">
        <Icon :name="IconMap.SEARCH" size="1em" />
        <label for="search-input" class="sr-only">{{
          $t("_global.search")
        }}</label>
        <!-- TODO: figure out if/why we need the ref="input" attrib  -->
        <!-- TODO: add cancel functionality inside of input box -->
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

    <!-- SEARCH RESULTS -->
    <!-- TODO: <CommandPaletteSearchResults results='searchResults' /> -->
    <div v-if="searchTerm != ''">searchTerm: {{ searchTerm }}</div>

    <!-- DISPLAY ITEMS -->
    <div class="max-h-[30rem] overflow-scroll">
      <!-- PAGES -->
      <DialogTitle class="mt-5 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components.modal-command-palette.pages-header") }}
        </p>
      </DialogTitle>
      <CommandPaletteItem @itemClicked="handleCloseModal" itemType="home" />
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="upcoming-events"
      />
      <!-- don't have notifications yet -->
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="notifications"
      />
      <!-- don't have discussions yet -->
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="discussions"
      />

      <!-- ORGANIZATIONS -->
      <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components._global.organizations") }}
        </p>
      </DialogTitle>
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="organizations"
      />

      <!-- RESOURCES -->
      <!-- TODO: enable this when we have a better idea of what resources -->
      <!-- <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("_global.resources") }}
        </p>
      </DialogTitle>
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      />
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      />
      <CommandPaletteItem
        @itemClicked="handleCloseModal"
        itemType="resources"
      /> -->

      <!-- EVENTS -->
      <DialogTitle class="mt-3 flex justify-between font-display">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("_global.events") }}
        </p>
      </DialogTitle>
      <CommandPaletteItem @itemClicked="handleCloseModal" itemType="events" />
      <CommandPaletteItem @itemClicked="handleCloseModal" itemType="events" />
      <CommandPaletteItem @itemClicked="handleCloseModal" itemType="events" />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { DialogTitle } from "@headlessui/vue";

// TODO: maybe get rid of isOpen, modalIsOpen and modalShouldClose, since all we really
//  need is the 'closeModal' emit in 'handleCloseModal'
const props = defineProps<{
  isOpen: boolean;
}>();
const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const searchTerm = ref("");
// const searchResults = []

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  emit("closeModal");
};

// Watch the searchTerm ref variable
watch(searchTerm, (newVal) => {
  console.log("searchTerm changed: " + newVal);

  // TODO: Filter items based on selected filters.
  //    create fake data to demo basic search functionality
});
</script>
