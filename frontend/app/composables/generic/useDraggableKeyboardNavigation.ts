// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for managing keyboard navigation in a draggable list of items in a Vue component. This composable provides functions to handle focus events and move items up or down in the list using the keyboard. The onFocus function updates the selected index when an item is focused, while the moveUp and moveDown functions swap items in the list and update their order based on their current position. After moving an item, the composable calls a provided reorderCallback function to perform any necessary actions after reordering, such as saving the new order to a server. The composable also ensures that the moved item remains focused after the DOM updates to reflect the changes.
 * @param list A reactive reference to an array of items that are being managed as a draggable list. Each item in the list is expected to have an order field that determines its position in the list, which will be updated by the moveUp and moveDown functions whenever items are moved.
 * @param reorderCallback A callback function that is called after an item is moved up or down in the list. This function receives the updated list of items as an argument and can be used to perform any necessary actions after reordering, such as saving the new order to a server.
 * @param elementList A reactive reference to an array of HTML elements corresponding to the items in the list. This is used to manage focus on the items after they are moved, ensuring that the correct item remains focused after the DOM updates.
 * @param orderField An optional string parameter that specifies the name of the field in each item that represents its order in the list. If not provided, it defaults to "order". This field will be updated by the moveUp and moveDown functions to reflect the current position of each item in the list after they are moved.
 * @returns An object containing the selectedIndex, onFocus, moveUp, and moveDown properties, which can be used to manage keyboard navigation in a draggable list of items in a Vue component.
 */
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
   * @param index - Index of the focused item
   */
  async function onFocus(index: number) {
    selectedIndex.value = index;
  }

  /**
   * Moves the currently selected item up in the list
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
