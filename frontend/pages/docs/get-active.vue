<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.get-active") }}</Title>
    </Head>
    <div
      class="responsive-py-4 responsive-px-5 flex w-full flex-col items-center"
    >
      <div class="flex w-10/12 items-start pb-2 md:w-full">
        <PageBreadcrumbs v-if="!aboveMediumBP" />
      </div>
      <!-- Note: image on top of content for mobile. -->
      <img
        v-if="!aboveMediumBP"
        class="h-1/6 w-full"
        :src="GET_ACTIVE_MOCKUP_URL + `_${$colorMode.value}.png`"
        :alt="$t('pages.docs.get-active.modal-image-alt-text')"
      />
      <div class="w-10/12 gap-16 md:w-full 2xl:grid 2xl:grid-cols-2">
        <ModalImageBtn
          v-if="aboveMediumBP"
          @click="openModal()"
          @keydown.enter="openModal()"
          class="block"
          :imageURL="GET_ACTIVE_MOCKUP_URL"
          imageAltText="pages.docs.get-active.modal-image-alt-text"
        />
        <ModalImage
          @closeModal="handleCloseModal"
          :imageURL="GET_ACTIVE_MOCKUP_URL"
          imageAltText="pages.docs.get-active.modal-image-alt-text"
          :isOpen="modalIsOpen"
        />
        <div
          class="items-center space-y-4 text-left md:items-start 2xl:col-span-1 2xl:row-start-1"
        >
          <PageBreadcrumbs v-if="aboveMediumBP" class="block" />
          <h1 class="responsive-h1 pb-2 font-bold">
            {{ $t("pages.docs.get-active.header") }}
          </h1>
          <div class="flex flex-row space-x-3 py-2">
            <Icon
              class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
              :name="IconMap.CIRCLE_INFO"
              size="1.25em"
            />
            <p>
              {{ $t("pages._global.see-the") }}
              <a
                class="focus-brand link-text items-center"
                href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=2475%3A19102&t=ytDrcE8K3RrfCxM6-1"
                target="_blank"
              >
                {{ $t("pages.docs.get-active.subheader-2") }}
                <Icon
                  :name="IconMap.EXTERNAL_LINK"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              {{ $t("pages._global.to-learn-more") }}
            </p>
          </div>
          <p>
            {{ $t("pages.docs.get-active.section-1-paragraph-1") }}
          </p>
          <p>{{ $t("pages.docs.get-active.section-2-paragraph-1") }}:</p>
          <ul class="list-disc pl-6 xl:pl-10">
            <li>
              {{ $t("pages.docs.get-active.section-2-list-1-item-1") }}
              <ul class="list-disc pl-4 xl:pl-6">
                <li>
                  {{ $t("pages.docs.get-active.section-2-list-1-item-1-1") }}
                </li>
              </ul>
            </li>
            <li>
              {{ $t("pages.docs.get-active.section-2-list-1-item-2") }}
              <ul class="list-disc pl-4 xl:pl-6">
                <li>
                  {{ $t("pages.docs.get-active.section-2-list-1-item-2-1") }}
                </li>
              </ul>
            </li>
            <li>
              {{ $t("pages.docs.get-active.section-2-list-1-item-3") }}
              <ul class="list-disc pl-4 xl:pl-6">
                <li>
                  {{ $t("pages.docs.get-active.section-2-list-1-item-3-1") }}
                </li>
                <li>
                  {{ $t("pages.docs.get-active.section-2-list-1-item-3-2") }}
                </li>
              </ul>
            </li>
          </ul>
          <p>
            {{ $t("pages.docs.get-active.section-3-paragraph-1") }}
          </p>
          <PageCommunityFooter>
            <BtnRouteExternal
              class="w-full"
              :cta="true"
              label="components.btn-route-external.request-access"
              :linkTo="REQUEST_ACCESS_URL"
              fontSize="lg"
              ariaLabel="
                components.btn-route-external.request-access-aria-label
              "
            />
            <BtnRouteInternal
              class="w-full"
              :cta="false"
              label="components.btn-route-internal.return-home"
              linkTo="/"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.return-home-aria-label"
            />
          </PageCommunityFooter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBreakpoint from "~/composables/useBreakpoint";
import { IconMap } from "~/types/icon-map";

const aboveMediumBP = useBreakpoint("md");

const modals = useModals();
const modalName = "ModalImage";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>
