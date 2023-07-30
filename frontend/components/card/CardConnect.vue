<template>
  <div class="px-6 py-5 card-style">
    <div class="flex items-center gap-5">
      <h3 class="text-left responsive-h3 font-display">Connect</h3>
      <div
        class="p-1 break-all transition-all rounded-lg cursor-pointer hover:text-light-highlight dark:transition-all dark:hover:text-dark-highlight"
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
      class="flex flex-col items-start gap-2 mt-3 md:flex-row md:items-center md:gap-6"
    >
      <li v-for="link in socialLinksRef">
        <div
          class="flex items-center gap-3 break-all transition-all cursor-pointer"
          :class="{
            'hover:text-social-email': link.includes('email'),
            'hover:text-social-mastodon': link.includes('mastodon'),
            'hover:text-social-twitter': link.includes('twitter'),
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
            v-else-if="link.includes('twitter')"
            name="bi:twitter"
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
        v-bind:style="[
          editModeEnabled
            ? { visibility: 'visible' }
            : { visibility: 'hidden' },
        ]"
      >
        <Popover class="relative" v-slot="{ close }">
          <PopoverButton as="div">
            <BtnLabeled
              :cta="true"
              linkTo="placeholder-link"
              label="New account"
              fontSize="base"
              leftIcon="bi:plus-lg"
            />
          </PopoverButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <PopoverPanel class="absolute bottom-0 mb-12">
              <PopupNewField
                @on-cta-clicked="(account) => emit('on-new-account', account)"
                @on-close-clicked="onClose(close)"
                :title="'Add Account'"
                :field-name-prompt="'Name'"
                :cta-btn-label="'Add'"
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
  socialLinks: Array<string>;
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
