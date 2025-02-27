<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Toaster :theme="$colorMode.value === 'dark' ? 'dark' : 'light'" />
  <div class="w-full text-primary-text">
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
          {{ $t("i18n.pages.organizations.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.organizations.create.subtext") }}
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
              >{{ $t("i18n._global.organization_name") }}*</label
            >
            <input
              v-model="formData.name"
              id="name"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="name"
              :placeholder="
                $t(
                  'i18n.pages.organizations.create.organization_name_placeholder'
                )
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="responsive-h3 block font-medium"
              >{{ $t("i18n.pages._global.create.location") }}*</label
            >
            <input
              v-model="formData.location"
              id="location"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="location"
              :placeholder="
                $t('i18n.pages.organizations.create.location_placeholder')
              "
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="description" class="responsive-h3 block font-medium"
            >{{ $t("i18n.pages._global.create.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
            name="description"
            :placeholder="
              $t('i18n.pages.organizations.create.description_placeholder')
            "
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="tagline" class="responsive-h3 block font-medium">{{
            $t("i18n.pages._global.create.tagline")
          }}</label>
          <input
            v-model="formData.tagline"
            id="tagline"
            class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
            name="tagline"
            :placeholder="
              $t('i18n.pages.organizations.create.tagline_placeholder')
            "
          />
        </div>
        <CardTopicSelection
          v-model="formData.topics"
          class="mt-5"
          pageType="organization"
        />
        <div class="mx-14 mt-5 w-full">
          <CardConnect pageType="other" />
        </div>
        <div class="mx-14 mt-5 flex w-full flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label for="terms" class="flex font-medium">
              <p>{{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;</p>
              <NuxtLink
                :to="localePath('/legal/privacy-policy')"
                target="_blank"
                class="link-text"
                >{{ $t("i18n.pages._global.terms_of_service_pt_2") }}</NuxtLink
              >

              <p>.</p>
            </label>
          </div>
          <div class="my-5">
            <BtnAction
              type="submit"
              :cta="true"
              class="flex"
              label="i18n.pages.organizations.create.complete_application"
              fontSize="lg"
              ariaLabel="i18n.pages.organizations.create.complete_application_aria_label"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toaster, toast } from "vue-sonner";
import type { OrganizationCreateFormData } from "~/types/communities/organization";

const formData = ref<OrganizationCreateFormData>({
  name: "",
  tagline: "",
  location: "",
  description: "",
  social_accounts: [],
  topics: [],
});

const localePath = useLocalePath();
const organizationStore = useOrganizationStore();

const submit = async () => {
  const responseId = await organizationStore.create(formData.value);

  if (responseId) {
    navigateTo(localePath(`/organizations/${responseId}`));
  } else {
    toast.error("Something went wrong. Please try again later.");
  }
};
</script>
