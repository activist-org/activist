/**
 * Creates a custom hook for managing tab navigation in a component.
 * This hook provides a function to handle the 'Tab' key press event,
 * ensuring that when the user reaches the last focusable item in a sequence,
 * pressing the 'Tab' key will cycle back to the first item, and vice versa.
 *
 * @param {EmitType} emit - A function to emit custom events. In this case, it's used
 *                           to emit a 'tab' event when the Tab key is pressed.
 * @returns An object containing the `onTabPress` function that should be used as an event handler
 *          for keyboard events to manage tab navigation.
 *
 */

type EmitType = (event: "tab", payload?: string) => void;

export default function useTabNavigationEmit(emit: EmitType) {
  const onTabPress = (isLastItem: boolean, event: KeyboardEvent) => {
    if (
      (!isLastItem && event.shiftKey && event.key === "Tab") ||
      (isLastItem && !event.shiftKey && event.key === "Tab")
    ) {
      event.preventDefault();
      emit("tab");
    }
  };
  return { onTabPress };
}
