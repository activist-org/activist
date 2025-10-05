// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Editor } from "@tiptap/core";

export interface MentionProps {
  query: string;
}

export interface RendererProps {
  editor: Editor;
  clientRect?: () => DOMRect;
}
