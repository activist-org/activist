<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="w-full">
    <IndicatorProcessProgress
      :end="1"
      :progress="1"
      :start="1"
      type="default"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div class="mt-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages.groups.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.groups.create.subtext") }}
        </p>
      </div>
      <form
        @submit.prevent="submit"
        class="flex w-full flex-col items-center justify-center pt-4"
      >
        <div
          class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
        >
          <div class="w-1/2">
            <h3 class="block font-medium" for="name">
              {{ $t("i18n.pages.groups.create.group_name") }}*
            </h3>
            <input
              id="name"
              v-model="formData.name"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="name"
              :placeholder="
                $t('i18n.pages.groups.create.group_name_placeholder')
              "
              type="text"
            />
          </div>
          <div class="w-1/2">
            <h3 class="block font-medium" for="location">
              {{ $t("i18n._global.location") }}*
            </h3>
            <input
              id="location"
              v-model="formData.location"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="location"
              :placeholder="$t('i18n.pages.groups.create.location_placeholder')"
              type="text"
            />
          </div>
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
              $t('i18n.pages.groups.create.description_placeholder')
            "
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <h3 class="block font-medium" for="tagline">
            {{ $t("i18n.pages._global.create.tagline") }}
          </h3>
          <input
            id="tagline"
            v-model="formData.tagline"
            class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
            name="tagline"
            :placeholder="$t('i18n.pages.groups.create.tagline_placeholder')"
          />
        </div>
        <CardTopicSelection
          v-model="formData.topics"
          class="mt-5"
          pageType="group"
        />
        <div class="mx-14 mt-5 w-full">
          <CardConnectGroup />
        </div>
        <div class="mx-14 mt-5 flex w-full flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label class="flex font-medium" for="terms">
              <p>{{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;</p>
              <a class="text-blue-500" href="#">
                {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
              </a>
              <p>.</p>
            </label>
          </div>
          <div class="my-5">
            <BtnAction
              ariaLabel="i18n.pages.groups.create.create_group_aria_label"
              class="flex"
              :cta="true"
              fontSize="lg"
              label="i18n._global.create_group"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const formData = ref({
  name: "",
  location: "",
  description: "",
  tagline: "",
  social_accounts: [],
  topics: [],
});

const submit = async () => {
  // Note: created_by not included as the backend infers the user from the token.
  const payload: Record<string, unknown> = {
    name: formData.value.name,
    location: formData.value.location,
    tagline: formData.value.tagline,
    description: formData.value.description,
    social_accounts: [],
    topics: formData.value.topics,
    high_risk: false,
    total_flags: 0,
  };
  await useFetch(`${BASE_BACKEND_URL}/v1/communities/organizations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // TODO: Push notification with toast should be added here.

  window.location.href = "/organizations";
};
</script>
