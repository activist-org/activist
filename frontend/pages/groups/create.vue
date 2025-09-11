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
            <h3 for="name" class="block font-medium">
              {{ $t("i18n.pages.groups.create.group_name") }}*
            </h3>
            <input
              v-model="formData.name"
              id="name"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="name"
              :placeholder="
                $t('i18n.pages.groups.create.group_name_placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <h3 for="location" class="block font-medium">
              {{ $t("i18n._global.location") }}*
            </h3>
            <input
              v-model="formData.location"
              id="location"
              class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              name="location"
              :placeholder="$t('i18n.pages.groups.create.location_placeholder')"
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <h3 for="description" class="block font-medium">
            {{ $t("i18n._global.description") }}*
          </h3>
          <textarea
            v-model="formData.description"
            id="description"
            class="mt-2 w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
            name="description"
            :placeholder="
              $t('i18n.pages.groups.create.description_placeholder')
            "
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <h3 for="tagline" class="block font-medium">
            {{ $t("i18n.pages._global.create.tagline") }}
          </h3>
          <input
            v-model="formData.tagline"
            id="tagline"
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
            <label for="terms" class="flex font-medium">
              <p>{{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;</p>
              <a href="#" class="text-blue-500">{{
                $t("i18n.pages._global.terms_of_service_pt_2")
              }}</a>
              <p>.</p>
            </label>
          </div>
          <div class="my-5">
            <BtnAction
              type="submit"
              :cta="true"
              class="flex"
              label="i18n._global.create_group"
              fontSize="lg"
              ariaLabel="i18n.pages.groups.create.create_group_aria_label"
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
  let createdBy: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authState: any = useAuthState?.();
    createdBy = authState?.data?.value?.user?.id;
  } catch (e) {
    void e;
  }
  const payload: Record<string, unknown> = {
    name: formData.value.name,
    location: formData.value.location,
    tagline: formData.value.tagline,
    description: formData.value.description,
    social_accounts: ["https://twitter.com/activist_hq"],
    topics: formData.value.topics,
    high_risk: false,
    total_flags: 0,
  };
  if (createdBy) payload.created_by = createdBy;
  await useFetch(`${BASE_BACKEND_URL}/v1/communities/organizations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  //TODO: FEATURE - push notification with toast should be added here

  window.location.href = "/organizations";
};
</script>
