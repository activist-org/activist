<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :submitLabel="
        $t('i18n.components.modal.social_links._global.update_links')
      "
      :initialValues="formData"
    >
      <div class="flex flex-col space-y-7">
        <div class="flex flex-col space-y-3">
          <h2 for="textarea">
            {{ $t("i18n.components.modal.social_links._global.social_links") }}
          </h2>
          <draggable
            v-model="socialLinksRef"
            @end="reindex"
            item-key="__key"
            tag="div"
            class="flex flex-col space-y-3"
            animation="300"
            ghost-class="opacity-0"
            :handle="'.drag-handle'"
          >
            <template #item="{ index }">
              <div class="flex items-center space-x-5">
                <span
                  class="drag-handle cursor-grab select-none"
                  title="Drag to reorder"
                  >⋮⋮</span
                >
                <IconClose @click="removeByIndex(index)" />
                <FormItem
                  v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                  :name="`socialLinks.${index}.label`"
                  :label="
                    $t(
                      'i18n.components.modal.social_links._global.new_link_label'
                    )
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
                  :name="`socialLinks.${index}.link`"
                  :label="
                    $t(
                      'i18n.components.modal.social_links._global.new_link_url'
                    )
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
                        'i18n.components.modal.social_links._global.new_link_url'
                      )
                    "
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
            label="i18n.components.modal.social_links._global.add_link"
            fontSize="base"
            ariaLabel="i18n.components.modal.social_links._global.add_link_aria_label"
          />
        </div>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { z } from "zod";

import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

import { useSortableList } from "~/composables/useSortableList";

const { t } = useI18n();

const modalName = "ModalSocialLinksEvent";
const { handleCloseModal } = useModalHandlers(modalName);

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

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();

type EventLinkRow = (EventSocialLink | SocialLink) & { __key: string };
const socialLinksRef = ref<EventLinkRow[]>(
  (eventStore.event.socialLinks || []).map((l, idx) => ({
    ...l,
    __key: (l as EventSocialLink).id ?? String(idx),
  })) as EventLinkRow[]
);

const { reindex, removeByIndex } = useSortableList(socialLinksRef);

let { event } = eventStore;

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink) => ({
    label: socialLink.label,
    link: socialLink.link,
  })),
}));

interface SocialLinksValue {
  socialLinks: { link: string; label: string }[];
}

// Attn: Currently we're deleting the social links and rewriting all of them.
async function handleSubmit(values: unknown) {
  reindex();

  const formValues = values as SocialLinksValue;
  const socialLinks = socialLinksRef.value?.map((socialLink, index) => {
    // For existing items with IDs, find their original position in the initial data
    // For new items without IDs, use the current form position
    let formIndex = index; // Default to current position for new items

    if (socialLink.id) {
      // Find the original index of this item by matching IDs
      const originalSocialLinks = eventStore.event.socialLinks || [];
      formIndex = originalSocialLinks.findIndex(
        (original) => original.id === socialLink.id
      );
    }

    return {
      id: socialLink.id,
      // Use form values for the correct form position, fallback to socialLink values
      link: formValues.socialLinks[formIndex]?.link || socialLink.link,
      label: formValues.socialLinks[formIndex]?.label || socialLink.label,
      order: index,
    };
  });

  // Filter out items with empty link or label (validation should catch this, but just in case)
  const validSocialLinks =
    socialLinks?.filter((link) => link.link && link.label) || [];

  let updateResponse = false;
  if (validSocialLinks.length > 0) {
    updateResponse = await eventStore.deleteSocialLinks(event);
    updateResponse = await eventStore.createSocialLinks(
      event,
      validSocialLinks as SocialLink[]
    );
  }

  if (updateResponse) {
    handleCloseModal();

    await eventStore.fetchById(eventId);
    event = eventStore.event;
    socialLinksRef.value = (event.socialLinks || []).map((l, idx) => ({
      ...l,
      __key: (l as EventSocialLink).id ?? String(idx),
    })) as EventLinkRow[];
  }
}

async function addNewLink() {
  socialLinksRef.value?.push({
    link: "",
    label: "",
    order: socialLinksRef.value.length,
    __key: String(Date.now()) + "-" + socialLinksRef.value.length,
  } as EventLinkRow);
}
</script>
