<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/icons/arcticons_bike_location_light.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/icons/arcticons_bike_location_dark.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center space-y-4 text-left md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/arcticons_bike_location_light.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/arcticons_bike_location_dark.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <h1 class="pb-2 font-bold responsive-text-4">Roadmap</h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            />
            <p>
              See the
              <a
                href="https://github.com/activist-org/activist"
                class="items-center focus-brand link-text"
                target="_blank"
              >
                source code on GitHub
                <Icon
                  name="bi:box-arrow-up-right"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              to learn more
            </p>
          </div>
          <p>
            activist.org is open-source software. Our goal is to build in as
            transparent a manner as possible so that partner organizations and
            our community can have as much input on the process as possible.
          </p>
          <p class="pb-2 lg:pb-4">
            Please visit us at our
            <a
              href="https://github.com/orgs/activist-org/projects/1"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              GitHub project space
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            for a full overview of the current issues and features being worked
            on. You're also welcome to join us in our public
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              Matrix chat rooms
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to share ideas, ask questions or just say hi :)
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <LabeledBtn
              :cta="true"
              label="Suggest a feature"
              linkTo="https://github.com/activist-org/activist/issues"
              fontSize="lg"
            />
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
            src="/images/content_pages/icons/arcticons_bike_location_light.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/arcticons_bike_location_dark.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Roadmap");
</script>
