<template>
  <div class="text-primary-text w-full">
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
          {{ $t("pages._global.create.information") }}
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
              class="bg-layer-0 border-section-div mt-2 w-full rounded-md border px-4 py-2"
              type="text"
              name="name"
              :placeholder="
                $t('pages.resources.create.resource_name_placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="responsive-h3 block font-medium"
              >{{ $t("pages._global.create.link") }}*</label
            >
            <input
              v-model="formData.link"
              id="location"
              class="bg-layer-0 border-section-div mt-2 w-full rounded-md border px-4 py-2"
              type="text"
              name="location"
              :placeholder="$t('pages.resources.create.link_placeholder')"
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
            class="bg-layer-0 border-section-div mt-2 w-full rounded-md border px-4 py-2"
            name="description"
            :placeholder="$t('pages.resources.create.description_placeholder')"
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 flex w-full">
          <div class="flex-1 px-5 py-6">
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("pages._global.create.location") }}
            </label>
            <textarea
              v-model="formData.location"
              id="location"
              class="bg-layer-0 border-section-div mt-2 w-full rounded-md border px-4 py-2"
              name="location"
              :placeholder="$t('pages.resources.create.location_placeholder')"
            ></textarea>
          </div>
          <div class="flex-1 px-5 py-6">
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("_global.organization") }}*
            </label>
            <textarea
              v-model="formData.organization"
              id="organization"
              class="bg-layer-0 border-section-div mt-2 w-full rounded-md border px-4 py-2"
              name="organization"
              :placeholder="
                $t('pages.resources.create.organization_placeholder')
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
              label="pages.resources.create.create_resource"
              fontSize="lg"
              ariaLabel="pages.resources.create.complete_application_aria_label"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["user-only"],
});

const formData = ref({
  name: "",
  location: "",
  description: "",
  link: "",
  organization: "",
  topics: [""],
});

const submit = async () => {
  await useFetch("http://127.0.0.1:8000/v1/content/resources/", {
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
