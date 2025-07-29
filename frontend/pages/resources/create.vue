<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="w-full">
    <IndicatorProcessProgress
      type="default"
      :progress="1"
      :start="1"
      :end="1"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div class="mt-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages._global.create.information") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.resources.create.subtext") }}
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
            <h3 for="name" class="block font-medium">
              {{ $t("i18n.pages.resources.create.title") }}*
            </h3>
            <input
              v-model="formData.name"
              id="name"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="name"
              :placeholder="
                $t('i18n.pages.resources.create.resource_name_placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <h3 for="location" class="block font-medium">
              {{ $t("i18n.pages._global.create.link") }}*
            </h3>
            <input
              v-model="formData.link"
              id="location"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="location"
              :placeholder="$t('i18n.pages.resources.create.link_placeholder')"
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <h3 for="description" class="block font-medium">
            {{ $t("i18n.pages.resources.create.description") }}*
          </h3>
          <textarea
            v-model="formData.description"
            id="description"
            class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
            name="description"
            :placeholder="
              $t('i18n.pages.resources.create.description_placeholder')
            "
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 flex w-full">
          <div class="flex-1 px-5 py-6">
            <h3 for="location" class="block font-medium">
              {{ $t("i18n._global.location") }}
            </h3>
            <textarea
              v-model="formData.location"
              id="location"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="location"
              :placeholder="
                $t('i18n.pages.resources.create.location_placeholder')
              "
            ></textarea>
          </div>
          <div class="flex-1 px-5 py-6">
            <h3 for="location" class="block font-medium">
              {{ $t("i18n._global.organization") }}*
            </h3>
            <textarea
              v-model="formData.organization"
              id="organization"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              name="organization"
              :placeholder="
                $t('i18n.pages.resources.create.organization_placeholder')
              "
            ></textarea>
          </div>
        </div>
        <CardTopicSelection class="mt-5" pageType="resource" />
        <div class="mx-14 flex w-full flex-col">
          <div class="my-5">
            <BtnAction
              type="submit"
              :cta="true"
              class="flex"
              label="i18n._global.create_resource"
              fontSize="lg"
              ariaLabel="i18n.pages.resources.create.complete_application_aria_label"
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
  link: "",
  organization: "",
  topics: [""],
});

const submit = async () => {
  await useFetch(`${BASE_BACKEND_URL}/v1/content/resources`, {
    method: "POST",
    body: JSON.stringify({
      name: formData.value.name,
      location: formData.value.location,
      url: formData.value.link,
      description: formData.value.description,
      social_accounts: ["https://twitter.com/activist_hq"],
      created_by: "cdfecc96-2dd5-435b-baba-a7610afee70e",
      topics: formData.value.topics,
      high_risk: false,
      total_flags: 0,
    }),
  });

  //TODO: FEATURE - push notification with toast should be added here

  window.location.href = "/resources";
};
</script>
