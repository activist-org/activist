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
      <div class="mt-4 pb-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("i18n.pages.organizations.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.organizations.create.subtext") }}
        </p>
      </div>

      <Form
        @submit="submit"
        id="organization-create-form"
        :schema="schema"
        class="flex w-full flex-col items-center justify-center pt-4"
        class-button="mb-4"
        submit-label="i18n.pages.organizations.create.complete_application"
      >
        <!-- First card: Name and Location -->
        <div class="card-style flex justify-between gap-6 px-5 py-6">
          <div class="w-1/2">
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage }"
              :label="$t('i18n._global.organization_name')"
              name="name"
              :required="true"
            >
              <FormTextInput
                @input="handleChange"
                @blur="handleBlur"
                :id="id"
                :hasError="!!errorMessage.value"
                :label="
                  $t(
                    'i18n.pages.organizations.create.organization_name_placeholder'
                  )
                "
              />
            </FormItem>
          </div>

          <div class="w-1/2">
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage }"
              :label="$t('i18n.pages._global.create.location')"
              name="location"
              :required="true"
            >
              <FormTextInput
                @input="handleChange"
                @blur="handleBlur"
                :id="id"
                :hasError="!!errorMessage.value"
                :label="
                  $t('i18n.pages.organizations.create.location_placeholder')
                "
              />
            </FormItem>
          </div>
        </div>

        <!-- Description card -->
        <div class="card-style mt-5 px-5 py-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage }"
            :label="$t('i18n.pages._global.create.description')"
            name="description"
            :required="true"
          >
            <FormTextArea
              @input="handleChange"
              @blur="handleBlur"
              :id="id"
              :hasError="!!errorMessage.value"
              :placeholder="
                $t('i18n.pages.organizations.create.description_placeholder')
              "
            />
          </FormItem>
        </div>

        <!-- Tagline card -->
        <div class="card-style mt-5 px-5 py-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage }"
            :label="$t('i18n.pages._global.create.tagline')"
            name="tagline"
          >
            <FormTextInput
              @input="handleChange"
              @blur="handleBlur"
              :id="id"
              :hasError="!!errorMessage.value"
              :label="$t('i18n.pages.organizations.create.tagline_placeholder')"
            />
          </FormItem>
        </div>

        <!-- Topics -->
        <div class="card-style mt-5 px-5 pb-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, value }"
            name="topics"
          >
            <CardTopicSelection
              v-model="value.value as Topic[]"
              @input="handleChange"
              @blur="handleBlur"
              :id="id"
              class="mt-5"
              pageType="organization"
            />
          </FormItem>
        </div>

        <!-- Connect organization -->
        <div class="mt-5">
          <CardConnectOrganization />
        </div>

        <!-- Terms checkbox -->
        <div class="mt-5 flex flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label for="terms" class="flex font-medium">
              <p>{{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;</p>
              <NuxtLink
                :to="localePath('/legal/privacy-policy')"
                target="_blank"
                class="link-text"
              >
                {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
              </NuxtLink>
              <p>.</p>
            </label>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toaster, toast } from "vue-sonner";
import { z } from "zod";

import type { OrganizationCreateFormData } from "~/types/communities/organization";
import type { Topic } from "~/types/topics";

const schema = z.object({
  name: z.string().min(1, "Organization name is required"),
  tagline: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  topics: z.array(z.string()).optional(),
});

const localePath = useLocalePath();
const organizationStore = useOrganizationStore();

const submit = async (values: unknown) => {
  const responseId = await organizationStore.create(
    values as OrganizationCreateFormData
  );

  if (responseId) {
    navigateTo(localePath(`/organizations/${responseId}`));
  } else {
    toast.error("Something went wrong. Please try again later.");
  }
};
</script>
