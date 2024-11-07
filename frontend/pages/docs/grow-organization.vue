<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.grow_organization") }}</Title>
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
        :src="GROW_ORGANIZATION_MOCKUP_URL + `_${$colorMode.value}.png`"
        :alt="$t('pages.docs.grow_organization.modal_image_alt_text')"
      />
      <div class="w-10/12 gap-16 md:w-full 2xl:grid 2xl:grid-cols-2">
        <ModalImageBtn
          v-if="aboveMediumBP"
          @click="openModal()"
          @keydown.enter="openModal()"
          class="block"
          :imgUrl="GROW_ORGANIZATION_MOCKUP_URL"
          imageAltText="pages.docs.grow_organization.modal_image_alt_text"
        />
        <ModalImage
          @closeModal="handleCloseModal"
          :imgUrl="GROW_ORGANIZATION_MOCKUP_URL"
          imageAltText="pages.docs.grow_organization.modal_image_alt_text"
          :isOpen="modalIsOpen"
        />
        <div
          class="items-center space-y-4 text-left md:items-start 2xl:col-span-1 2xl:row-start-1"
        >
          <PageBreadcrumbs v-if="aboveMediumBP" class="block" />
          <h1 class="responsive-h1 pb-2 font-bold">
            {{ $t("pages.docs.grow_organization.header") }}
          </h1>
          <div class="flex flex-row space-x-3 py-2">
            <Icon
              class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
              :name="IconMap.CIRCLE_INFO"
              size="1.25em"
            />
            <p>
              {{ $t("pages._global.see_the") }}
              <a
                class="focus-brand link-text items-center"
                href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=517%3A4852&t=ytDrcE8K3RrfCxM6-1"
                target="_blank"
              >
                {{ $t("pages.docs.grow_organization.subheader_2") }}
                <Icon
                  :name="IconMap.EXTERNAL_LINK"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              {{ $t("pages._global.to_learn_more") }}
            </p>
          </div>
          <p>
            {{ $t("pages.docs.grow_organization.section_1_paragraph_1") }}
          </p>
          <p>
            {{ $t("pages.docs.grow_organization.section_1_paragraph_2") }}
          </p>
          <p>
            {{ $t("pages.docs.grow_organization.section_1_paragraph_3_1") }}
            <strong>{{
              $t("pages.docs.grow_organization.section_1_paragraph_3_2")
            }}</strong>
            {{ $t("pages.docs.grow_organization.section_1_paragraph_3_3") }}
          </p>
          <p>
            {{ $t("pages.docs.grow_organization.section_1_paragraph_4") }}
          </p>
          <PageCommunityFooter>
            <BtnRouteExternal
              class="w-full"
              :cta="true"
              label="_global.request_access"
              :linkTo="REQUEST_ACCESS_URL"
              fontSize="lg"
              ariaLabel="
                _global.request_access-aria-label
              "
            />
            <BtnRouteInternal
              class="w-full"
              :cta="false"
              label="_global.return_home"
              linkTo="/"
              fontSize="lg"
              ariaLabel="_global.return_home_aria_label"
            />
          </PageCommunityFooter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
