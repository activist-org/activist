<template>
  <div class="card-style px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.connect") }}
      </h3>
      <div
        class="cursor-pointer break-all rounded-lg p-1 text-light-text transition-all hover:text-light-distinct-text dark:text-dark-text dark:hover:text-dark-distinct-text"
      >
        <IconEdit
          v-if="userIsSignedIn && !editModeEnabled"
          @click="toggleEditMode"
        />
        <Icon
          v-else-if="userIsSignedIn && editModeEnabled"
          @click="toggleEditMode"
          :name="IconMap.X_LG"
          size="1.2em"
        />
      </div>
    </div>
    <ul
      class="mt-3 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-6"
    >
      <li v-for="link in socialLinksRef">
        <div
          class="flex cursor-pointer items-center gap-3 break-all text-light-text transition-all hover:text-light-distinct-text dark:text-dark-text dark:hover:text-dark-distinct-text"
        >
          <Icon
            v-if="editModeEnabled"
            @click="emit('on-account-removed', link)"
            :name="IconMap.EDIT"
            size="1em"
          />
          <Icon
            v-else-if="link.includes('mastodon')"
            :name="IconMap.MASTODON"
            size="1.2em"
          />
          <Icon
            v-else-if="link.includes('facebook')"
            :name="IconMap.FACEBOOK"
            size="1.2em"
          />
          <Icon
            v-else-if="link.includes('instagram')"
            :name="IconMap.INSTAGRAM"
            size="1.2em"
          />
          <Icon v-else :name="IconMap.LINK" size="1.2em" />
          <div class="font-semibold">
            {{ link }}
          </div>
        </div>
      </li>
      <div
        :class="{
          block: editModeEnabled,
          hidden: !editModeEnabled,
        }"
      >
        <Popover v-slot="{ close }" class="relative">
          <PopoverButton as="div">
            <BtnAction
              :cta="true"
              label="components.card_connect.new_account"
              fontSize="sm"
              :leftIcon="IconMap.PLUS"
              iconSize="1.35em"
              ariaLabel="components.card_connect.new_account_aria_label"
            />
          </PopoverButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel class="absolute bottom-0 mb-12">
              <PopupNewField
                @on-cta-clicked="emit('on-new-account')"
                @on-close-clicked="onClose(close)"
                :title="$t('components.card_connect.app_account_popup_title')"
                :fieldNamePrompt="
                  $t(
                    'components.card_connect.app_account_popup_field_name_prompt'
                  )
                "
                :fieldLabelPrompt="
                  $t(
                    'components.card_connect.app_account_popup_field_label_prompt'
                  )
                "
                :ctaBtnLabel="
                  $t('components.card_connect.app_account_popup_cta_btn_label')
                "
                :ctaBtnAriaLabel="
                  $t('components.card_connect.new_account_aria_label')
                "
              />
            </PopoverPanel>
          </transition>
        </Popover>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import type { Group } from "~/types/entities/group";
import type { Organization } from "~/types/entities/organization";
import type { Event } from "~/types/events/event";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const { userIsSignedIn } = useUser();
const paramsId = useRoute().params.id;
const paramsIdGroup = useRoute().params.groupId;

const id = typeof paramsId === "string" ? paramsId : undefined;
const idGroup = typeof paramsIdGroup === "string" ? paramsIdGroup : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

let organization: Organization;
let group: Group;
let event: Event;

if (props.pageType == "organization") {
  await organizationStore.fetchById(id);
  organization = organizationStore.organization;
} else if (props.pageType == "group") {
  await groupStore.fetchById(idGroup);
  group = groupStore.group;
} else if (props.pageType == "event") {
  await eventStore.fetchById(id);
  event = eventStore.event;
}

const editModeEnabled = ref(false);
const socialLinksRef = computed<string[]>(() => {
  if (props.pageType == "organization") {
    return organization.socialLinks;
  } else if (props.pageType == "group") {
    return group.socialLinks;
  } else if (props.pageType == "event") {
    return event.socialLinks;
  } else {
    return [""];
  }
});

const toggleEditMode = () => {
  editModeEnabled.value = !editModeEnabled.value;
};

const onClose = (close: (ref?: HTMLElement) => void) => {
  close();
};

const emit = defineEmits(["on-new-account", "on-account-removed"]);
</script>
