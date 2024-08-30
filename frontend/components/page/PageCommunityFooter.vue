<template>
  <div class="flex-col">
    <p class="responsive-h4 font-bold">
      {{ $t(headerText) }}
    </p>
    <ul v-if="!helpNeeded" class="list-disc space-y-1 pb-1 pl-4 pt-3">
      <li>
        {{ $t("components.page_community_footer.invite_text_2_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("_global.on_github") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page_community_footer.invite_text_2_3") }}
      </li>
      <li>
        {{ $t("components.page_community_footer.invite_text_3_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("_global.public_matrix_chat_rooms") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page_community_footer.invite_text_3_3") }}
      </li>
      <li>
        {{ $t("_global.visit_our") }}
        <a
          class="focus-brand link-text items-center"
          href="https://hosted.weblate.org/projects/activist/activist"
          target="_blank"
        >
          {{ $t("components.page_community_footer.invite_text_4_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page_community_footer.invite_text_4_3") }}
      </li>
    </ul>
    <ul v-else class="list-disc space-y-1 pb-1 pl-4 pt-3">
      <li>
        {{ $t("components.page_community_footer.need_help_text_1_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("_global.public_matrix_chat_rooms") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page_community_footer.need_help_text_1_3") }}
      </li>
      <li>
        {{ $t("components.page_community_footer.need_help_text_2_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("components._global.github") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("components.page_community_footer.need_help_text_2_3") }}
      </li>
    </ul>
  </div>
  <div
    class="mx-auto grid max-w-[70%] grid-cols-1 gap-y-4 sm:mx-0 sm:max-w-[90%] sm:grid-cols-2 sm:grid-rows-1 sm:gap-x-4 sm:gap-y-0 md:max-w-[70%] md:gap-x-6 lg:max-w-[60%] xl:max-w-[50%] xl:gap-x-8 2xl:max-w-[80%]"
  >
    <!-- Slot is formatted to accept buttons for the bottom of the page. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

export interface Props {
  header?: string;
  helpNeeded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  header: "components.page_community_footer.invite_text_1",
});

const headerText = ref(props.header);

if (props.helpNeeded == true) {
  headerText.value = "components.page_community_footer.need_help";
}
</script>
