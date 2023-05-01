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
        src="/images/content_pages/bootstrap_icons_shield_check_light.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/bootstrap_icons_shield_check_dark.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div
          class="items-center text-left space-y-2 md:space-y-4 md:items-start"
        >
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/bootstrap_icons_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/bootstrap_icons_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1
            class="pb-2 text-2xl font-semibold sm:text-3xl md:text-4xl sm:w-full xl:text-5xl"
          >
            Privacy Policy
          </h1>
          <p>
            At activist.org, we value your privacy and are committed to
            maintaining the trust and confidence of our users. This Privacy
            Policy explains how we handle your information and the choices you
            have regarding your information.
          </p>
          <p>
            By using activist.org, you agree to the provisions of this Privacy
            Policy. Our primary goal is to provide a platform that allows users
            to engage in activism without compromising their privacy. We have
            implemented various measures to ensure the privacy and security of
            our users. If you have any questions or concerns, please contact us.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">Information We Collect</h2>
          <p>
            activist.org does not collect any personal information from our
            users. We do not collect data such as names, email addresses, phone
            numbers, or any other information that can be used to identify you
            personally at this time. Our platform is designed to provide a safe
            and private environment for activism and collaboration.
          </p>
          <p>
            As an open-source platform, we prioritize transparency and user
            control. We encourage users to contribute to activist.org and share
            their ideas, questions, and concerns. We also strive to provide a
            platform that fosters inclusivity and support for all users,
            regardless of their background.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">How We Use Information</h2>
          <p>
            As we do not collect personal information, we do not use any such
            information for any purpose. Our goal is to provide a platform that
            allows users to engage in activism without compromising their
            privacy.
          </p>
          <p>
            We aim to foster a sense of community and collaboration among users,
            allowing them to connect with like-minded individuals and
            organizations. We also work to provide resources and tools that
            enable users to learn about and engage with important social,
            political, and environmental issues.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">
            Data Sharing and Third-Party Services
          </h2>
          <p>
            We do not share your personal information with any third parties,
            nor do we use any third-party services that collect or process
            personal information. activist.org is dedicated to ensuring the
            privacy of our users and maintaining a secure platform.
          </p>
          <p>
            As an open-source platform, we collaborate with various
            organizations and individuals who share our values and goals. We
            strive to build partnerships that enhance the functionality and
            reach of activist.org while maintaining our commitment to user
            privacy and security.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">
            Data Security and Breaches
          </h2>
          <p>
            We are committed to protecting the security of our platform and the
            information of our users. In the event of a data breach, we will
            promptly notify affected users and take appropriate measures to
            address the situation.
          </p>
          <p>
            We implement various security measures, such as encryption and
            secure connections, to protect the integrity of our platform and the
            safety of our users. We also encourage users to practice good
            security habits, such as using strong passwords and enabling
            two-factor authentication when available.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">Your Rights</h2>
          <p>
            As we do not collect personal information, you do not need to worry
            about exercising any rights related to your personal data. However,
            if you have any questions or concerns about this Privacy Policy or
            our practices, please feel free to contact us.
          </p>
          <p>
            We are committed to transparency and user control. We encourage
            users to contribute to activist.org and participate in discussions
            about privacy, security, and other important topics. By engaging
            with our community, you can help shape the future of activist.org
            and ensure that it remains a safe, inclusive, and empowering
            platform for all.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            significant changes, we will notify you through the platform or by
            other means. By continuing to use activist.org after any changes are
            in effect, you agree to the updated Privacy Policy.
          </p>
          <p>
            We encourage users to regularly review this Privacy Policy to stay
            informed about our privacy practices and any changes that may occur.
            Your continued use of activist.org constitutes your acceptance of
            any updates to our Privacy Policy.
          </p>
          <h2 class="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p>
            Please contact us if you have any questions, comments, or concerns
            about this Privacy Policy or our practices. We welcome feedback from
            our users and are always looking for ways to improve our platform
            and better serve our community.
          </p>
          <p>
            That also means building a user experience that is easy and fun to
            use while establishing security best-practices from the very
            beginning. From signup to regularly organizing events. Imagine every
            person new to activism showing up well-prepared to their first
            meeting — guided by the knowledge and tools of veteran organizers —
            and immediately being able to contribute a meaningful cause.
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
            src="/images/content_pages/bootstrap_icons_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/bootstrap_icons_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Privacy");
</script>
