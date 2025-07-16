<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex w-full flex-col px-3 py-4 md:flex-row">
    <div class="w-full flex-col space-y-3 pt-3 md:space-y-4 md:p-2 md:pt-0">
      <div class="flex flex-col justify-between md:flex-row">
        <div
          v-if="isMarkdown"
          class="flex items-center justify-center space-x-2 md:space-x-4"
        >
          <div class="w-min md:w-min">
            <BtnAction
              @click="writePreviewSelector('Write')"
              class="w-small mt-1 flex"
              :cta="isMarkdownPreview === 'Write'"
              label="i18n.components.card_discussion_input.write"
              fontSize="sm"
              ariaLabel="i18n.components.card_discussion_input.write_aria_label"
            />
          </div>
          <div class="w-min md:w-min">
            <BtnAction
              @click="writePreviewSelector('Preview')"
              class="w-small mt-1 flex"
              :cta="isMarkdownPreview === 'Preview'"
              label="i18n.components.card_discussion_input.preview"
              fontSize="sm"
              ariaLabel="i18n.components.card_discussion_input.preview_aria_label"
            />
          </div>
        </div>
        <div
          v-if="!isMarkdown"
          class="mt-2 flex w-full items-center justify-center space-x-1 pt-3 md:w-fit md:flex-row md:pt-0 lg:space-x-3"
        >
          <Icon
            @click="at()"
            class="cursor-pointer"
            :name="IconMap.AT"
            size="1.75em"
          />
          <Icon
            @click="heading()"
            class="cursor-pointer"
            :name="IconMap.TEXT_HEADER"
            size="1.5em"
          />
          <Icon
            @click="bold()"
            class="cursor-pointer"
            :name="IconMap.TEXT_BOLD"
            size="1.75em"
          />
          <Icon
            @click="italic()"
            class="cursor-pointer"
            :name="IconMap.TEXT_ITALIC"
            size="1.75em"
          />
          <Icon
            @click="blockquote()"
            class="cursor-pointer"
            :name="IconMap.TEXT_QUOTE"
            size="1.75em"
          />
          <Icon
            @click="link()"
            class="cursor-pointer"
            :name="IconMap.LINK"
            size="1.75em"
          />
          <!-- <Icon
            @click="attach()"
            class="cursor-pointer"
            :name="IconMap.ATTACH"
            size="1.6em"
          /> -->
          <Icon
            @click="listul()"
            class="cursor-pointer"
            :name="IconMap.LIST_UNORDERED"
            size="1.75em"
          />
          <Icon
            @click="listol()"
            class="cursor-pointer"
            :name="IconMap.LIST_ORDERED"
            size="1.75em"
          />
        </div>
      </div>
      <div class="w-full md:w-full">
        <textarea
          v-show="isMarkdown && isMarkdownPreview === 'Write'"
          v-model="markdown"
          @input="
            (event) =>
              updateTheVariable((event.target as HTMLTextAreaElement).value)
          "
          ref="textarea"
          class="focus-brand prose dark:prose-invert block w-full max-w-full text-clip rounded-lg border border-section-div bg-layer-0 p-2.5 text-sm text-primary-text placeholder-distinct-text"
          rows="3"
        />
        <editor-content
          v-show="isMarkdownPreview === 'Preview'"
          :editor="writeEditor"
        />
      </div>
      <div class="flex items-center justify-between px-1">
        <p class="inline-flex items-center">
          <FormCheckbox
            @update:modelValue="toggleIsMarkdown()"
            class="mr-1"
            :modelValue="isMarkdown"
            value="yes"
          />
          {{
            $t("i18n.components.card_discussion_input.enable_markdown_support")
          }}
          <Icon class="mx-1" :name="IconMap.MARKDOWN" size="1.25em"></Icon>
        </p>
        <div class="flex items-center space-x-3">
          <Button
            @mouseenter="showTooltip = true"
            @focus="showTooltip = true"
            @mouseleave="showTooltip = false"
            @blur="showTooltip = false"
            @click="showTooltip = showTooltip == true ? false : true"
            class="elem-shadow-sm focus-brand relative flex h-10 w-16 items-center justify-center rounded-lg"
            :class="{
              'style-action': discussionInput.highRisk,
              'style-warn': !discussionInput.highRisk,
            }"
          >
            <Icon
              v-if="discussionInput.highRisk"
              :name="IconMap.WARN_OCTAGON"
              size="1.4em"
            />
            <Icon v-else :name="IconMap.WARN_TRIANGLE" size="1.4em" />
            <TooltipDiscussionWarning
              v-show="showTooltip"
              class="-mt-64 md:-mt-56"
            />
          </Button>
          <BtnAction
            class="w-small inline-flex items-center justify-center"
            :cta="true"
            label="i18n.components.card_discussion_input.comment"
            fontSize="sm"
            ariaLabel="i18n.components.card_discussion_input.comment_aria_label"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { Markdown } from "tiptap-markdown";

import type { DiscussionInput } from "~/types/content/discussion";

import { IconMap } from "~/types/icon-map";

import Suggestion from "../../../utils/mentionSuggestion";

const showTooltip = ref(false);
const props = defineProps<{
  discussionInput: DiscussionInput;
}>();
const i18n = useI18n();
const markdown = ref("");

const isMarkdownPreview = ref("Write");
const isMarkdown = ref(true);
const textarea = ref<HTMLTextAreaElement | null>(null);

// Note: We want to have it not just be one line when the user switches back to Markdown mode.
// https://stackoverflow.com/questions/65997180/automatic-resizing-of-textarea-after-loading-data-in-vue
const autoResize = () => {
  const el = textarea.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight - 4}px`;
};

watch(markdown, () => {
  autoResize();
});

const writeEditor = useEditor({
  content: markdown,
  editable: !isMarkdownPreview.value,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.discussionInput.highRisk
        ? i18n.t(
            "i18n.components.card_discussion_input.leave_comment_high_risk"
          )
        : i18n.t("i18n.components.card_discussion_input.leave_comment"),
    }),
    Link,
    Mention.configure({
      HTMLAttributes: {
        class:
          "hover:underline font-bold rounded-2xl box-decoration-clone px-1 py-0.5",
      },
      // @ts-expect-error: Ignore mismatched types.
      suggestion: Suggestion,
    }),
    Markdown,
  ],
  editorProps: {
    attributes: {
      class:
        "focus-brand block w-full max-w-full rounded-lg border border-section-div bg-layer-0 p-2.5 text-sm text-primary-text placeholder-distinct-text prose dark:prose-invert text-clip",
    },
  },
});

const updateTheVariable = (value: string) => {
  markdown.value = value;
};

const toggleIsMarkdown = () => {
  isMarkdown.value = !isMarkdown.value;

  if (isMarkdownPreview.value === "Write") {
    isMarkdownPreview.value = "Preview";
    writeEditor.value?.commands.setContent(markdown.value);
  }

  if (isMarkdown.value && isMarkdownPreview.value === "Preview") {
    isMarkdownPreview.value = "Write";
  }

  if (isMarkdown.value) {
    writeEditor.value?.setEditable(false);
  } else {
    writeEditor.value?.setEditable(true);
  }

  markdown.value = writeEditor.value?.storage.markdown.getMarkdown();
  autoResize();
};

const writePreviewSelector = (buttonString: string) => {
  isMarkdownPreview.value = buttonString;
  writeEditor.value?.setEditable(!isMarkdownPreview.value);
  writeEditor.value?.commands.setContent(markdown.value);
};

const at = () => {
  console.log("click on at");
  writeEditor.value?.chain().focus().insertContent(" @").run();
};
const heading = () => {
  console.log("click on heading");
  writeEditor.value?.chain().focus().toggleHeading({ level: 1 }).run();
};
const bold = () => {
  console.log("click on bold");
  writeEditor.value?.chain().focus().toggleBold().run();
};
const italic = () => {
  console.log("click on italic");
  writeEditor.value?.chain().focus().toggleItalic().run();
};
const blockquote = () => {
  console.log("click on blockquote");
  writeEditor.value?.chain().focus().toggleBlockquote().run();
};
const link = () => {
  console.log("click on link");
  const previousUrl = writeEditor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  if (url === null) {
    return;
  }

  if (url === "") {
    writeEditor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .run();
    return;
  }

  writeEditor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
};

// Note: There is as of now no plan to add in attachments.
// const attach = () => {
//   console.log("click on attach");
// };

const listul = () => {
  console.log("click on listul");
  writeEditor.value?.chain().focus().toggleBulletList().run();
};
const listol = () => {
  console.log("click on listol");
  writeEditor.value?.chain().focus().toggleOrderedList().run();
};
</script>

<style>
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap blockquote {
  @apply my-2 rounded-r-md border-l-4 border-section-div bg-layer-2 py-1 pl-4 italic text-distinct-text;
}
</style>
