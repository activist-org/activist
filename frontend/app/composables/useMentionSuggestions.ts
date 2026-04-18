// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Instance as TippyInstance } from "tippy.js";

import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";

// This composable expects your Vue SFC to be passed as an argument.
/**
 * Composable for providing mention suggestions functionality in a text editor using the Tiptap editor framework. This composable defines a function to retrieve mention suggestions based on a query and a renderer function to display the suggestions in a dropdown menu using the Tippy.js library for positioning and interactivity. The getItems function filters a predefined list of items based on the user's query, while the renderer function manages the creation and updating of the suggestion dropdown, handling user interactions such as keyboard navigation and closing the dropdown when necessary. The composable returns these functions for use in components that require mention suggestion functionality in a text editor context.
 * @param MentionList The Vue component that will be used to render the mention suggestions in the dropdown menu, which should be passed as an argument when using this composable to provide the necessary UI for displaying the mention suggestions to the user.
 * @returns An object containing the getItems function for retrieving mention suggestions based on a query and the renderer function for managing the display of the suggestion dropdown, which can be used in components that require mention suggestion functionality in a text editor context.
 */
export function useMentionSuggestion(MentionList: Component) {
  /**
   * Retrieves a list of mention suggestions based on the user's query.
   * @param root0 An object containing the query string.
   * @param root0.query The query string entered by the user to filter mention suggestions.
   * @returns An array of mention suggestions that match the query.
   */
  function getItems({ query }: MentionProps): string[] {
    return ["Jay Doe", "Jane Doe", "John Doe"]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  }

  /**
   * Creates a renderer for displaying mention suggestions in a dropdown menu using Tippy.js.
   * @returns An object containing lifecycle methods for managing the mention suggestion dropdown.
   */
  function renderer() {
    let component: VueRenderer;
    let popup: TippyInstance[];

    return {
      onStart: (props: RendererProps) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element ?? "Default content",
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: RendererProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        if (popup && popup[0]) {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        }
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          if (popup && popup[0]) {
            popup[0].hide();
          }

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        if (popup && popup[0]) {
          popup[0].destroy();
        }
        component.destroy();
      },
    };
  }

  return {
    getItems,
    renderer,
  };
}
