<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <IndicatorProcessProgress
      type="default"
      :progress="1"
      :start="1"
      :end="1"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div class="mt-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("pages._global.information") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.resources.create.subtext") }}
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
            <label for="name" class="responsive-h3 block font-medium"
              >{{ $t("pages.resources.create.title") }}*</label
            >
            <input
              v-model="formData.name"
              id="name"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text"
              name="name"
              :placeholder="
                $t('pages.resources.create.resource-name-placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="responsive-h3 block font-medium"
              >{{ $t("pages.resources.create.link") }}*</label
            >
            <input
              v-model="formData.link"
              id="location"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text"
              name="location"
              :placeholder="$t('pages.resources.create.link-placeholder')"
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="description" class="responsive-h3 block font-medium"
            >{{ $t("pages.resources.create.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
            name="description"
            :placeholder="$t('pages.resources.create.description-placeholder')"
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 flex w-full">
          <div class="flex-1 px-5 py-6">
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("pages._global.location") }}
            </label>
            <textarea
              v-model="formData.location"
              id="location"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              name="location"
              :placeholder="$t('pages.resources.create.location-placeholder')"
            ></textarea>
          </div>
          <div class="flex-1 px-5 py-6">
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("_global.organization") }}*
            </label>
            <textarea
              v-model="formData.organization"
              id="organization"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              name="organization"
              :placeholder="
                $t('pages.resources.create.organization-placeholder')
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
              label="_global.create-resource"
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
import useRouteToName from "~/composables/useRouteToName";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const formData = ref({
  name: "",
  location: "",
  description: "",
  link: "",
  organization: "",
  topics: [""],
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
