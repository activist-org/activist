<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :schema="schema"
    :initial-values="formData as undefined"
    :submit-label="$t(submitLabel)"
  >
    <h2 v-if="title">
      {{ $t(title) }}
    </h2>
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3">
        <h2 for="textarea">
          {{ $t("i18n.components.form_social_link.social_links") }}
        </h2>
        <draggable
          v-model="socialLinks"
          @end="handleReindex"
          item-key="key"
          tag="div"
          class="flex flex-col space-y-3"
          animation="300"
          ghost-class="opacity-0"
          :handle="'.drag-handle'"
        >
          <template #item="{ index }">
            <div class="flex items-center space-x-5">
              <span
                class="drag-handle -mr-2 cursor-grab select-none"
                title="Drag to reorder"
              >
                <Icon :name="IconMap.GRIP" size="1em" />
              </span>
              <IconClose @click="handleRemoveByIndex(index)" />
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.label`"
                :label="$t('i18n.components.form_social_link.new_link_label')"
                :required="true"
              >
                <FormTextInput
                  @blur="handleBlur"
                  @update:modelValue="handleChange"
                  :id="id"
                  :hasError="!!errorMessage.value"
                  :modelValue="value.value as string"
                  :label="$t('i18n.components.form_social_link.new_link_label')"
                />
              </FormItem>
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.link`"
                :label="$t('i18n.components.form_social_link.new_link_url')"
                :required="true"
              >
                <FormTextInput
                  @blur="handleBlur"
                  @update:modelValue="handleChange"
                  :id="id"
                  :hasError="!!errorMessage.value"
                  :modelValue="value.value as string"
                  :label="$t('i18n.components.form_social_link.new_link_url')"
                />
              </FormItem>
            </div>
          </template>
        </draggable>
      </div>
      <div class="flex space-x-2">
        <BtnAction
          @click="addNewLink()"
          :cta="true"
          label="i18n.components.form_social_link.add_link"
          fontSize="base"
          ariaLabel="i18n.components.form_social_link.add_link_aria_label"
        />
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { z } from "zod";

import { useSortableList } from "~/composables/useSortableList";
import { IconMap } from "~/types/icon-map";

export interface SocialLinkItem {
  link: string;
  label: string;
  order: number;
  id?: string;
  key?: string;
  creationDate?: string;
  lastUpdated?: string;
  groupId?: string;
  orgId?: string;
  eventId?: string;
}

interface SocialLinkFormData {
  socialLinks: SocialLinkItem[];
}

const props = defineProps<{
  formData?: SocialLinkFormData;
  handleSubmit: (values: unknown) => Promise<void>;
  submitLabel: string;
  title?: string;
  socialLinksRef: SocialLinkItem[];
}>();

const emit = defineEmits<{
  addLink: [link: SocialLinkItem];
  updateList: [list: SocialLinkItem[]];
}>();

const { t } = useI18n();

const schema = z.object({
  socialLinks: z.array(
    z.object({
      label: z
        .string()
        .min(1, t("i18n.components.form_social_link.label_required")),
      link: z
        .string()
        .url(t("i18n.components.form._global.valid_url_required")),
    })
  ),
});

const socialLinks = ref(
  props.socialLinksRef.map((l, idx) => ({
    ...l,
    key: l.key ?? l.id ?? String(idx),
  }))
);

const { reindex, removeByIndex } = useSortableList(socialLinks);

// Wrapper functions to emit changes back to parent.
const handleReindex = () => {
  reindex();
  emit("updateList", socialLinks.value);
};

const handleRemoveByIndex = (index: number) => {
  removeByIndex(index);
  emit("updateList", socialLinks.value);
};

function addNewLink() {
  const newLink = {
    link: "",
    label: "",
    order: socialLinks.value.length,
    id: "",
    key: String(Date.now()) + "-" + socialLinks.value.length,
  };

  socialLinks.value?.push(newLink);
  emit("addLink", newLink);
  emit("updateList", socialLinks.value);
}
</script>
