<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:filterValue="handleFilterValueUpdate"
    @update:selectedOptions="
      (val: unknown) => handleChange(val as Organization[])
    "
    :canFetchMore="true"
    :fetchMore="getMore"
    :hasColOptions="hasColOptions"
    :infinite="true"
    :label="label"
    :options="options"
    :selectedOptions="selectedOrganizations || []"
  />
</template>

<script setup lang="ts">
const filters = ref<OrganizationFilters>({});
// Destructure getMore and isLastPage from the composable
const { data: organizations, getMore } = useGetOrganizations(filters);

// Changed to computed so options update automatically when new data is fetched
const options = computed(() =>
  (organizations.value || []).map((organization: Organization) => ({
    label: organization.name,
    id: organization.id,
    value: organization.id,
  }))
);

interface Props {
  id: string;
  selectedOrganizations: Organization[];
  label: string;
  hasColOptions?: boolean;
}
const handleFilterValueUpdate = (val: string) => {
  filters.value.name = val;
};
withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});

const emit = defineEmits<{
  (e: "update:selectedOrganizations", value: Organization[]): void;
}>();
const handleChange = (newValue: Organization[]) => {
  emit("update:selectedOrganizations", newValue);
};
</script>
