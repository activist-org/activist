<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex-col">
    <p class="responsive-h4 font-bold">
      {{ $t(headerText) }}
    </p>
    <ul v-if="!helpNeeded" class="list-disc space-y-1 pb-1 pl-4 pt-3">
      <li>
        {{ $t("i18n.components.page_community_footer.invite_text_2_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("i18n._global.on_github") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("i18n.components.page_community_footer.invite_text_2_3") }}
      </li>
      <li>
        {{ $t("i18n.components.page_community_footer.invite_text_3_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("i18n._global.public_matrix_chat_rooms") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("i18n.components.page_community_footer.invite_text_3_3") }}
      </li>
      <li>
        {{ $t("i18n.components.page_community_footer.visit_our") }}
        <a
          class="focus-brand link-text items-center"
          href="https://hosted.weblate.org/projects/activist/activist"
          target="_blank"
        >
          {{ $t("i18n.components.page_community_footer.invite_text_4_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("i18n.components.page_community_footer.invite_text_4_3") }}
      </li>
    </ul>
    <ul v-else class="list-disc space-y-1 pb-1 pl-4 pt-3">
      <li>
        {{ $t("i18n.components.page_community_footer.need_help_text_1_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("i18n._global.public_matrix_chat_rooms") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("i18n.components.page_community_footer.need_help_text_1_3") }}
      </li>
      <li>
        {{ $t("i18n.components.page_community_footer.need_help_text_2_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("i18n._global.github") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("i18n.components.page_community_footer.need_help_text_2_3") }}
      </li>
    </ul>
  </div>
  <div class="style-btns-next-to-one-another">
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
  header: "i18n.components.page_community_footer.invite_text_1",
});

const headerText = ref(props.header);

if (props.helpNeeded == true) {
  headerText.value = "i18n.components.page_community_footer.need_help";
}
</script>
