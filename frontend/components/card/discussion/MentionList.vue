<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="relative flex flex-col gap-0.5 overflow-auto rounded-lg border border-gray-200 bg-white p-2 shadow-md"
  >
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        @click="selectItem(index)"
        :key="index"
        :class="{
          'is-selected rounded-lg bg-gray-50': index === selectedIndex,
        }"
        class="flex w-full items-center gap-1 bg-transparent text-left hover:bg-gray-200 [&.is-selected]:bg-gray-300 hover:[&.is-selected]:bg-gray-400"
      >
        <div class="px-1 py-0.5">
          {{ item }}
        </div>
      </button>
    </template>
    <div v-else class="item">No result</div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === "ArrowUp") {
        this.upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        this.downHandler();
        return true;
      }

      if (event.key === "Enter") {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length;
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler() {
      this.selectItem(this.selectedIndex);
    },

    selectItem(index) {
      const item = this.items[index];

      if (item) {
        this.command({ id: item });
      }
    },
  },
};
</script>
