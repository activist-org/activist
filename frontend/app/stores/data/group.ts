// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

import { createImageStore } from "../factories/images";
import { createPaginationStore } from "../factories/pagination";

// MARK: List Store

export const useGroupListStore = createPaginationStore<Group, GroupFilters>(
  "group-list"
);

// MARK: Image Store

export const useGroupImageStore = createImageStore("group-images");

// MARK: Entity Store

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
