<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :initial-values="formData as unknown as Record<string, unknown>"
    :schema="schema"
    :submit-label="$t(submitLabel)"
  >
    <h2 v-if="title">
      {{ $t(title) }}
    </h2>
    <div class="flex flex-col space-y-7">
      <FormListItem
        v-slot="{ fields, remove, push, move }"
        :label="$t('i18n.components.form_social_link.social_links')"
        name="socialLinks"
      >
        <div class="flex flex-col space-y-3">
          <h2 for="textarea">
            {{ $t("i18n.components.form_social_link.social_links") }}
          </h2>
          <draggable
            v-model="fields.value"
            @end="
              (evt: { oldIndex: number; newIndex: number }) => {
                if (evt.oldIndex !== evt.newIndex)
                  move(evt.oldIndex, evt.newIndex);
              }
            "
            animation="300"
            class="flex flex-col space-y-3"
            ghost-class="opacity-0"
            :handle="'.drag-handle'"
            tag="div"
          >
            <template #item="{ index }">
              <div
                class="flex items-center space-x-5"
                :data-testid="`social-link-entry-${index}`"
              >
                <IconDraggableEdit
                  :aria-label="$t('i18n.components._global.draggable_element')"
                  class="drag-handle"
                  size="1em"
                />
                <IconDelete
                  @click="
                    () => {
                      remove(index);
                    }
                  "
                  :data-testid="`social-link-remove-${index}`"
                />
                <FormItem
                  v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                  :label="$t('i18n.components.form_social_link.new_link_label')"
                  :name="`socialLinks.${index}.label`"
                  :required="true"
                >
                  <!-- prettier-ignore-attribute :modelValue -->
                  <FormTextInput
                    :id="id"
                    @blur="handleBlur"
                    @update:modelValue="
                      (val: string) => {
                        handleChange(val);
                      }
                    "
                    :data-testid="`social-link-label-${index}`"
                    :hasError="!!errorMessage.value"
                    :label="
                      $t('i18n.components.form_social_link.new_link_label')
                    "
                    :modelValue="(value.value as string)"
                  />
                </FormItem>
                <FormItem
                  v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                  :label="$t('i18n.components.form_social_link.new_link_url')"
                  :name="`socialLinks.${index}.link`"
                  :required="true"
                >
                  <!-- prettier-ignore-attribute :modelValue -->
                  <FormTextInput
                    :id="id"
                    @blur="handleBlur"
                    @update:modelValue="
                      (val: string) => {
                        handleChange(val);
                      }
                    "
                    :data-testid="`social-link-url-${index}`"
                    :hasError="!!errorMessage.value"
                    :label="$t('i18n.components.form_social_link.new_link_url')"
                    :modelValue="(value.value as string)"
                  />
                </FormItem>
              </div>
            </template>
          </draggable>
        </div>
        <div class="flex space-x-2 pt-4">
          <BtnAction
            @click="
              push({
                link: '',
                label: '',
                order: fields.value.length,
                id: '',
                key: String(Date.now()) + '-' + fields.value.length,
              })
            "
            ariaLabel="i18n.components.form_social_link.add_link_aria_label"
            :cta="true"
            fontSize="base"
            label="i18n.components.form_social_link.add_link"
          />
        </div>
      </FormListItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { z } from "zod";

defineProps<{
  formData: { socialLinks: SocialLinkFormData[] };
  handleSubmit: (values: unknown) => Promise<void>;
  submitLabel: string;
  title?: string;
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
      id: z.string().optional(),
      order: z.number().optional(),
    })
  ),
});
</script>
