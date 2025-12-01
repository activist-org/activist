// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Ref } from "vue";
import { ref, nextTick } from "vue";

/**
 * Composable for managing keyboard navigation in draggable lists.
 * Provides functionality to move items up/down with arrow keys and maintain focus.
 *
 * @template T - The type of items in the list (must have an order field)
 * @param {Ref<T[]>} list - Reactive reference to the list of items
 * @param {(list: T[]) => Promise<void>} reorderCallback - Async function to call after reordering
 * @param {string} orderField - Name of the field used for ordering (default: "order")
 * @returns Object containing refs and functions for keyboard navigation
 *
 * @example
 * const faqList = ref<FaqEntry[]>([...]);
 * const { reorderFAQs } = useOrganizationFAQEntryMutations(orgId);
 * 
 * const {
 *   htmlElementsList,
 *   selectedIndex,
 *   onFocus,
 *   moveUp,
 *   moveDown
 * } = useDraggableKeyboardNavigation(faqList, reorderFAQs);
 */
export function useDraggableKeyboardNavigation<
  T extends Record<string, unknown>
>(
  list: Ref<T[]>,
  reorderCallback: (list: T[]) => Promise<void>,
  orderField = "order"
) {
  const htmlElementsList = ref<(HTMLElement | null)[]>([]);
  const selectedIndex = ref<number | null>(null);

  /**
   * Handles focus event on a list item
   * @param {number} index - Index of the focused item
   */
  async function onFocus(index: number) {
    console.log("List item index focused", index);
    selectedIndex.value = index;
  }

  /**
   * Moves the currently selected item up in the list
   * @param {number} index - Current index (unused but kept for API consistency)
   */
  async function moveUp(index: number) {
    console.log("Moving list item index up", index);

    if (selectedIndex.value === null || selectedIndex.value === 0) return;

    const i = selectedIndex.value;
    const temp = list.value[i];
    
    // Swap order values
    (temp as Record<string, unknown>)[orderField] = i - 1;
    (list.value[i - 1] as Record<string, unknown>)[orderField] = i;
    
    // Swap items in array
    list.value[i] = list.value[i - 1]!;
    list.value[i - 1] = temp!;

    selectedIndex.value--;

    await reorderCallback(list.value);

    // Focus the moved item after DOM update
    await nextTick();
    htmlElementsList.value[selectedIndex.value]?.focus();
  }

  /**
   * Moves the currently selected item down in the list
   * @param {number} index - Current index (unused but kept for API consistency)
   */
  async function moveDown(index: number) {
    console.log("Moving list item index down", index);

    if (
      selectedIndex.value === null ||
      selectedIndex.value === list.value.length - 1
    )
      return;

    const i = selectedIndex.value;
    const temp = list.value[i];
    
    // Swap order values
    (temp as Record<string, unknown>)[orderField] = i + 1;
    (list.value[i + 1] as Record<string, unknown>)[orderField] = i;
    
    // Swap items in array
    list.value[i] = list.value[i + 1]!;
    list.value[i + 1] = temp!;

    selectedIndex.value++;

    await reorderCallback(list.value);

    // Focus the moved item after DOM update
    await nextTick();
    htmlElementsList.value[selectedIndex.value]?.focus();
  }

  return {
    htmlElementsList,
    selectedIndex,
    onFocus,
    moveUp,
    moveDown,
  };
}

