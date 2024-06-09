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
      <FormKit
        @submit="submit"
        type="form"
        :actions="false"
        :classes="{
          form: 'flex w-full flex-col items-center justify-center pt-4',
        }"
        :config="{ validationVisibility: 'submit' }"
      >
        <div
          class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
        >
          <div class="w-1/2">
            <!-- name -->
            <label for="name" class="responsive-h3 block font-medium">
              {{ $t("pages.resources.create.title") }}*
            </label>
            <FormKit
              v-model="formData.name"
              id="name"
              type="text"
              name="name"
              :placeholder="
                $t('pages.resources.create.resource-name-placeholder')
              "
              :classes="{
                input:
                  'bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0',
              }"
              validation="required"
            />
          </div>
          <div class="w-1/2">
            <!-- location -->
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("pages.resources.create.link") }}*
            </label>
            <FormKit
              v-model="formData.link"
              id="location"
              type="text"
              name="location"
              :placeholder="$t('pages.resources.create.link-placeholder')"
              :classes="{
                input:
                  'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0',
              }"
              validation="required"
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <!-- description -->
          <label for="description" class="responsive-h3 block font-medium">
            {{ $t("pages.resources.create.description") }}*
          </label>
          <FormKit
            v-model="formData.description"
            id="description"
            type="textarea"
            name="description"
            :placeholder="$t('pages.resources.create.description-placeholder')"
            :classes="{
              input:
                'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0',
            }"
            validation="required"
          />
        </div>
        <div class="card-style mx-14 mt-5 flex w-full">
          <div class="flex-1 px-5 py-6">
            <!-- location -->
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("pages._global.location") }}
            </label>
            <FormKit
              v-model="formData.location"
              id="location"
              type="textarea"
              name="location"
              :placeholder="$t('pages.resources.create.location-placeholder')"
              :classes="{
                input:
                  'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0',
              }"
            />
          </div>
          <div class="flex-1 px-5 py-6">
            <!-- organization -->
            <label for="organization" class="responsive-h3 block font-medium">
              {{ $t("_global.organization") }}*
            </label>
            <FormKit
              v-model="formData.organization"
              id="organization"
              type="textarea"
              name="organization"
              :placeholder="$t('pages.resources.create.organization-placeholder')"
              :classes="{
                input: 'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0'
              }"
              validation="required"
            />
          </div>
        </div>
        <CardTopicSelection
          class="mt-5"
          pageType="resource"
        />
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
      </FormKit>
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
