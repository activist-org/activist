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
        src="/images/content_pages/icons/bootstrap_trademark_light.png"
        alt="The trademark symbol - tm within a square.."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/icons/bootstrap_trademark_dark.png"
        alt="The trademark symbol - tm within a square.."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_trademark_light.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_trademark_dark.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1 class="pb-2 font-bold responsive-text-4">Trademark Policy</h1>
          <p
            class="responsive-text-1 text-light-special-text dark:text-dark-special-text"
          >
            Last updated May 1st, 2023
          </p>
          <p>
            The activist name and logos are trademarks of activist.org, soon to
            be incorporated as activist gGmbH. As such, their use is restricted
            and protected by intellectual property law. While the software we
            create is available under a free and open source software license,
            the copyright license does not include an implied right or license
            to use our trademarks.
          </p>
          <p>
            The role of trademarks is to prevent the exploitation of the good
            name and reputation of activist.org by other people and
            organizations, and to provide assurance about the quality of the
            products and services associated with it.
          </p>
          <p>
            To use our trademarks beyond what is considered "fair" or
            "nominative" use, you must follow these guidelines. By making use of
            our trademarks, you agree to abide by the following terms and
            conditions.
          </p>
          <p>
            You agree to defend and indemnify activist.org from and against any
            and all claims and losses brought by a third party in connection
            with your use of the activist.org trademarks.
          </p>
          <p>
            To request the use of the activist name and logos in a way not
            covered in these guidelines, or to report violations, please contact
            us at
            <a href="mailto:team@activist.org" class="focus-brand link-text"
              >team@activist.org</a
            >. In the event that we do not approve such use of the activist name
            and logos within fourteen (14) business days, your request shall be
            deemed denied.
          </p>
          <h2 class="font-bold responsive-text-2">General guidelines</h2>
          <ul class="ml-6 list-disc">
            <li>
              Only use the activist marks to accurately identify those goods or
              services that are built by the activist.org organization.
            </li>
            <li>
              Do not use the activist marks in any way that could mistakenly
              imply that activist.org has reviewed, approved, or guaranteed your
              goods or services.
            </li>
            <li>
              Do not use or register, in whole or in part, the activist marks as
              part of your own or any other trademark, service mark, domain
              name, company name, trade name, product name, or service name.
            </li>
            <li>
              Do not use the activist marks in a manner that disparages or
              defames the marks, activist.org, or other products associated with
              activist.org.
            </li>
            <li>
              You may use the activist word mark in referential phrases such as
              "for", "as found on", etc.
            </li>
            <li>
              You may use the activist marks when embedding or otherwise
              displaying user generated content published using the activist
              software.
            </li>
            <li>
              Do not change or modify the activist marks aside from color
              adjustments.
            </li>
            <li>
              Any all use of the activist marks, and any goodwill accrued as a
              result of that use, belongs entirely to, and shall inure for the
              benefit of, activist.org.
            </li>
          </ul>
          <h2 class="font-bold responsive-text-2">
            Open source project guidelines
          </h2>
          <p>
            If you choose to build on or modify activist's open-source code,
            beyond modifications limited to switching on or off features already
            included in the software, minor tweaks in visual appearance,
            translations into other languages, and bug fixes:
          </p>
          <ul class="ml-6 list-disc">
            <li>
              You must choose your own branding, logos, and trademarks that
              denote your unique identity so as to clearly signal to users that
              there is no affiliation with or endorsement by activist.org.
            </li>
            <li>
              You may use word marks, but not our logos, in truthful statements
              that describe the relationship between your software and ours, for
              example "this software is derived from the source code of
              activist.org".
            </li>
          </ul>
          <h2 class="font-bold responsive-text-2">Social media guidelines</h2>
          <ul class="ml-6 list-disc">
            <li>
              In addition, activist logos cannot be used in a way that might
              suggest affiliation with or endorsement by activist.
            </li>
          </ul>
          <h2 class="font-bold responsive-text-2">Contact Us</h2>
          <p>
            Please contact us if you have any questions, comments, or concerns
            about this Trademark Policy. We welcome feedback from our users and
            are always looking for ways to improve our platform and better serve
            our community.
          </p>
          <p class="pb-2 lg:pb-4">
            Interested in helping? Please visit us
            <a
              href="https://github.com/orgs/activist-org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              on GitHub
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to contribute code, translations or suggestions to the project.
            You're also welcome to join us in our
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
            to share ideas, ask questions or just say hi :)
          </p>
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
            src="/images/content_pages/icons/bootstrap_trademark_light.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_trademark_dark.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Trademark");
</script>
