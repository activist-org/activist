<template>
  <div class="py-5 card-style px-6">
    <div class="flex items-center gap-5">
      <h3 class="text-left responsive-h3 font-display">Connect</h3>
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
      <li v-for="link in socialLinks">
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
            @click="removeLinksEntry"
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
      <div v-if="editModeEnabled">
        <!--TODO: Update this to use the LabeledBtn component once it supports prepended icons.-->
        <div
          @click="emit('on-new-account')"
          class="flex items-center px-4 py-1 font-semibold text-white break-all cursor-pointer select-none gap-1 rounded-md text-md bg-light-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange focus-brand"
        >
          <Icon name="bi:plus" size="1.5em" />
          New account
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  socialLinks: Array<string>;
  userIsAdmin?: boolean;
}>();

const editModeEnabled = ref(false);

const toggleEditMode = () => {
  editModeEnabled.value = !editModeEnabled.value;
};

const removeLinksEntry = (link: string) => {};

const emit = defineEmits(["on-new-account"]);
</script>
