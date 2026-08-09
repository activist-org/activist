<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization?.name }}
        {{ $t("i18n.pages.organizations._global.events_lower") }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization?.name +
        ' ' +
        $t('i18n.pages.organizations._global.events_lower')
      "
      :tagline="$t('i18n.pages.organizations._global.events_tagline')"
    >
      <div
        class="flex w-[75%] items-center space-x-2 lg:flex-row lg:items-center lg:justify-around lg:space-y-0"
      >
        <div class="flex w-full items-end justify-around lg:space-x-3">
          <FormTextInputSearch
            id="organization-events-search"
            v-model="name"
            :ariaLabel="
              $t('i18n.pages.organizations.events.search_events_aria_label')
            "
            :label="$t('i18n._global.search')"
            size="lg"
          />
          <div class="flex flex-col justify-end space-x-1">
            <FormLabel
              id="filter-date-label"
              class="hidden lg:block"
              for="filter-date-range"
              :label="$t('i18n.pages.organizations.events.filter_by_date')"
            />
            <FormDateTimeInput
              id="filter-date-range"
              v-model="dateRange"
              aria-labelledby="filter-date-label"
              class="flex items-center"
              :label="$t('i18n.pages.organizations.events.filter_by_date')"
            />
          </div>
        </div>
        <div class="flex w-fit justify-end space-x-2 lg:space-x-3">
          <BtnAction
            @click="openModal()"
            @keydown.enter="openModal()"
            ariaLabel="i18n.pages.organizations.events.new_org_event_aria_label"
            class="w-max"
            :cta="true"
            fontSize="sm"
            iconSize="1.35em"
            label="i18n._global.new_event"
            :leftIcon="IconMap.PLUS"
          />
          <BtnAction
            @click="downloadCalendarEntries"
            @keydown.enter="downloadCalendarEntries"
            ariaLabel="i18n.pages.organizations._global.subscribe_to_events_aria_label"
            class="w-max"
            :cta="true"
            fontSize="sm"
            iconSize="1.25em"
            label="i18n.pages.organizations._global.subscribe_to_events"
            :leftIcon="IconMap.DATE"
          />
        </div>
      </div>
    </HeaderAppPageOrganization>
    <Loading v-if="pending" :loading="pending" />
    <div
      v-if="events && (events ?? []).length > 0"
      class="space-y-3 py-4"
      data-testid="organization-events-list"
    >
      <CardSearchResultEntityEvent
        v-for="(e, i) in events"
        :key="i"
        :event="e"
        :isReduced="true"
      />
    </div>
    <EmptyState v-else class="py-4" pageType="events" :permission="false" />
  </div>
</template>

<script setup lang="ts">
const organizationId = useRoute().params.orgId as string;

const name = ref<string>("");
const dateRange = ref<{ start?: Date; end?: Date }>({});

// format to YYYY-MM-DD for backend __date filter
const toDateParam = (d?: Date) =>
  d ? d.toISOString().slice(0, 10) : undefined;

const filters = computed(() => ({
  name: name.value || undefined,
  startDate: toDateParam(dateRange.value.start),
  endDate: toDateParam(dateRange.value.end),
}));

const { data: organization } = useGetOrganization(organizationId);
const { data: events, pending } = useGetOrganizationEvents(
  organizationId,
  filters
);

const { openModal } = useModalHandlers("ModalCreateEvent");
const downloadCalendarEntries = () => {};
</script>
