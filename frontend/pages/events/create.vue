<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <IndicatorProcessProgress
      type="default"
      :progress="page + 1"
      :start="0"
      :end="pageCount"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div v-if="page === 0" class="mt-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("pages._global.information") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.events.create.subtext-0") }}
        </p>
      </div>
      <div v-if="page === 1" class="mt-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("pages.events.create.header-1") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.events.create.subtext-1") }}
        </p>
      </div>
      <div v-if="page === 2" class="mt-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("pages.events.create.header-2") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.events.create.subtext-2") }}
        </p>
      </div>
      <form
        @submit.prevent="submit"
        class="flex w-full flex-col items-center justify-center pt-4"
      >
        <div
          v-if="page === 0"
          class="flex w-full flex-col items-center justify-center pt-4"
        >
          <div
            class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
          >
            <div class="w-1/2">
              <label for="name" class="responsive-h3 block font-medium"
                >{{ $t("_global.events-name") }}*</label
              >
              <input
                v-model="formData.name"
                id="name"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="text"
                name="name"
                :placeholder="$t('pages.events.create.events-name-placeholder')"
              />
            </div>
            <div class="w-1/2">
              <label for="tagline" class="responsive-h3 block font-medium">{{
                $t("pages._global.create.tagline")
              }}</label>
              <input
                v-model="formData.tagline"
                id="tagline"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="text"
                name="tagline"
                :placeholder="$t('pages.events.create.tagline-placeholder')"
              />
            </div>
          </div>
          <div class="card-style mx-14 mt-5 w-full px-5 py-6">
            <label for="organizer" class="responsive-h3 block font-medium"
              >{{ $t("pages.events.create.organizer") }}*</label
            >
            <span id="organizer-instructions" class="block font-medium">{{
              $t("pages.events.create.organizer-instructions")
            }}</span>
            <input
              v-model="formData.organizer"
              id="organizer"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="select"
              name="organizer"
              :placeholder="$t('pages.events.create.organizer-placeholder')"
              aria-describedby="organizer-instructions"
            />
          </div>
          <div class="mx-14 mt-5 w-full">
            <CardConnect pageType="event" />
          </div>
          <div class="card-style mx-14 mt-5 w-full px-5 py-6">
            <label for="description" class="responsive-h3 block font-medium"
              >{{ $t("pages._global.description") }}*</label
            >
            <textarea
              v-model="formData.description"
              id="description"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              name="description"
              :placeholder="$t('pages.events.create.description-placeholder')"
            ></textarea>
          </div>
        </div>
        <div v-if="page === 1" class="flex w-full flex-col items-center pt-4">
          <div
            class="card-style mx-14 flex w-full justify-start gap-6 px-5 py-6"
          >
            <div class="w-1/5">
              <label for="event-type" class="responsive-h3 block font-medium">
                {{ $t("pages.events.create.event-type") }}*
              </label>
              <FormRadioGroup
                @update:modelValue="updateEventType"
                id="event-type"
                class="mt-2.5"
                name="event-type"
                :modelValue="eventTypeValue"
                :options="eventTypeOptions"
              />
            </div>
            <div class="w-3/5">
              <label for="format" class="responsive-h3 block font-medium">{{
                $t("pages.events.create.format")
              }}</label>
              <input
                v-model="formData.format"
                id="format"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="text"
                name="format"
                :placeholder="$t('pages.events.create.format-placeholder')"
              />
            </div>
          </div>
          <!-- TOOD: add events to CardTopicSelection -->
          <CardTopicSelection
            v-model="formData.topics"
            class="mt-5"
            pageType="event"
          />
          <div class="py-3"></div>
          <!-- for spacing -->
          <div
            class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
          >
            <div class="w-full">
              <label for="roles" class="responsive-h3 block font-medium"
                >{{ $t("pages.events.create.roles") }}*</label
              >
              <!-- TODO: replace this input with something that lets you make
                roles and such -->
              <input
                v-model="formData.roles"
                id="roles"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="text"
                name="roles"
                placeholder="Event roles"
              />
            </div>
          </div>
        </div>
        <div
          v-if="page === 2"
          class="flex w-full flex-col items-center justify-center pt-4"
        >
          <div
            class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
          >
            <div class="w-1/5">
              <label for="setting" class="responsive-h3 block font-medium">
                {{ $t("pages.events.create.setting") }}*
              </label>
              <FormRadioGroup
                @update:modelValue="updateSetting"
                id="setting"
                class="mt-2"
                name="setting"
                :modelValue="settingValue"
                :options="settingOptions"
              />
            </div>
            <div class="w-2/5">
              <label for="location" class="responsive-h3 block font-medium"
                >{{ $t("pages._global.location") }}*</label
              >
              <input
                v-model="formData.location"
                id="location"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="text"
                name="location"
                :placeholder="$t('pages.events.create.location-placeholder')"
              />
            </div>
            <div class="w-2/5">
              <label for="link" class="responsive-h3 block font-medium"
                >{{ $t("pages._global.link") }}*</label
              >
              <input
                v-model="formData.link"
                id="link"
                class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
                type="url"
                name="link"
                :placeholder="$t('pages.events.create.link-placeholder')"
              />
            </div>
          </div>
          <div class="card-style mx-14 mt-5 w-full px-5 py-6">
            <div class="w-1/2 space-y-6 pb-6 pt-3 md:pt-4">
              <CardDatePicker />
            </div>
          </div>
          <div class="mx-14 mt-5 flex w-full flex-col">
            <div class="flex space-x-2">
              <FormCheckbox id="terms" />
              <label for="terms" class="flex font-medium">
                <p>{{ $t("pages._global.terms-of-service-pt-1") }}&nbsp;</p>
                <NuxtLink
                  :to="localePath('/legal/privacy-policy')"
                  target="_blank"
                  class="link-text"
                  >{{ $t("pages._global.terms-of-service-pt-2") }}</NuxtLink
                >
                <p>.</p>
              </label>
            </div>
          </div>
        </div>
        <!-- The following is probably unnecessary due to the progress bar.
          Unless this use of the progress bar is wrong. -->
        <!--
        <div class="text-center mt-10">
          <span
            class="h-4 w-4 mx-0.5 my-0 bg-slate-300 border-none
              rounded-full inline-block"
            :class="{
              '[&]:bg-slate-400': (page === 0),
              '[&]:bg-green-400': (page > 0),
            }"
          ></span>
          <span
            class="h-4 w-4 mx-0.5 my-0 bg-slate-300 border-none
              rounded-full inline-block"
            :class="{
              '[&]:bg-slate-400': (page === 1),
              '[&]:bg-green-400': (page > 1),
            }"
          ></span>
          <span
            class="h-4 w-4 mx-0.5 my-0 bg-slate-300 border-none
              rounded-full inline-block"
            :class="{
              '[&]:bg-slate-400': (page === 2),
              '[&]:bg-green-400': (page > 3),
            }"
          ></span>
        </div>
        -->
        <div class="relative my-8 h-10 w-full">
          <BtnAction
            v-if="hasPreviousPage"
            @click="previousPage"
            type="button"
            class="absolute left-0 mr-2"
            :class="{ 'placeholder-class': hasPreviousPage }"
            :cta="false"
            label="pages.events.create.button-left"
            leftIcon="←"
            fontSize="lg"
            iconSize="1.25em"
            ariaLabel="pages.events.create.go-to-previous-page"
          />
          <BtnAction
            v-if="!hasNextPage"
            type="submit"
            :cta="true"
            class="absolute right-0 ml-2 flex"
            label="pages.events.create.submit"
            fontSize="lg"
            ariaLabel="pages.events.create.submit-aria-label"
          />
          <BtnAction
            v-if="hasNextPage"
            @click="nextPage"
            type="button"
            class="absolute right-0 ml-2"
            :cta="false"
            label="pages.events.create.button-right"
            rightIcon="→"
            fontSize="lg"
            iconSize="1.25em"
            ariaLabel="pages.events.create.go-to-previous-page"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["user-only"],
});

const localePath = useLocalePath();

const settingValue = ref("");
function updateSetting(event: string) {
  formData.value.setting = event;
  settingValue.value = event;
}
const settingOptions = [
  {
    label: "In-person",
    value: "In-person",
  },
  {
    label: "Online",
    value: "Online",
  },
];

const eventTypeValue = ref("");
function updateEventType(event: string) {
  formData.value.eventType = event;
  eventTypeValue.value = event;
}
const eventTypeOptions = [
  {
    label: "Learn",
    value: "Learn",
  },
  {
    label: "Action",
    value: "Action",
  },
];

const page = ref(0);

// TODO: count the number of pages dynamically
// or at least correct the hard coded value when needed
const pageCount = computed(() => 3);

const hasNextPage = computed(() => page.value < pageCount.value - 1);
const hasPreviousPage = computed(() => page.value > 0);

function nextPage() {
  // TODO: check validation before moving
  if (hasNextPage.value) {
    page.value++;
  }
}

function previousPage() {
  // TODO: check validation before moving
  // may not be necessary for previous page move though
  if (hasPreviousPage.value) {
    page.value--;
  }
}

const formData = ref({
  name: "",
  tagline: "",
  organizer: "",
  social_accounts: [],
  description: "",

  eventType: "",
  format: "",
  topics: [],
  roles: [],

  setting: "",
  location: "",
  link: "",
  date: "",
});

const submit = async () => {
  const { data: responseData } = await useFetch(
    BASE_BACKEND_URL + "/entities/events",
    {
      method: "POST",
      body: JSON.stringify({
        name: formData.value.name,
        location: formData.value.location,
        tagline: formData.value.tagline,
        description: formData.value.description,
        social_accounts: formData.value.social_accounts,
        topics: formData.value.topics,
      }),
    }
  );

  console.log(responseData);

  // window.location.href = "/events";
};
</script>
