// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createImageStore } from "../factories/images";
import { createPaginationStore } from "../factories/pagination";

// 1. The List/Pagination Store
export const useGroupListStore = createPaginationStore<Group, GroupFilters>(
  "group-list"
);

// 2. The Images Store
export const useGroupImageStore = createImageStore("group-images");

// 3. The Core Entity Store (Now it only cares about the single active group)
export const useGroupStore = defineStore("group", {
  state: () => ({
    group: null as unknown as Group,
  }),
  actions: {
    getGroup() {
      return this.group;
    },
    setGroup(group: Group) {
      this.group = group;
    },
  },
});
