<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/icons/bootstrap_question_square_light.png"
        alt="A question mark within a square."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/icons/bootstrap_question_square_dark.png"
        alt="A question mark within a square."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_question_square_light.png"
            alt="A question mark within a square."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_question_square_dark.png"
            alt="A question mark within a square."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1 class="pb-2 font-bold responsive-h1">
            Frequently Asked Questions
          </h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            />
            <p>
              Please join our community in the
              <a
                href="https://matrix.to/#/#activist_community:matrix.org"
                class="items-center focus-brand link-text"
                target="_blank"
              >
                public Matrix chat rooms
                <Icon
                  name="bi:box-arrow-up-right"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              !
            </p>
          </div>
          <p class="font-bold responsive-h4">
            Q: What does the activist "a" mean?
          </p>
          <p class="sm:text-lg">
            The center of the letter represents an arrow that points left-center
            from the top. This symbolizes our community and direction: that we
            want to work with the left and center of the political spectrum and
            value a democratic movement of power down to the people. Other
            meanings are welcome :D
          </p>
          <p class="font-bold responsive-h4">
            Q: How does activist plan to prevent abuse?
          </p>
          <p class="sm:text-lg">
            The big focus of activist is organizations. We will start with a
            select few organizations based in Berlin where the core team is
            located, with further organizations being added through applications
            that need approval from the community. Users themselves will have a
            limited scope of interaction if they're not in an organization. When
            we get to a point where public discussions are happening, a user
            will only be able to participate if they're a member of an
            organization.
          </p>
          <p class="font-bold responsive-h4">Q: What about privacy?</p>
          <p class="sm:text-lg">
            Thank you for asking! Privacy is a major concern for the team as we
            understand that activism can be very dangerous. Working in the open
            allows our code to be checked for vulnerabilities, and we welcome
            feedback in this regard. Between functionality and privacy we will
            always choose the latter. This means that some features of activist
            will take longer to make sure that they're created in a way that
            keeps people safe.
          </p>
          <p class="font-bold responsive-h4">
            Q: What's the best way to get in touch?
          </p>
          <p class="sm:text-lg">
            activist uses Matrix for communications. You're welcome to
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="focus-brand link-text"
              >join us in our public chat rooms
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to share ideas, ask questions, find ways to help the platform grow
            or to just say hi :)
          </p>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_question_square_light.png"
            alt="A question mark within a square."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_question_square_dark.png"
            alt="A question mark within a square."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("FAQ");
</script>
