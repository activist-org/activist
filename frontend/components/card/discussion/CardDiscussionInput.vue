<template>
  <div class="flex flex-col w-full px-3 py-4 md:flex-row card-style">
    <div class="flex-col pt-3 space-y-3 md:pl-2 md:space-y-4 md:grow md:pt-0">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <div class="w-min md:w-min">
            <BtnAction
              class="flex mt-1 w-small"
              :cta="true"
              :label="$t('components.card-discussion-input.write')"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.card-discussion-input.write-aria-label"
            />
          </div>
          <div class="w-min md:w-min">
            <BtnAction
              class="flex mt-1 w-small"
              :cta="false"
              :label="$t('components.card-discussion-input.preview')"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.card-discussion-input.preview-aria-label"
            />
          </div>
        </div>
        <div
          class="flex items-center w-full mt-2 space-x-1 md:flex-row md:w-fit lg:space-x-3"
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
          class="block p-2.5 w-full text-sm rounded-lg border border-light-action-red dark:border-dark-action-red focus-brand focus:border-none font-bold placeholder:text-light-action-red dark:placeholder:text-dark-action-red dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
          :placeholder="
            $t('components.card-discussion-input.leave-comment-highRisk')
          "
        ></textarea>
      </div>
      <div v-else class="w-full md:w-full">
        <textarea
          id="message"
          rows="4"
          class="block p-2.5 w-full text-sm text-light-text rounded-lg border border-light-section-div placeholder-light-distinct-text dark:placeholder-dark-distinct-text dark:text-dark-text dark:bg-dark-distinct focus-brand"
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
            @mouseleave="showTooltip = false"
            @click="showTooltip = showTooltip == true ? false : true"
            class="relative flex items-center justify-center w-16 h-10 rounded-lg elem-shadow-sm focus-brand"
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
            class="inline-flex items-center justify-center w-small"
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
