// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Instance as TippyInstance } from "tippy.js";

import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";

// This composable expects your Vue SFC to be passed as an argument.
export function useMentionSuggestion(MentionList: Component) {
  function getItems({ query }: MentionProps): string[] {
    return ["Jay Doe", "Jane Doe", "John Doe"]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  }

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
