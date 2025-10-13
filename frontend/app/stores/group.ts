// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Group } from "~/types/communities/group";
import type { ContentImage } from "~/types/content/file";

interface GroupStore {
  group: Group;
  groups: Group[];
}

export const useGroupStore = defineStore("group", {
  // MARK: Properties

  state: (): GroupStore => ({
    group: null as unknown as Group,

    groups: [],
  }),
  actions: {
    getGroup() {
      return this.group;
    },

    getGroups() {
      return this.groups;
    },

    setGroup(group: Group) {
      this.group = group;
    },
    setGroups(groups: Group[]) {
      this.groups = groups;
    },
    setGroupImages(images: ContentImage[]) {
      this.group.images = images;
    },
    clearGroupImages(id: string) {
      if (this.group.id === id) {
        this.group.images = [];
      }
    },
    clearGroup(id: string) {
      if (this.group.id === id) {
        this.group = null as unknown as Group;
      }
    },
    clearGroups() {
      this.groups = [];
    },
  },
});
