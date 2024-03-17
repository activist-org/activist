<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.contact") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/bootstrap_envelope"
      imgAltText="pages.help._global.contact-img-alt-text"
    >
      <div
        v-if="!emailSent"
        class="items-center text-left space-y-4 md:items-start"
      >
        <h1 class="pb-2 font-bold responsive-h1">
          {{ $t("pages.help.contact.header") }}
        </h1>
        <div class="flex flex-row py-2 space-x-3">
          <Icon
            class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            name="bi:info-circle-fill"
            size="1.25em"
          />
          <p>
            {{ $t("pages.help.faq.subheader-1") }}
            <a
              class="items-center focus-brand link-text"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            !
          </p>
        </div>
        <div class="flex flex-col space-y-4 lg:space-y-6">
          <p>
            {{ $t("pages.help.contact.section-1-paragraph-1-1") }}
            <a
              class="items-center focus-brand link-text"
              href="https://matrix.to/#/#activist_community:matrix.org"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.contact.section-1-paragraph-1-3") }}
            <a
              class="items-center focus-brand link-text"
              href="https://github.com/activist-org/activist"
            >
              {{ $t("components.page-community-footer.invite-text-2-2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.contact.section-1-paragraph-1-5") }}
          </p>
          <p>
            {{ $t("pages.help.contact.section-1-paragraph-2-1") }}
            <a
              class="items-center focus-brand link-text"
              href="https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md"
              target="_blank"
            >
              {{ $t("pages.help.contact.section-1-paragraph-2-2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              /> </a
            >.
          </p>
        </div>
        <div>
          <form @submit.prevent="sendEmail" class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-2">
              <label
                :class="{
                  'text-light-action-red dark:text-dark-action-red':
                    !nameValidated,
                  'text-light-text dark:text-dark-text': nameValidated,
                }"
                for="name"
                >{{ $t("pages._global.name-label") }}
                <span v-if="!nameValidated">{{
                  $t("pages.help.contact.error-empty")
                }}</span></label
              >
              <input
                v-model="name"
                @blur="validateName"
                id="name"
                class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-layer-1 focus:dark:bg-dark-layer-1 text-light-text dark:text-dark-text"
                :class="{
                  'outline-light-action-red dark:outline-dark-action-red outline outline-2':
                    !nameValidated,
                  'outline-none focus:outline-none': nameValidated,
                }"
                :placeholder="$t('pages.help.contact.name-placeholder')"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label
                :class="{
                  'text-light-action-red dark:text-dark-action-red':
                    !emailValidated,
                  'text-light-text dark:text-dark-text': emailValidated,
                }"
                for="email"
                >{{ $t("pages.help.contact.email-label") }}
                <span v-if="!emailValidated"
                  >{{
                    $t("pages.help.contact.valid")
                  }}
                  (example@mail.com).</span
                ></label
              >
              <input
                v-model="email"
                @blur="validateEmail"
                id="email"
                class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-layer-1 focus:dark:bg-dark-layer-1 text-light-text dark:text-dark-text"
                :class="{
                  'outline-light-action-red dark:outline-dark-action-red outline outline-2':
                    !emailValidated,
                  'outline-none focus:outline-none': emailValidated,
                }"
                :placeholder="$t('pages.help.contact.email-placeholder')"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label
                :class="{
                  'text-light-action-red dark:text-dark-action-red':
                    !subjectValidated,
                  'text-light-text dark:text-dark-text': subjectValidated,
                }"
                for="subject"
                >{{ $t("pages.help.contact.subject-label") }}
                <span v-if="!subjectValidated">{{
                  $t("pages.help.contact.error-empty")
                }}</span></label
              >
              <input
                v-model="subject"
                @blur="validateSubject"
                id="subject"
                class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-layer-1 focus:dark:bg-dark-layer-1 text-light-text dark:text-dark-text"
                :class="{
                  'outline-light-action-red dark:outline-dark-action-red outline outline-2':
                    !subjectValidated,
                  'outline-none focus:outline-none': subjectValidated,
                }"
                :placeholder="$t('pages.help.contact.subject-placeholder')"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label
                :class="{
                  'text-light-action-red dark:text-dark-action-red':
                    !messageValidated,
                  'text-light-text dark:text-dark-text': messageValidated,
                }"
                for="message"
                >{{ $t("pages.help.contact.message-label") }}
                <span v-if="!messageValidated">cannot be empty.</span></label
              >
              <textarea
                v-model="message"
                @blur="validateMessage"
                id="message"
                class="p-2 resize-none rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-layer-1 focus:dark:bg-dark-layer-1 text-light-text dark:text-dark-text"
                :class="{
                  'outline-light-action-red dark:outline-dark-action-red outline outline-2':
                    !messageValidated,
                  'outline-none focus:outline-none': messageValidated,
                }"
                rows="6"
                :placeholder="$t('pages.help.contact.message-placeholder')"
                autocomplete="off"
                spellcheck="false"
              ></textarea>
            </div>
            <div class="flex flex-col space-y-2">
              <FriendlyCaptcha />
            </div>
            <button
              class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit elem-shadow-sm text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10"
              :class="{
                'cursor-not-allowed': buttonDisabled,
                'hover:bg-light-cta-orange/80 active:bg-light-cta-orange dark:hover:bg-dark-cta-orange/25 dark:active:bg-dark-cta-orange/10':
                  !buttonDisabled,
              }"
              type="submit"
              :disabled="buttonDisabled"
              :aria-label="$t('pages.help.contact.send-form-aria-label')"
            >
              {{ $t("pages.help.contact.send") }}
            </button>
          </form>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center pb-8 text-center md:items-start md:text-start space-y-4 md:space-y-6"
      >
        <h1 class="pb-2 font-bold responsive-h1">
          {{ $t("pages.help.contact.thanks-1") }}
        </h1>
        <div class="flex flex-row py-2 text-start space-x-3">
          <Icon
            class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            name="bi:info-circle-fill"
            size="1.25em"
          />
          <p>
            {{ $t("pages.help.faq.subheader-1") }}
            <a
              class="items-center focus-brand link-text"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            !
          </p>
        </div>
        <p>
          {{ $t("pages.help.contact.thanks-2") }}
        </p>
        <BtnRouteInternal
          :cta="false"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </div>
    </PageDocs>
  </div>
</template>

<script setup lang="ts">
const name = ref("");
const email = ref("");
const message = ref("");
const subject = ref("");
const nameValidated = ref(true);
const emailValidated = ref(true);
const subjectValidated = ref(true);
const messageValidated = ref(true);
const buttonDisabled = ref(true);
const mail = useMail();
const emailSent = ref(false);

const validateEmail = () => {
  if (!email.value.match(/.*@\w+\.\w+/)) {
    emailValidated.value = false;
  }
};

const validateSubject = () => {
  if (subject.value.trim().length === 0) {
    subjectValidated.value = false;
  }
};

const validateMessage = () => {
  if (message.value.trim().length === 0) {
    messageValidated.value = false;
  }
};

const validateName = () => {
  if (name.value.trim().length === 0) {
    nameValidated.value = false;
  }
};
watch(name, () => {
  if (name.value.length > 0) {
    nameValidated.value = true;
  }
});

watch(email, () => {
  if (email.value.match(/.*@\w+\.\w+/)) {
    emailValidated.value = true;
  }
});

watch(subject, () => {
  if (subject.value.length > 0) {
    subjectValidated.value = true;
  }
});

watch(message, () => {
  if (message.value.length > 0) {
    messageValidated.value = true;
  }
});

watch([message, subject, email, name], () => {
  if (
    name.value.trim().length > 0 &&
    email.value.match(/.*@\w+\.\w+/) &&
    subject.value.trim().length > 0 &&
    message.value.trim().length > 0
  ) {
    buttonDisabled.value = false;
  } else {
    buttonDisabled.value = true;
  }
});

const sendEmail = async () => {
  if (
    name.value.trim().length > 0 &&
    email.value.match(/.*@\w+\.\w+/) &&
    subject.value.trim().length > 0 &&
    message.value.trim().length > 0
  ) {
    await mail.send({
      from: email.value,
      subject: `activist contact form: ${subject.value}`,
      text: message.value,
    });
    emailSent.value = true;
  }
};
</script>
