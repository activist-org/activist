<template>
  <ModalBase>
    <template #normalDisplay>
      <!-- Dummy target to receive click event. A click event triggers ModalBase. -->
      <div id="clickTarget" style="display: none" />
    </template>
    <template #modalDisplay>
      <div
        class="text-light-distinct-text dark:text-dark-distinct-text focus-inside bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm my-2.5 flex w-[90%] grow select-none items-center justify-between rounded-md px-2 py-1 text-left transition duration-200"
      >
        <div class="flex items-center space-x-2 pl-1">
          <Icon name="bi:search" size="1em" />
          <label for="search-input" class="sr-only">{{
            $t("_global.search")
          }}</label>
          <input
            ref="input"
            id="search-input"
            class="bg-transparent outline-none"
            type="text"
            size="100"
            :placeholder="$t('_global.search')"
          />
        </div>
      </div>
      <DialogTitle class="font-display mt-5 flex justify-between">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components.modal-command-palette.pages-header") }}
        </p>
      </DialogTitle>
      <NuxtLink class="focus-brand flex rounded-md" :to="localePath('/home')">
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon name="bi:house" size="1em" :alt="$t('_global.home')" />
          <div>
            {{ $t("_global.home") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
            >
              {{ $t("components.modal-command-palette.jump-to") }}
            </span>
          </div>
        </div>
      </NuxtLink>
      <NuxtLink class="focus-brand flex rounded-md" :to="localePath('/events')">
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon
            name="bi:calendar-check"
            size="1em"
            :alt="$t('components.modal-command-palette.upcoming-events')"
          />
          <div>
            {{ $t("components.modal-command-palette.upcoming-events") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="focus-brand flex rounded-md"
        :to="localePath('/notifications')"
      >
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon name="bi:bell" size="1em" :alt="$t('_global.notifications')" />
          <div>
            {{ $t("_global.notifications") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="focus-brand flex rounded-md"
        :to="localePath('/discussions')"
      >
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon
            name="octicon:comment-discussion-24"
            size="1em"
            :alt="$t('_global.discussions')"
          />
          <div>
            {{ $t("_global.discussions") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <DialogTitle class="font-display mt-3 flex justify-between">
        <p class="md:responsive-h3 pb-3 text-3xl font-bold">
          {{ $t("components._global.organizations") }}
        </p>
      </DialogTitle>
      <NuxtLink
        class="focus-brand flex rounded-md"
        :to="localePath('/organizations')"
      >
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon
            class="fill-light-text dark:fill-dark-text"
            name="IconOrganization"
            size="1em"
            :alt="$t('_global.organization-name')"
          />
          <div>
            {{ $t("_global.organization-name") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="focus-brand flex rounded-md"
        :to="localePath('/organizations')"
      >
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon
            class="fill-light-text dark:fill-dark-text"
            name="IconOrganization"
            size="1em"
            :alt="$t('_global.organization-name')"
          />
          <div>
            {{ $t("_global.organization-name") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="focus-brand flex rounded-md"
        :to="localePath('/organizations')"
      >
        <div
          class="hover:bg-light-highlight hover:dark:bg-dark-highlight group relative flex w-full items-center space-x-2 rounded-md px-2 py-1"
        >
          <Icon
            class="fill-light-text dark:fill-dark-text"
            name="IconOrganization"
            size="1em"
            :alt="$t('_global.organization-name')"
          />
          <div>
            {{ $t("_global.organization-name") }}
            <span
              class="link-text invisible absolute right-3 w-16 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
    </template>
  </ModalBase>
</template>

<script setup>
import { useMagicKeys, whenever } from "@vueuse/core";

const { isMacOS } = useDevice();

const { meta_k, ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (["meta_k", "ctrl_k"].includes(e.key) && e.type === "keydown")
      e.preventDefault();
  },
});

whenever(meta_k, () => {
  if (isMacOS) {
    doWhenever();
  }
});
whenever(ctrl_k, () => {
  if (!isMacOS) {
    doWhenever();
  }
});

const doWhenever = () => {
  // Trigger ModalBase @click="openModal".
  document.getElementById("clickTarget").click();
};
</script>
