<template>
  <div class="py-5 card-style px-7">
    <div class="flex items-center gap-5">
      <div class="text-left responsive-text-2 font-display">Connect</div>
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
      class="flex flex-col items-start my-3 gap-2 md:flex-row md:items-center md:gap-6"
    >
      <li v-for="link in socialLinksRef">
        <div
          class="flex items-center break-all cursor-pointer gap-3 transition-all"
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
          <Icon 
            v-if="link.includes('email')" 
            name="bi:envelope" 
            size="1.2em"
          />
          <Icon
            v-if="link.includes('mastodon')"
            name="bi:mastodon"
            size="1.2em"
          />
          <Icon
            v-if="link.includes('twitter')"
            name="bi:twitter"
            size="1.2em"
          />
          <Icon
            v-if="link.includes('facebook')"
            name="bi:facebook"
            size="1.2em"
          />
          <Icon
            v-if="link.includes('instagram')"
            name="bi:instagram"
            size="1.2em"
          />
          <div class="font-semibold">
            {{ link }}
          </div>
        </div>
      </li>
      <div v-bind:style="[editModeEnabled ? {'visibility': 'visible'} : {'visibility': 'hidden'}]">
        <!--TODO: Update this to use the LabeledBtn component once it supports prepended icons.-->
        <Popover class="relative" v-slot="{close}">
          <PopoverButton 
            as="div" 
            class="flex items-center px-4 py-1 font-semibold text-white break-all cursor-pointer select-none gap-1 rounded-md text-md bg-light-cta-orange hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange focus-brand">
              <Icon name="bi:plus" size="1.5em" />
              New account
          </PopoverButton>
          <PopoverPanel class="absolute z-10">
            <div class="px-3 py-2">
              <PopupNewField
                @on-cta-clicked="account => emit('on-new-account', account)"
                @on-close-clicked="onClose(close)"
                :title="'Add Account'"
                :field-name-prompt="'Name'"
                :cta-btn-label="'Add'">
              </PopupNewField>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

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
