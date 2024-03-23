<template>
  <div class="card-style flex w-full flex-col px-3 py-4 md:flex-row">
    <div class="flex-col space-y-3 pt-3 md:grow md:space-y-4 md:pl-2 md:pt-0">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <div class="w-min md:w-min">
            <BtnAction
              class="w-small mt-1 flex"
              :cta="true"
              :label="$t('components.card-discussion-input.write')"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.card-discussion-input.write-aria-label"
            />
          </div>
          <div class="w-min md:w-min">
            <BtnAction
              class="w-small mt-1 flex"
              :cta="false"
              :label="$t('components.card-discussion-input.preview')"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.card-discussion-input.preview-aria-label"
            />
          </div>
        </div>
        <div
          class="mt-2 flex w-full items-center space-x-1 md:w-fit md:flex-row lg:space-x-3"
        >
          <Icon
            @click="at()"
            class="cursor-pointer"
            name="bi:at"
            size="1.75em"
          />
          <Icon
            @click="heading()"
            class="cursor-pointer"
            name="bi:h-square"
            size="1.5em"
          />
          <Icon
            @click="bold()"
            class="cursor-pointer"
            name="bi:type-bold"
            size="1.75em"
          />
          <Icon
            @click="italic()"
            class="cursor-pointer"
            name="bi:type-italic"
            size="1.75em"
          />
          <Icon
            @click="blockquote()"
            class="cursor-pointer"
            name="bi:blockquote-left"
            size="1.75em"
          />
          <Icon
            @click="link()"
            class="cursor-pointer"
            name="bi:link-45deg"
            size="1.75em"
          />
          <!-- <Icon
            @click="attach()"
            class="cursor-pointer"
            name="bi:paperclip"
            size="1.6em"
          /> -->
          <Icon
            @click="listul()"
            class="cursor-pointer"
            name="bi:list-ul"
            size="1.75em"
          />
          <Icon
            @click="listol()"
            class="cursor-pointer"
            name="bi:list-ol"
            size="1.75em"
          />
        </div>
      </div>
      <div v-if="discussionInput.highRisk" class="w-full md:w-full">
        <textarea
          id="message"
          rows="4"
          class="focus-brand block w-full rounded-lg border border-light-action-red bg-light-layer-0 p-2.5 text-sm placeholder:text-light-action-red focus:border-none dark:border-dark-action-red dark:bg-dark-layer-0 dark:text-dark-text dark:placeholder:text-dark-action-red"
          :placeholder="
            $t('components.card-discussion-input.leave-comment-highRisk')
          "
        ></textarea>
      </div>
      <div v-else class="w-full md:w-full">
        <textarea
          id="message"
          rows="4"
          class="focus-brand block w-full rounded-lg border border-light-section-div bg-light-layer-0 p-2.5 text-sm text-light-text placeholder-light-distinct-text dark:border-dark-section-div dark:bg-dark-layer-0 dark:text-dark-text dark:placeholder-dark-distinct-text"
          :placeholder="$t('components.card-discussion-input.leave-comment')"
        ></textarea>
      </div>
      <div class="flex items-center justify-between px-1">
        <p class="inline-flex items-center">
          {{ $t("components.card-discussion-input.markdown-support") }}
          <Icon class="mx-1" name="bi:markdown" size="1.25em"></Icon>
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
              name="bi:exclamation-octagon"
              size="1.4em"
            />
            <Icon v-else name="bi:exclamation-triangle" size="1.4em" />
            <TooltipDiscussionWarning
              v-show="showTooltip"
              class="-mt-64 md:-mt-56"
            />
          </Button>
          <BtnAction
            class="w-small inline-flex items-center justify-center"
            :cta="true"
            :label="$t('components.card-discussion-input.comment')"
            fontSize="sm"
            iconSize="1.25em"
            ariaLabel="components.card-discussion-input.comment-aria-label"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DiscussionInput } from "~/types/card-discussion-input";
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
