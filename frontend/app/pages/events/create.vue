<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="w-full">
    <IndicatorProcessProgress
      :end="pageCount"
      :progress="page + 1"
      :start="0"
      type="default"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div v-if="page === 0" class="mt-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages._global.create.information") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.events.create.subtext_0") }}
        </p>
      </div>
      <div v-if="page === 1" class="mt-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages.events.create.header_1") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.events.create.subtext_1") }}
        </p>
      </div>
      <div v-if="page === 2" class="mt-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages.events.create.header_2") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.events.create.subtext_2") }}
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
              <h3 class="block font-medium" for="name">
                {{ $t("i18n.pages.events.create.events_name") }}*
              </h3>
              <input
                id="name"
                v-model="formData.name"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="name"
                :placeholder="
                  $t('i18n.pages.events.create.events_name_placeholder')
                "
                type="text"
              />
            </div>
            <div class="w-1/2">
              <h3 class="block font-medium" for="tagline">
                {{ $t("i18n.pages._global.create.tagline") }}
              </h3>
              <input
                id="tagline"
                v-model="formData.tagline"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="tagline"
                :placeholder="
                  $t('i18n.pages.events.create.tagline_placeholder')
                "
                type="text"
              />
            </div>
          </div>
          <div class="card-style mx-14 mt-5 w-full px-5 py-6">
            <h3 class="block font-medium" for="organizer">
              {{ $t("i18n.pages.events.create.organizer") }}*
            </h3>
            <span id="organizer-instructions" class="block font-medium">
              {{ $t("i18n.pages.events.create.organizer_instructions") }}
            </span>
            <input
              id="organizer"
              v-model="formData.organizer"
              aria-describedby="organizer-instructions"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="organizer"
              :placeholder="
                $t('i18n.pages.events.create.organizer_placeholder')
              "
              type="select"
            />
          </div>
          <div class="mx-14 mt-5 w-full">
            <CardConnectEvent />
          </div>
          <div class="card-style mx-14 mt-5 w-full px-5 py-6">
            <h3 class="block font-medium" for="description">
              {{ $t("i18n._global.description") }}*
            </h3>
            <textarea
              id="description"
              v-model="formData.description"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="description"
              :placeholder="
                $t('i18n.pages.events.create.description_placeholder')
              "
            ></textarea>
          </div>
        </div>
        <div v-if="page === 1" class="flex w-full flex-col items-center pt-4">
          <div
            class="card-style mx-14 flex w-full justify-start gap-6 px-5 py-6"
          >
            <div class="w-1/5">
              <h3 class="block font-medium" for="event-type">
                {{ $t("i18n.pages.events.create.event_type") }}*
              </h3>
              <FormRadioGroup
                id="event-type"
                @update:modelValue="updateEventType"
                class="mt-2.5"
                :modelValue="eventTypeValue"
                name="event-type"
                :options="eventTypeOptions"
              />
            </div>
            <div class="w-3/5">
              <h3 class="block font-medium" for="format">
                {{ $t("i18n.pages.events.create.format") }}
              </h3>
              <input
                id="format"
                v-model="formData.format"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="format"
                :placeholder="$t('i18n.pages.events.create.format_placeholder')"
                type="text"
              />
            </div>
          </div>
          <!-- TODO: Add events to CardTopicSelection. -->
          <CardTopicSelection
            v-model="formData.topics"
            class="mt-5"
            pageType="event"
          />
          <div class="py-3"></div>
          <div
            class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
          >
            <div class="w-full">
              <h3 class="block font-medium" for="roles">
                {{ $t("i18n.pages.events.create.roles") }}*
              </h3>
              <!-- TODO: replace this input with something that lets you make roles. -->
              <input
                id="roles"
                v-model="formData.roles"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="roles"
                placeholder="Event roles"
                type="text"
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
              <h3 class="block font-medium" for="setting">
                {{ $t("i18n.pages.events.create.setting") }}*
              </h3>
              <FormRadioGroup
                id="setting"
                @update:modelValue="updateSetting"
                class="mt-2"
                :modelValue="settingValue"
                name="setting"
                :options="settingOptions"
              />
            </div>
            <div class="w-2/5">
              <h3 class="block font-medium" for="location">
                {{ $t("i18n._global.location") }}*
              </h3>
              <input
                id="location"
                v-model="formData.location"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="location"
                :placeholder="
                  $t('i18n.pages.events.create.location_placeholder')
                "
                type="text"
              />
            </div>
            <div class="w-2/5">
              <h3 class="block font-medium" for="link">
                {{ $t("i18n.pages._global.create.link") }}*
              </h3>
              <input
                id="link"
                v-model="formData.link"
                class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
                name="link"
                :placeholder="$t('i18n.pages.events.create.link_placeholder')"
                type="url"
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
              <label class="flex font-medium" for="terms">
                <p>
                  {{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;
                </p>
                <NuxtLink
                  class="link-text"
                  target="_blank"
                  :to="localePath('/legal/privacy-policy')"
                >
                  {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
                </NuxtLink>
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
            ariaLabel="i18n.pages.events.create.go_to_previous_page"
            class="absolute left-0 mr-2"
            :class="{ 'placeholder-class': hasPreviousPage }"
            :cta="false"
            fontSize="lg"
            iconSize="1.25em"
            label="i18n.pages.events.create.button_left"
            leftIcon="←"
            type="button"
          />
          <BtnAction
            v-if="!hasNextPage"
            ariaLabel="i18n.pages.events.create.submit_aria_label"
            class="absolute right-0 ml-2 flex"
            :cta="true"
            fontSize="lg"
            label="i18n.pages.events.create.submit"
            type="submit"
          />
          <BtnAction
            v-if="hasNextPage"
            @click="nextPage"
            ariaLabel="i18n.pages.events.create.go_to_previous_page"
            class="absolute right-0 ml-2"
            :cta="false"
            fontSize="lg"
            iconSize="1.25em"
            label="i18n.pages.events.create.button_right"
            :rightIcon="IconMap.ARROW_RIGHT"
            type="button"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// TODO: Count the number of pages dynamically.
const pageCount = computed(() => 3);

const hasNextPage = computed(() => page.value < pageCount.value - 1);
const hasPreviousPage = computed(() => page.value > 0);

function nextPage() {
  // TODO: check validation before moving.
  if (hasNextPage.value) {
    page.value++;
  }
}

function previousPage() {
  // TODO: Check validation before moving.
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
  const { data: _responseData } = await useFetch(
    BASE_BACKEND_URL + "/communities/events",
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
};
</script>
