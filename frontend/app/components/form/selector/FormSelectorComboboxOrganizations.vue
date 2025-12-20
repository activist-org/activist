<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:filterValue="handleFilterValueUpdate"
    @update:selectedOptions="
      (val: unknown) => handleChange(val as Organization[])
    "
    :canFetchMore="true"
    :disabled="disabled"
    :fetchMore="getMore"
    :hasColOptions="hasColOptions"
    :infinite="true"
    :label="label"
    :options="options"
    :selectedOptions="selectedOrganizations || []"
    :showLoadingSlot="isFetching"
  />
</template>

<script setup lang="ts">
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
  linkedUserId?: string | number | null;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});
const filters = ref<{ name?: string }>({});
const handleFilterValueUpdate = (val: string) => {
  filters.value.name = val;
};
const linked_user_id = computed(() => String(props.linkedUserId) || "");

const {
  data: organizations,
  getMore,
  pending,
} = useGetOrganizationsByUser(linked_user_id.value, filters);
const isFetching = computed(() => pending.value);

const emit = defineEmits<{
  (e: "update:selectedOrganizations", value: Organization[]): void;
}>();
const handleChange = (newValue: Organization[]) => {
  emit("update:selectedOrganizations", newValue);
};
</script>
