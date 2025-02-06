<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex w-full flex-col px-3 py-4 md:flex-row">
    <div class="flex-col space-y-3 pt-3 md:grow md:space-y-4 md:pl-2 md:pt-0">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <div class="w-min md:w-min">
            <BtnAction
              class="w-small mt-1 flex"
              :cta="true"
              :label="$t(i18nMap.components.card_discussion_input.write)"
              fontSize="sm"
              :ariaLabel="
                i18nMap.components.card_discussion_input.write_aria_label
              "
            />
          </div>
          <div class="w-min md:w-min">
            <BtnAction
              class="w-small mt-1 flex"
              :cta="false"
              :label="$t(i18nMap.components.card_discussion_input.preview)"
              fontSize="sm"
              :ariaLabel="
                i18nMap.components.card_discussion_input.preview_aria_label
              "
            />
          </div>
        </div>
        <div
          class="mt-2 flex w-full items-center space-x-1 md:w-fit md:flex-row lg:space-x-3"
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
      <div v-if="discussionInput.highRisk" class="w-full md:w-full">
        <textarea
          id="message"
          rows="4"
          class="focus-brand block w-full rounded-lg border border-action-red bg-layer-0 p-2.5 text-sm placeholder-action-red focus:border-none dark:border-action-red dark:text-primary-text dark:placeholder-action-red"
          :placeholder="
            $t(i18nMap.components.card_discussion_input.leave_comment_high_risk)
          "
        ></textarea>
      </div>
      <div v-else class="w-full md:w-full">
        <textarea
          id="message"
          rows="4"
          class="focus-brand block w-full rounded-lg border border-section-div bg-layer-0 p-2.5 text-sm text-primary-text placeholder-distinct-text"
          :placeholder="
            $t(i18nMap.components.card_discussion_input.leave_comment)
          "
        ></textarea>
      </div>
      <div class="flex items-center justify-between px-1">
        <p class="inline-flex items-center">
          {{ $t(i18nMap.components.card_discussion_input.markdown_support) }}
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
            :label="$t(i18nMap.components.card_discussion_input.comment)"
            fontSize="sm"
            :ariaLabel="
              i18nMap.components.card_discussion_input.comment_aria_label
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscussionInput } from "~/types/content/discussion";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const showTooltip = ref(false);

defineProps<{
  discussionInput: DiscussionInput;
}>();

const at = () => {
  console.log("click on at");
};
const heading = () => {
  console.log("click on heading");
};
const bold = () => {
  console.log("click on bold");
};
const italic = () => {
  console.log("click on italic");
};
const blockquote = () => {
  console.log("click on blockquote");
};
const link = () => {
  console.log("click on link");
};
// There is as of now no plan to add in attachments.
// const attach = () => {
//   console.log("click on attach");
// };
const listul = () => {
  console.log("click on listul");
};
const listol = () => {
  console.log("click on listol");
};
</script>
