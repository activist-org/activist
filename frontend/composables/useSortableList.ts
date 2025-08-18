// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Ref } from "vue";

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
