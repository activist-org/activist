// SPDX-License-Identifier: AGPL-3.0-or-later
export function useDraggableKeyboardNavigation<
  T extends Record<string, unknown>,
>(
  list: Ref<T[]>,
  reorderCallback: (list: T[]) => Promise<void>,
  elementList: Ref<(HTMLElement | null)[]>,
  orderField = "order"
) {
  const selectedIndex = ref<number | null>(null);

  /**
   * Handles focus event on a list item
   * @param {number} index - Index of the focused item
   */
  async function onFocus(index: number) {
    selectedIndex.value = index;
  }

  /**
   * Moves the currently selected item up in the list
   * @param {number} index - Current index (unused but kept for API consistency)
   */
  async function moveUp() {
    if (selectedIndex.value === null || selectedIndex.value === 0) return;

    const i = selectedIndex.value;

    // Swap items in array
    [list.value[i], list.value[i - 1]] = [list.value[i - 1]!, list.value[i]!];

    // Recalculate all orders based on array positions
    list.value.forEach((item, index) => {
      (item as Record<string, unknown>)[orderField] = index;
    });

    selectedIndex.value--;

    await reorderCallback(list.value);

    // Focus the moved item after DOM update
    await nextTick();
    elementList.value[selectedIndex.value]?.focus();
  }

  /**
   * Moves the currently selected item down in the list
   * @param {number} index - Current index (unused but kept for API consistency)
   */
  async function moveDown() {
    if (
      selectedIndex.value === null ||
      selectedIndex.value === list.value.length - 1
    )
      return;

    const i = selectedIndex.value;

    // Swap items in array
    [list.value[i], list.value[i + 1]] = [list.value[i + 1]!, list.value[i]!];

    // Recalculate all orders based on array positions
    list.value.forEach((item, index) => {
      (item as Record<string, unknown>)[orderField] = index;
    });

    selectedIndex.value++;

    await reorderCallback(list.value);

    // Focus the moved item after DOM update
    await nextTick();
    elementList.value[selectedIndex.value]?.focus();
  }

  return {
    selectedIndex,
    onFocus,
    moveUp,
    moveDown,
  };
}
