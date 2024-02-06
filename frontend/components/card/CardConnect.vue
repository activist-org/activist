<template>
  <div class="px-5 py-5 card-style">
    <div class="flex items-center gap-5">
      <h3 class="text-left responsive-h3 font-display">
        {{ $t("components._global.connect") }}
      </h3>
      <div
        class="p-1 break-all rounded-lg cursor-pointer transition-all hover:text-light-highlight dark:transition-all dark:hover:text-dark-highlight"
      >
        <Icon
          v-if="userIsAdmin && !editModeEnabled"
          @click="toggleEditMode"
          name="bi:pencil-square"
          size="1.2em"
        />
        <Icon
          v-else-if="userIsAdmin && editModeEnabled"
          @click="toggleEditMode"
          name="bi:x-lg"
          size="1.2em"
        />
      </div>
    </div>
    <ul
      class="flex flex-col items-start mt-3 gap-2 md:flex-row md:items-center md:gap-6"
    >
      <li v-for="link in socialLinksRef">
        <div
          class="flex items-center break-all cursor-pointer gap-3 transition-all"
          :class="{
            'hover:text-social-email': link.includes('email'),
            'hover:text-social-mastodon': link.includes('mastodon'),
            'hover:text-social-facebook': link.includes('facebook'),
            'hover:text-social-instagram': link.includes('instagram'),
          }"
        >
          <Icon
            v-if="editModeEnabled"
            @click="emit('on-account-removed', link)"
            name="bi:x-lg"
            size="1em"
          />
          <Icon v-if="link.includes('email')" name="bi:envelope" size="1.2em" />
          <Icon
            v-else-if="link.includes('mastodon')"
            name="bi:mastodon"
            size="1.2em"
          />
          <Icon
            v-else-if="link.includes('facebook')"
            name="bi:facebook"
            size="1.2em"
          />
          <Icon
            v-else-if="link.includes('instagram')"
            name="bi:instagram"
            size="1.2em"
          />
          <Icon v-else name="bi:link-45deg" size="1.2em" />
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
              leftIcon="bi:plus-lg"
              ariaLabel="components.btn-action.new-account-aria-label"
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
                @on-cta-clicked="emit('on-new-account', account)"
                @on-close-clicked="onClose(close)"
                :title="$t('components.card-connect.app-account-popup-title')"
                :fieldNamePrompt="
                  $t(
                    'components.card-connect.app-account-popup-field-name-prompt'
                  )
                "
                :ctaBtnLabel="
                  $t('components.card-connect.app-account-popup-cta-btn-label')
                "
                :ctaBtnAriaLabel="
                  $t(
                    'components.card-connect.app-account-popup-cta-btn-aria-label'
                  )
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
