<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.contact") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_ENVELOPE_URL"
      imgAltText="pages.help._global.contact-img-alt-text"
    >
      <div
        v-if="!emailSent"
        class="items-center space-y-4 text-left md:items-start"
      >
        <h1 class="responsive-h1 pb-2 font-bold">
          {{ $t("pages.help.contact.header") }}
        </h1>
        <div class="flex flex-row space-x-3 py-2">
          <Icon
            class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
            :name="IconMap.CIRCLE_INFO"
            size="1.25em"
          />
          <p>
            {{ $t("pages.help.faq.subheader-1") }}
            <a
              class="focus-brand link-text items-center"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
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
              class="focus-brand link-text items-center"
              href="https://matrix.to/#/#activist_community:matrix.org"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.contact.section-1-paragraph-1-3") }}
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist"
            >
              {{ $t("_global.on-github") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.contact.section-1-paragraph-1-5") }}
          </p>
          <p>
            {{ $t("pages.help.contact.section-1-paragraph-2-1") }}
            <a class="focus-brand link-text" href="mailto:team@activist.org">
              team@activist.org
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline" /></a
            >.
            {{ $t("pages.help.contact.section-1-paragraph-2-2") }}
            <a
              class="focus-brand link-text items-center"
              href="https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md"
              target="_blank"
            >
              {{ $t("pages.help.contact.section-1-paragraph-2-3") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline" /></a
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
                >{{ $t("pages.help.contact.name") }}
                <span v-if="!nameValidated">{{
                  $t("pages.help.contact.error-empty")
                }}</span></label
              >
              <input
                v-model="name"
                @blur="validateName"
                id="name"
                class="rounded-md bg-light-highlight p-2 text-light-text placeholder-light-distinct-text focus:bg-light-layer-1 dark:bg-dark-highlight dark:text-dark-text dark:placeholder-dark-distinct-text focus:dark:bg-dark-layer-1"
                :class="{
                  'outline outline-2 outline-light-action-red dark:outline-dark-action-red':
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
                class="rounded-md bg-light-highlight p-2 text-light-text placeholder-light-distinct-text focus:bg-light-layer-1 dark:bg-dark-highlight dark:text-dark-text dark:placeholder-dark-distinct-text focus:dark:bg-dark-layer-1"
                :class="{
                  'outline outline-2 outline-light-action-red dark:outline-dark-action-red':
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
                class="rounded-md bg-light-highlight p-2 text-light-text placeholder-light-distinct-text focus:bg-light-layer-1 dark:bg-dark-highlight dark:text-dark-text dark:placeholder-dark-distinct-text focus:dark:bg-dark-layer-1"
                :class="{
                  'outline outline-2 outline-light-action-red dark:outline-dark-action-red':
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
                class="resize-none rounded-md bg-light-highlight p-2 text-light-text placeholder-light-distinct-text focus:bg-light-layer-1 dark:bg-dark-highlight dark:text-dark-text dark:placeholder-dark-distinct-text focus:dark:bg-dark-layer-1"
                :class="{
                  'outline outline-2 outline-light-action-red dark:outline-dark-action-red':
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
              class="focus-brand elem-shadow-sm flex w-fit select-none items-center rounded-md border border-light-text bg-light-cta-orange fill-light-text px-4 py-2 text-center font-semibold text-light-text dark:border-dark-cta-orange dark:bg-dark-cta-orange/10 dark:fill-dark-cta-orange dark:text-dark-cta-orange xl:rounded-lg"
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
        class="flex flex-col items-center justify-center space-y-4 pb-8 text-center md:items-start md:space-y-6 md:text-start"
      >
        <h1 class="responsive-h1 pb-2 font-bold">
          {{ $t("pages.help.contact.thanks-1") }}
        </h1>
        <div class="flex flex-row space-x-3 py-2 text-start">
          <Icon
            class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
            :name="IconMap.CIRCLE_INFO"
            size="1.25em"
          />
          <p>
            {{ $t("pages.help.faq.subheader-1") }}
            <a
              class="focus-brand link-text items-center"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              {{ $t("_global.public-matrix-chat-rooms") }}
              <Icon
                :name="IconMap.EXTERNAL_LINK"
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
import { IconMap } from "~/types/icon-map";

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
      from: "contact@activist.org",
      subject: `activist contact form: ${subject.value}`,
      text: message.value,
    });
    emailSent.value = true;
  }
};
</script>
