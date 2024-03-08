<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.get-organized") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content for mobile. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="w-full md:hidden h-1/6"
        src="/images/content_pages/mockups/get_organized_light.png"
        :alt="$t('pages.docs.get-organized.modal-image-alt-text')"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="w-full md:hidden h-1/6"
        src="/images/content_pages/mockups/get_organized_dark.png"
        :alt="$t('pages.docs.get-organized.modal-image-alt-text')"
      />
      <div class="w-10/12 gap-16 2xl:grid 2xl:grid-cols-2 md:w-full">
        <ModalImage
          imageURL="/images/content_pages/mockups/get_organized"
          imageAltText="pages.docs.get-organized.modal-image-alt-text"
        />
        <div
          class="items-center text-left space-y-4 2xl:col-span-1 2xl:row-start-1 md:items-start"
        >
          <PageBreadcrumbs />
          <h1 class="pb-2 font-bold responsive-h1">
            {{ $t("pages.docs.get-organized.header") }}
          </h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
              name="bi:info-circle-fill"
              size="1.25em"
            />
            <p>
              {{ $t("pages._global.see-the") }}
              <a
                class="items-center focus-brand link-text"
                href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=62%3A2&t=ytDrcE8K3RrfCxM6-1"
                target="_blank"
              >
                {{ $t("pages.docs.get-organized.subheader-2") }}
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
            {{ $t("pages.docs.get-organized.section-1-paragraph-1") }}
          </p>
          <p>
            {{ $t("pages.docs.get-organized.section-1-paragraph-2") }}
          </p>
          <p>
            {{ $t("pages.docs.get-organized.section-1-paragraph-3") }}
          </p>
          <p class="pb-2 md:pb-4">
            {{ $t("pages.docs.get-organized.section-1-paragraph-4-1") }}
            <a
              class="items-center focus-brand link-text"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              {{ $t("pages._global.public-matrix-chat-rooms") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.docs.get-organized.section-1-paragraph-4-5") }}
          </p>
          <div
            class="grid grid-cols-1 max-w-[70%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[80%] grid-rows-2 gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 mx-auto sm:mx-0 sm:grid-cols-2 sm:grid-rows-1"
          >
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
