// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Ref } from "vue";

/**
 * Composable for managing a sortable list of items in a Vue component. This composable provides functions to reindex the list and remove items by their index, ensuring that the order of the items is maintained correctly after any modifications. The reindex function updates the order field of each item in the list based on their current position, while the removeByIndex function removes an item from the list at a specified index and then calls reindex to update the order of the remaining items. This composable is designed to work with any list of items that have an order field, allowing for flexible sorting and management of lists in Vue components.
 * @param list A reactive reference to an array of items that are being managed as a sortable list. Each item in the list is expected to have an order field that determines its position in the list, which will be updated by the reindex function whenever items are added, removed, or reordered.
 * @param orderField An optional string parameter that specifies the name of the field in each item that represents its order in the list. If not provided, it defaults to "order". This field will be updated by the reindex function to reflect the current position of each item in the list after any modifications.
 * @returns An object containing the reindex and removeByIndex functions, which can be used to manage the order of items in the list and remove items by their index, respectively.
 */
export function useSortableList<T extends Record<string, unknown>>(
  list: Ref<T[]>,
  orderField = "order"
) {
  const reindex = () => {
    list.value.forEach((row, i) => {
      (row as Record<string, unknown>)[orderField] = i;
    });
  };

  const removeByIndex = (i: number) => {
    list.value.splice(i, 1);
    reindex();
  };

  return { reindex, removeByIndex };
}
