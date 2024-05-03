<template>
  <div class="card-style px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.connect") }}
      </h3>
      <div
        class="cursor-pointer break-all rounded-lg p-1 text-light-text transition-all hover:text-light-distinct-text dark:text-dark-text dark:hover:text-dark-distinct-text"
      >
        <Icon
          v-if="userIsAdmin && !editModeEnabled"
          @click="toggleEditMode"
          :name="IconMap.EDIT"
          size="1.2em"
        />
        <Icon
          v-else-if="userIsAdmin && editModeEnabled"
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
              label="components.btn-action.new-account"
              fontSize="sm"
              :leftIcon="IconMap.PLUS"
              iconSize="1.35em"
              ariaLabel="components._global.new-account-aria-label"
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
                :title="$t('components.card-connect.app-account-popup-title')"
                :fieldNamePrompt="
                  $t(
                    'components.card-connect.app-account-popup-field-name-prompt'
                  )
                "
                :fieldLabelPrompt="
                  $t(
                    'components.card-connect.app-account-popup-field-label-prompt'
                  )
                "
                :ctaBtnLabel="
                  $t('components.card-connect.app-account-popup-cta-btn-label')
                "
                :ctaBtnAriaLabel="
                  $t('components._global.new-account-aria-label')
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
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  socialLinks?: string[];
  userIsAdmin?: boolean;
}>();

const editModeEnabled = ref(false);
const socialLinksRef = computed(() => props.socialLinks);

const toggleEditMode = () => {
  editModeEnabled.value = !editModeEnabled.value;
};

const onClose = (close: (ref?: HTMLElement) => void) => {
  close();
};

const emit = defineEmits(["on-new-account", "on-account-removed"]);
</script>
