<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.help.contact.title") }}</Title>
    </Head>
    <div
      class="container w-10/12 mx-auto md:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    >
      <div
        v-if="!emailSent"
        class="container flex justify-center py-4 mx-auto max-md:flex-col md:py-8"
      >
        <div class="flex flex-col p-4 space-y-4 md:w-1/2 lg:space-y-6">
          <h1 class="text-center md:text-left responsive-h2">
            {{ $t("pages.help.contact.header") }}
          </h1>
          <p>
            {{ $t("pages.help.contact.section-1-paragraph-1-1") }}
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="items-center focus-brand link-text"
            >
              {{ $t("pages.help.contact.section-1-paragraph-1-2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.contact.section-1-paragraph-1-3") }}
            <a
              href="https://github.com/activist-org/activist"
              class="items-center focus-brand link-text"
            >
              {{ $t("pages.help.contact.section-1-paragraph-1-4") }}
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
              href="https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md"
              class="items-center focus-brand link-text"
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

        <div class="md:ml-auto md:w-[500px]">
          <form @submit.prevent="sendEmail" class="flex flex-col m-5 space-y-2">
            <label
              :class="{
                'text-red-500': !nameValidated,
                'text-light-text dark:text-dark-text': nameValidated,
              }"
              for="name"
              >{{ $t("pages.help.contact.label-name") }}
              <span v-if="!nameValidated">{{
                $t("pages.help.contact.error-empty")
              }}</span></label
            >

            <input
              @blur="validateName"
              v-model="name"
              class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              :class="{
                'outline-red-500 outline outline-2': !nameValidated.valueOf,
                'outline-none focus:outline-none': nameValidated,
              }"
              :placeholder="$t('pages.help.contact.placeholder-name')"
              autocomplete="off"
              spellcheck="false"
              id="name"
            />

            <label
              :class="{
                'text-red-500': !emailValidated,
                'text-light-text dark:text-dark-text': emailValidated,
              }"
              for="email"
              >{{ $t("pages.help.contact.label-email") }}
              <span v-if="!emailValidated"
                >{{ $t("pages.help.contact.valid") }} (example@mail.com).</span
              ></label
            >

            <input
              @blur="validateEmail"
              v-model="email"
              class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              :class="{
                'outline-red-500 outline outline-2': !emailValidated,
                'outline-none focus:outline-none': emailValidated,
              }"
              placeholder="example@mail.com"
              autocomplete="off"
              spellcheck="false"
              id="email"
            />

            <label
              :class="{
                'text-red-500': !messageValidated,
                'text-light-text dark:text-dark-text': messageValidated,
              }"
              for="message"
              >{{ $t("pages.help.contact.label-message") }}
              <span v-if="!messageValidated">cannot be empty.</span></label
            >

            <textarea
              @blur="validateMessage"
              v-model="message"
              :class="{
                'outline-red-500 outline outline-2': !messageValidated,
                'outline-none focus:outline-none': messageValidated,
              }"
              rows="6"
              :placeholder="$t('pages.help.contact.placeholder-message')"
              class="p-2 resize-none rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              autocomplete="off"
              spellcheck="false"
              id="message"
            ></textarea>

            <button
              type="submit"
              class="px-4 py-2 mr-auto font-medium text-center border select-none rounded-md xl:rounded-lg focus-brand bg-light-cta-orange dark:bg-dark-cta-orange text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
              :class="{
                'cursor-not-allowed': buttonDisabled,
                'hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
                  !buttonDisabled,
              }"
              :disabled="buttonDisabled"
              :aria-label="$t('pages.contact.send-form-aria-label')"
            >
              {{ $t("pages.help.contact.send") }}
            </button>
          </form>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center w-10/12 py-8 mx-auto text-center space-y-6 sm:max-w-sm lg:max-w-md xl:max-w-xl md:py-16 md:space-y-12"
      >
        <h1 class="text-2xl font-semibold md:text-3xl lg:text-4xl">
          {{ $t("pages.help.contact.thanks-1") }}
        </h1>
        <p>
          {{ $t("pages.help.contact.thanks-2") }}
        </p>
        <BtnLabeled
          :cta="false"
          :label="$t('components.btn-labeled.return-home')"
          linkTo="/"
          fontSize="lg"
          :alternateText="$t('components.btn-labeled.return-home-aria-label')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const name = ref("");
const email = ref("");
const message = ref("");
const nameValidated = ref(true);
const emailValidated = ref(true);
const messageValidated = ref(true);
const buttonDisabled = ref(true);
const mail = useMail();
const emailSent = ref(false);

const validateEmail = () => {
  if (!email.value.match(/.*@\w+\.\w+/)) {
    emailValidated.value = false;
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

watch(message, () => {
  if (message.value.length > 0) {
    messageValidated.value = true;
  }
});

watch([message, email, name], () => {
  if (
    name.value.trim().length > 0 &&
    email.value.match(/.*@\w+\.\w+/) &&
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
    message.value.trim().length > 0
  ) {
    await mail.send({
      from: email.value,
      subject: `activist contact form from ${name.value}`,
      text: message.value,
    });
    emailSent.value = true;
  }
};
</script>
