<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :submitLabel="
        $t('i18n.components.modal.edit.social_links._global.update_links')
      "
      :initialValues="formData"
    >
      <div class="flex flex-col space-y-7">
        <div class="flex flex-col space-y-3">
          <h2 for="textarea">
            {{
              $t("i18n.components.modal.edit.social_links._global.social_links")
            }}
          </h2>
          <div class="flex flex-col space-y-3">
            <div
              v-for="(socialLink, index) in socialLinksRef"
              :key="index"
              class="flex items-center space-x-5"
            >
              <IconClose @click="removeLink(socialLink.order)" />
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.label`"
                :label="
                  $t(
                    'i18n.components.modal.edit.social_links._global.new_link_label'
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
                      'i18n.components.modal.edit.social_links._global.new_link_label'
                    )
                  "
                />
              </FormItem>
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.link`"
                :label="
                  $t(
                    'i18n.components.modal.edit.social_links._global.new_link_url'
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
                      'i18n.components.modal.edit.social_links._global.new_link_url'
                    )
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
            label="i18n.components.modal.edit.social_links._global.add_link"
            fontSize="base"
            ariaLabel="i18n.components.modal.edit.social_links._global.add_link_aria_label"
          />
        </div>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

const { t } = useI18n();

const modalName = "ModalEditSocialLinksEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const schema = z.object({
  socialLinks: z.array(
    z.object({
      label: z
        .string()
        .min(
          1,
          t("i18n.components.modal.edit.social_links._global.label_required")
        ),
      link: z
        .string()
        .url(
          t(
            "i18n.components.modal.edit.social_links._global.valid_url_required"
          )
        ),
    })
  ),
});

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();

const socialLinksRef = ref<EventSocialLink[] | SocialLink[]>();

let { event } = eventStore;
socialLinksRef.value = event.socialLinks;

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
  const socialLinks = socialLinksRef.value?.map((socialLink, index) => ({
    id: socialLink.id,
    link: (values as SocialLinksValue).socialLinks[index].link,
    label: (values as SocialLinksValue).socialLinks[index].label,
    order: socialLink.order,
  }));

  let updateResponse = false;
  if (socialLinks) {
    updateResponse = await eventStore.deleteSocialLinks(event);
    updateResponse = await eventStore.createSocialLinks(
      event,
      socialLinks as SocialLink[]
    );
  }

  if (updateResponse) {
    handleCloseModal();

    await eventStore.fetchById(eventId);
    event = eventStore.event;
    socialLinksRef.value = event.socialLinks;
  }
}

async function addNewLink() {
  socialLinksRef.value?.push({
    link: "",
    label: "",
    order: socialLinksRef.value.length,
  } as EventSocialLink & SocialLink);
}

async function removeLink(order: number): Promise<void> {
  const indexToRemove = socialLinksRef.value?.findIndex(
    (link) => link.order === order
  );

  if (indexToRemove !== undefined && indexToRemove >= 0) {
    // Remove the item directly from the array.
    // This will mutate the original array and signal a reactivity update.
    socialLinksRef.value?.splice(indexToRemove, 1);

    // Re-index the remaining items to ensure the 'order' field is correct.
    socialLinksRef.value?.forEach((link, index) => {
      link.order = index;
    });
  }
}
</script>
