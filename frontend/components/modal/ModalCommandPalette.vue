<template>
  <ModalBase>
    <template #normalDisplay>
      <!-- Dummy target to receive click event. A click event triggers ModalBase. -->
      <div id="clickTarget" style="display: none" />
    </template>
    <template #modalDisplay>
      <div
        class="flex w-[90%] justify-between grow items-center my-2.5 text-left transition duration-200 rounded-md select-none text-light-special-text dark:text-dark-special-text focus-inside bg-light-header dark:bg-dark-header elem-shadow-sm py-1 px-2"
      >
        <div class="flex items-center pl-1 space-x-2">
          <Icon name="bi:search" size="1em" />
          <input
            ref="input"
            class="bg-transparent outline-none"
            type="text"
            size="100"
            :placeholder="$t('_global.search')"
          />
        </div>
      </div>
      <DialogTitle class="flex justify-between mt-5 font-display">
        <p class="pb-3 text-3xl font-bold md:responsive-h3">
          {{ $t("components.modal-command-palette.pages-header") }}
        </p>
      </DialogTitle>
      <NuxtLink class="flex rounded-md focus-brand" :to="localePath('/home')">
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
        >
          <Icon name="bi:house" size="1em" :alt="$t('_global.home')" />
          <div>
            {{ $t("_global.home") }}
            <span
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
            >
              {{ $t("components.modal-command-palette.jump-to") }}
            </span>
          </div>
        </div>
      </NuxtLink>
      <NuxtLink class="flex rounded-md focus-brand" :to="localePath('/events')">
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
        >
          <Icon
            name="bi:calendar-check"
            size="1em"
            :alt="$t('components.modal-command-palette.upcoming-events')"
          />
          <div>
            {{ $t("components.modal-command-palette.upcoming-events") }}
            <span
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="flex rounded-md focus-brand"
        :to="localePath('/notifications')"
      >
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
        >
          <Icon name="bi:bell" size="1em" :alt="$t('_global.notifications')" />
          <div>
            {{ $t("_global.notifications") }}
            <span
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="flex rounded-md focus-brand"
        :to="localePath('/discussions')"
      >
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
        >
          <Icon
            name="octicon:comment-discussion-24"
            size="1em"
            :alt="$t('_global.discussions')"
          />
          <div>
            {{ $t("_global.discussions") }}
            <span
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <DialogTitle class="flex justify-between mt-3 font-display">
        <p class="pb-3 text-3xl font-bold md:responsive-h3">
          {{ $t("components._global.organizations") }}
        </p>
      </DialogTitle>
      <NuxtLink
        class="flex rounded-md focus-brand"
        :to="localePath('/organizations')"
      >
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
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
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="flex rounded-md focus-brand"
        :to="localePath('/organizations')"
      >
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
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
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
              >{{ $t("components.modal-command-palette.jump-to") }}</span
            >
          </div>
        </div>
      </NuxtLink>
      <NuxtLink
        class="flex rounded-md focus-brand"
        :to="localePath('/organizations')"
      >
        <div
          class="relative flex items-center w-full px-2 py-1 space-x-2 rounded-md group hover:bg-light-highlight hover:dark:bg-dark-highlight"
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
              class="absolute invisible w-16 link-text right-3 group-hover:visible"
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
