<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <ProgressBar type="default" :progress="1" :start="1" :end="1" />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" :breadcrumbs="breadcrumbs" />
      <div class="mt-4">
        <h1 class="font-bold responsive-h2">
          {{ $t("pages.resources.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.resources.create.subtext") }}
        </p>
      </div>
      <form
        @submit.prevent="submit"
        class="pt-4 flex flex-col w-full justify-center items-center"
      >
        <div
          class="flex w-full justify-between mx-14 px-5 card-style gap-6 py-6"
        >
          <div class="w-1/2">
            <label for="name" class="block font-medium responsive-h3"
              >{{ $t("pages.resources.create.resource-name") }}*</label
            >
            <input
              v-model="formData.name"
              id="name"
              class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
              type="text"
              name="name"
              :placeholder="
                $t('pages.resources.create.resource-name-placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="block font-medium responsive-h3"
              >{{ $t("pages.resources.create.link") }}*</label
            >
            <input
              v-model="formData.link"
              id="location"
              class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
              type="text"
              name="location"
              :placeholder="$t('pages.resources.create.link-placeholder')"
            />
          </div>
        </div>
        <div class="mx-14 w-full card-style mt-5 px-5 py-6">
          <label for="description" class="block font-medium responsive-h3"
            >{{ $t("pages.resources.create.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
            name="description"
            :placeholder="$t('pages.resources.create.description-placeholder')"
          ></textarea>
        </div>
        <div class="mx-14 w-full flex card-style mt-5">
          <div class="flex-1 px-5 py-6">
            <label for="location" class="block font-medium responsive-h3">
              {{ $t("pages._global.location") }}*
            </label>
            <textarea
              v-model="formData.location"
              id="location"
              class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
              name="location"
              :placeholder="$t('pages.resources.create.location-placeholder')"
            ></textarea>
          </div>
          <div class="flex-1 px-5 py-6">
            <label for="location" class="block font-medium responsive-h3">
              {{ $t("pages.resources.create.organization") }}*
            </label>
            <textarea
              v-model="formData.organization"
              id="organization"
              class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
              name="organization"
              :placeholder="
                $t('pages.resources.create.organization-placeholder')
              "
            ></textarea>
          </div>
        </div>
        <CardTopicSelection v-model="formData.topics" class="mt-5" />
        <div class="mx-14 flex flex-col w-full mt-5">
          <div class="my-5">
            <BtnLabeled
              type="submit"
              :cta="true"
              class="flex"
              label="pages.resources.create.complete-application"
              fontSize="lg"
              ariaLabel="pages.resources.create.complete-application-aria-label"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "sidebar",
});

const formData = ref({
  name: "",
  location: "",
  description: "",
  link: "",
  organization: "",
  topics: ["justice", "activism"],
});

const submit = async () => {
  const { data: responseData } = await useFetch(
    "http://127.0.0.1:8000/v1/content/resources/",
    {
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
    }
  );

  //TODO: FEATURE - push notification with toast should be added here

  window.location.href = "/resources";
};
</script>
