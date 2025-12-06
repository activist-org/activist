// SPDX-License-Identifier: AGPL-3.0-or-later
interface GroupStore {
  group: Group;
  groups: Group[];
  images: ContentImage[];
}

export const useGroupStore = defineStore("group", {
  // MARK: Properties

  state: (): GroupStore => ({
    group: null as unknown as Group,
    groups: [],
    images: [],
  }),
  actions: {
    getGroup() {
      return this.group;
    },

    getGroups() {
      return this.groups;
    },

    getGroupImages() {
      return this.images;
    },

    setGroup(group: Group) {
      this.group = group;
    },

    setGroups(groups: Group[]) {
      this.groups = groups;
    },

    setGroupImages(images: ContentImage[]) {
      this.images = images;
    },

    clearGroupImages(id: string) {
      if (this.group.id === id) {
        this.images = [];
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
