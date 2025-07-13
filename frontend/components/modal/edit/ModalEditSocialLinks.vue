<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form :schema="schema" @submit="onSubmit">
      <div class="flex flex-col space-y-7">
        <div class="flex flex-col space-y-3">
          <h2 class="text-xl font-semibold">
            {{ $t("i18n.components.modal_edit_social_links.social_links") }}
          </h2>

          <div class="flex flex-col space-y-5">
            <div
              v-for="(socLink, index) in socialLinksRef"
              :key="index"
              class="flex flex-col gap-2 border-b border-section-div pb-4"
            >
              <div class="flex justify-end">
                <IconClose @click="removeLink(socLink.order)" class="cursor-pointer" />
              </div>

              <FormItem
                :name="`label-${index}`"
                :label="$t('i18n.components.modal_edit_social_links.new_link_label')"
                :required="true"
              >
                <FormTextInput
                  v-model="socLink.label"
                  :id="`label-input-${index}`"
                  :label="$t('i18n.components.modal_edit_social_links.new_link_label')"
                />
              </FormItem>

              <FormItem
                :name="`link-${index}`"
                :label="$t('i18n.components.modal_edit_social_links.new_link_url')"
                :required="true"
              >
                <FormTextInput
                  v-model="socLink.link"
                  :id="`link-input-${index}`"
                  :label="$t('i18n.components.modal_edit_social_links.new_link_url')"
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div class="flex space-x-2">
          <BtnAction
            @click="addNewLink"
            :cta="true"
            label="i18n.components.modal_edit_social_links.add_link"
            fontSize="base"
            ariaLabel="i18n.components.modal_edit_social_links.add_link_aria_label"
          />
          <BtnAction
            type="submit"
            :cta="true"
            label="i18n.components.modal_edit_social_links.update_links"
            fontSize="base"
            ariaLabel="i18n.components.modal_edit_social_links.update_links_aria_label"
          />
        </div>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import Form from '@/components/form/Form.vue'
import FormItem from '@/components/form/FormItem.vue'
import FormTextInput from '@/components/form/text/FormTextInput.vue'
import { onMounted, ref } from 'vue'
import { z } from 'zod'

import type { Group, GroupSocialLink } from '~/types/communities/group'
import type { Organization, OrganizationSocialLink } from '~/types/communities/organization'
import type { SocialLink, SocialLinkFormData } from '~/types/content/social-link'
import type { Event, EventSocialLink } from '~/types/events/event'

const props = defineProps<{
  pageType: 'organization' | 'group' | 'event' | 'other'
}>()

const i18n = useI18n()
const modalName = 'ModalEditSocialLinks'
const { handleCloseModal } = useModalHandlers(modalName)

const paramsOrgId = useRoute().params.orgId
const paramsGroupId = useRoute().params.groupId
const paramsEventId = useRoute().params.eventId

const orgId = typeof paramsOrgId === 'string' ? paramsOrgId : undefined
const groupId = typeof paramsGroupId === 'string' ? paramsGroupId : undefined
const eventId = typeof paramsEventId === 'string' ? paramsEventId : undefined

const organizationStore = useOrganizationStore()
const groupStore = useGroupStore()
const eventStore = useEventStore()

let organization: Organization
let group: Group
let event: Event

const defaultSocialLinks: SocialLink[] = [
  { link: '', label: '', order: 0, creationDate: '', lastUpdated: '' }
]

const formData = ref<SocialLinkFormData[]>([
  { link: '', label: '', order: 0 }
])

const socialLinksRef = ref<
  OrganizationSocialLink[] | GroupSocialLink[] | EventSocialLink[] | SocialLink[]
>()

if (props.pageType === 'organization') {
  await organizationStore.fetchById(orgId)
  organization = organizationStore.organization
  socialLinksRef.value = organization.socialLinks
} else if (props.pageType === 'group') {
  await groupStore.fetchById(groupId)
  group = groupStore.group
  socialLinksRef.value = group.socialLinks
} else if (props.pageType === 'event') {
  await eventStore.fetchById(eventId)
  event = eventStore.event
  socialLinksRef.value = event.socialLinks
} else {
  socialLinksRef.value = defaultSocialLinks
}

function mapSocialLinksToFormData() {
  formData.value =
    socialLinksRef.value
      ?.filter(s => s.link?.trim() !== '' && s.label?.trim() !== '')
      .map(s => ({
        link: s.link,
        label: s.label,
        order: s.order
      })) || []
}

onMounted(() => {
  mapSocialLinksToFormData()
})

function onSubmit() {
  handleSubmit()
}

async function handleSubmit() {
  mapSocialLinksToFormData()

  let updateResponse = false
  if (props.pageType === 'organization') {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      formData.value
    )
  } else if (props.pageType === 'group') {
    updateResponse = await groupStore.updateSocialLinks(group, formData.value)
  } else if (props.pageType === 'event') {
    updateResponse = await eventStore.updateSocialLinks(event, formData.value)
  }

  if (updateResponse) {
    handleCloseModal()
  }
}

function addNewLink() {
  socialLinksRef.value?.push({
    link: '',
    label: '',
    order: socialLinksRef.value.length
  } as OrganizationSocialLink & GroupSocialLink & EventSocialLink & SocialLink)
}

async function removeLink(order: number): Promise<void> {
  const indexToRemove = socialLinksRef.value?.findIndex(
    link => link.order === order
  )

  if (indexToRemove !== undefined && indexToRemove >= 0) {
    socialLinksRef.value?.splice(indexToRemove, 1)
    socialLinksRef.value?.forEach((link, index) => {
      link.order = index
    })
    mapSocialLinksToFormData()
  }
}

// Validation schema (optional in this usage since we're not using the 'values' object directly)
const schema = z.object({
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1, 'Label is required'),
        link: z.string().url('Enter a valid URL')
      })
    )
    .optional()
})
</script>
