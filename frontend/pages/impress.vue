<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full px-6 py-6 md:py-10 lg:py-12 xl:py-16 lg:px-10 xl:px-14"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="../../images/content_pages/bootstrap_icons_info_circle_light.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="../../images/content_pages/bootstrap_icons_info_circle_dark.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div
          class="items-center space-y-2 text-left md:space-y-4 md:items-start"
        >
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="../../images/content_pages/bootstrap_icons_info_circle_light.png"
            alt="Drawing of a fist raised."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="../../images/content_pages/bootstrap_icons_info_circle_dark.png"
            alt="Drawing of a fist raised."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1
            class="pb-2 text-2xl font-semibold sm:text-3xl md:text-4xl sm:w-full xl:text-5xl"
          >
            Impress
          </h1>
          <p class="py-2">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-cta-orange dark:text-dark-cta-orange"
            />
            &nbsp; Please use the
            <a
              href="/help/contact"
              class="items-center text-light-cta-orange dark:text-dark-cta-orange hover:underline focus-brand"
            >
              contact page
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            for inquiries
          </p>
          <p>
            activist.org is a network for political action that allows people to
            coordinate and collaborate on the issues that matter most to them.
            The current goal is the creation of a central platform to discover
            activist organizations and their events.
          </p>
          <p>
            We are currently working on the legal entity behind activist.
            Further information will be available on this page once the
            arrangements are finalized. Thank you for your patience!
          </p>
          <ul>
            <li><strong>All inquiries:</strong></li>
            <li>
              <a
                href="mailto:team@activist.org"
                class="text-light-cta-orange dark:text-dark-cta-orange hover:underline focus-brand"
                >team@activist.org</a
              >
            </li>
          </ul>
          <p class="pb-2 lg:pb-4">We look forward to hearing from you :)</p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <LabeledBtn
              :cta="false"
              label="Return home"
              linkTo="/"
              fontSize="lg"
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="../../images/content_pages/bootstrap_icons_info_circle_light.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="../../images/content_pages/bootstrap_icons_info_circle_dark.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Impress");
</script>
