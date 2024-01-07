<template>
  <ModalBase>
    <template #normalDisplay>
      <!-- Non-visible / dummy target to receive click event. Click event triggers ModalBase @click="openModal". -->
      <div id="clickTarget" style="display: none" />
    </template>
    <template #modalDisplay>
      <div
        class="flex w-5/6 justify-between grow items-center my-2.5 text-left transition duration-200 rounded-md select-none text-light-special-text dark:text-dark-special-text focus-within:border-light-link-text focus-within:border-2 dark:focus-within:border-dark-link-text focus-within:mb-[-3px] bg-light-header dark:bg-dark-header elem-shadow-sm"
      >
        <div class="flex items-center space-x-2 pl-1">
          <Icon
            class="flex-shrink-0 w-4 h-4 my-1"
            name="bi:search"
            size="1em"
          />

          <!-- TODO: Input area is much smaller that tag width. -->
          <input
            ref="input"
            class="w-16 h-5 bg-transparent outline-none"
            type="text"
            size="100"
            :placeholder="$t('_global.search')"
          />
        </div>
      </div>
      <DialogTitle class="font-display flex justify-between mt-5">
        <p class="text-3xl md:responsive-h2 font-bold">
          {{ $t("components.modal-command-palette.pages-header") }}
        </p>
      </DialogTitle>
      <!-- Source icons from nuxt-icon/icones.js (https://icones.js.org/). -->
      <!-- TODO: Sort out router-link target routes (the to="..." things). -->
      <router-link to="/">
        <div class="flex mt-2">
          <div>
            <Icon
              name="material-symbols:other-houses-outline"
              size="1em"
              :alt="$t('_global.home')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("_global.home") }}
            <span class="jump-link">
              {{ $t("components.modal-command-palette.jump-to") }}
            </span>
          </div>
        </div>
      </router-link>
      <router-link to="/events">
        <div class="flex mt-2">
          <div>
            <Icon
              name="material-symbols:event-available-sharp"
              size="1em"
              :alt="$t('components.modal-command-palette.upcoming-events')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("components.modal-command-palette.upcoming-events") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>
      <router-link to="/notifications">
        <div class="flex mt-2">
          <div>
            <Icon
              name="material-symbols:notifications-outline"
              size="1em"
              :alt="$t('_global.notifications')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("_global.notifications") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>
      <router-link to="/discussions">
        <div class="flex mt-2">
          <div>
            <Icon
              name="octicon:comment-discussion"
              size="1em"
              :alt="$t('_global.discussions')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("_global.discussions") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>

      <DialogTitle class="font-display flex justify-between mt-3">
        <p class="text-3xl md:responsive-h2 font-bold">
          {{ $t("_global.organization") }}
        </p>
      </DialogTitle>
      <router-link to="/organizations">
        <div class="flex mt-2">
          <div>
            <Icon
              name="codicon:organization"
              size="1em"
              :alt="$t('components.modal-command-palette.organization-stub')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("components.modal-command-palette.organization-stub") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>
      <router-link to="/organizations">
        <div class="flex mt-2">
          <div>
            <Icon
              name="codicon:organization"
              size="1em"
              :alt="$t('components.modal-command-palette.organization-stub')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("components.modal-command-palette.organization-stub") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>
      <router-link to="/organizations">
        <div class="flex mt-2">
          <div>
            <Icon
              name="codicon:organization"
              size="1em"
              :alt="$t('components.modal-command-palette.organization-stub')"
            />
          </div>
          <div class="group command-palette-element-hover">
            {{ $t("components.modal-command-palette.organization-stub") }}
            <span class="jump-link">{{
              $t("components.modal-command-palette.jump-to")
            }}</span>
          </div>
        </div>
      </router-link>
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
