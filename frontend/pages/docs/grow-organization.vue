<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.grow-organization") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content for mobile. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="w-full md:hidden h-1/6"
        src="/images/content_pages/mockups/grow_organization_light.png"
        :alt="$t('pages.docs.grow-organization.modal-image-alt-text')"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="w-full md:hidden h-1/6"
        src="/images/content_pages/mockups/grow_organization_dark.png"
        :alt="$t('pages.docs.grow-organization.modal-image-alt-text')"
      />
      <div class="w-10/12 gap-16 2xl:grid 2xl:grid-cols-2 md:w-full">
        <ModalImage
          imageURL="/images/content_pages/mockups/grow_organization"
          imageAltText="pages.docs.grow-organization.modal-image-alt-text"
        />
        <div
          class="items-center text-left space-y-4 2xl:col-span-1 2xl:row-start-1 md:items-start"
        >
          <PageBreadcrumbs />
          <h1 class="pb-2 font-bold responsive-h1">
            {{ $t("pages.docs.grow-organization.header") }}
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
                href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=517%3A4852&t=ytDrcE8K3RrfCxM6-1"
                target="_blank"
              >
                {{ $t("pages.docs.grow-organization.subheader-2") }}
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
            {{ $t("pages.docs.grow-organization.section-1-paragraph-1") }}
          </p>
          <p>
            {{ $t("pages.docs.grow-organization.section-1-paragraph-2") }}
          </p>
          <p>
            {{ $t("pages.docs.grow-organization.section-1-paragraph-3-1") }}
            <strong>{{
              $t("pages.docs.grow-organization.section-1-paragraph-3-2")
            }}</strong>
            {{ $t("pages.docs.grow-organization.section-1-paragraph-3-3") }}
          </p>
          <p>
            {{ $t("pages.docs.grow-organization.section-1-paragraph-4") }}
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
