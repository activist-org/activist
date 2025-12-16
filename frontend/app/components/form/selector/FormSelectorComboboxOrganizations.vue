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
  linkedUserId?: string;
}
const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});
const linked_user_id = computed(() => props.linkedUserId || '');
// Destructure getMore and isLastPage from the composable
const { data: organizations, getMore } = useGetOrganizationsByUser(linked_user_id.value);
const emit = defineEmits<{
  (e: "update:selectedOrganizations", value: Organization[]): void;
}>();
const handleChange = (newValue: Organization[]) => {
  emit("update:selectedOrganizations", newValue);
};
</script>
