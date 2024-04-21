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
        <PageBreadcrumbs class="md:hidden" />
      </div>
      <!-- Note: image on top of content for mobile. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="h-1/6 w-full md:hidden"
        src="/images/content_pages/mockups/get_active_light.png"
        :alt="$t('pages.docs.get-active.modal-image-alt-text')"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-1/6 w-full md:hidden"
        src="/images/content_pages/mockups/get_active_dark.png"
        :alt="$t('pages.docs.get-active.modal-image-alt-text')"
      />
      <div class="w-10/12 gap-16 md:w-full 2xl:grid 2xl:grid-cols-2">
        <ModalImage
          imageURL="/images/content_pages/mockups/get_active"
          imageAltText="pages.docs.get-active.modal-image-alt-text"
        />
        <div
          class="items-center space-y-4 text-left md:items-start 2xl:col-span-1 2xl:row-start-1"
        >
          <PageBreadcrumbs class="hidden md:block" />
          <h1 class="responsive-h1 pb-2 font-bold">
            {{ $t("pages.docs.get-active.header") }}
          </h1>
          <div class="flex flex-row space-x-3 py-2">
            <Icon
              class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
              name="bi:info-circle-fill"
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
                  name="bi:box-arrow-up-right"
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
              linkTo="https://tally.so/r/nprxbq"
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
