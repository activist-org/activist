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
          {{ $t("i18n.components.modal.social_links._global.social_links") }}
        </h2>
        <div class="flex flex-col space-y-3">
          <div
            v-for="(socialLink, index) in props.socialLinksRef"
            :key="String(index)"
            class="flex items-center space-x-5"
          >
            <IconClose @click="removeLink(socialLink.order)" />
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
              :name="`socialLinks.${String(index)}.label`"
              :label="
                $t('i18n.components.modal.social_links._global.new_link_label')
              "
              :required="true"
            >
              <FormTextInput
                @blur="handleBlur"
                @update:modelValue="handleChange"
                :id="id"
                :hasError="!!errorMessage.value"
                :modelValue="value.value as string"
                :label="
                  $t(
                    'i18n.components.modal.social_links._global.new_link_label'
                  )
                "
              />
            </FormItem>
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
              :name="`socialLinks.${String(index)}.link`"
              :label="
                $t('i18n.components.modal.social_links._global.new_link_url')
              "
              :required="true"
            >
              <FormTextInput
                @blur="handleBlur"
                @update:modelValue="handleChange"
                :id="id"
                :hasError="!!errorMessage.value"
                :modelValue="value.value as string"
                :label="
                  $t('i18n.components.modal.social_links._global.new_link_url')
                "
              />
            </FormItem>
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <BtnAction
          @click="addNewLink()"
          :cta="true"
          label="i18n.components.modal.social_links._global.add_link"
          fontSize="base"
          ariaLabel="i18n.components.modal.social_links._global.add_link_aria_label"
        />
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

interface SocialLinkItem {
  link: string;
  label: string;
  order: number;
  id?: string;
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
  removeLink: [order: number];
}>();

const { t } = useI18n();

const schema = z.object({
  socialLinks: z.array(
    z.object({
      label: z
        .string()
        .min(1, t("i18n.components.modal.social_links._global.label_required")),
      link: z
        .string()
        .url(
          t("i18n.components.modal.social_links._global.valid_url_required")
        ),
    })
  ),
});

async function addNewLink() {
  const newLink: SocialLinkItem = {
    link: "",
    label: "",
    order: props.socialLinksRef.length,
  };
  emit("addLink", newLink);
}

async function removeLink(order: number): Promise<void> {
  emit("removeLink", order);
}
</script>
