<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:filterValue="handleFilterValueUpdate"
    @update:selectedOptions="(val: unknown) => handleChange(val as string[])"
    :canFetchMore="true"
    :disabled="disabled"
    :fetchMore="getMore"
    :hasColOptions="hasColOptions"
    :infinite="true"
    :label="label"
    :options="options"
    :selectedOptions="selectedOrgIds"
    :showLoadingSlot="isFetching"
  />
</template>

<script setup lang="ts">
const options = computed(() => {
  const fromList = (organizations.value || []).map((organization: Organization) => ({
    label: organization.name,
    id: organization.id,
    value: organization.id,
  }));

  const merged = [...fromList];
  for (const org of props.selectedOrganizations) {
    if (typeof org === "string") continue;
    if (!merged.some((option) => option.value === org.id)) {
      merged.push({
        label: org.name,
        id: org.id,
        value: org.id,
      });
    }
  }

  return merged;
});

const selectedOrgIds = computed(() =>
  (props.selectedOrganizations || []).map((org) =>
    typeof org === "string" ? org : org.id
  )
);

interface Props {
  id: string;
  selectedOrganizations: Array<Organization | string>;
  label: string;
  hasColOptions?: boolean;
  linkedUserId?: string | number | null;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});
const filters = ref<{ name?: string }>({});

const { debounce } = useDebounce();

const updateFilters = (val: unknown) => {
  filters.value.name = val as string;
};

const handleFilterValueUpdate = debounce(updateFilters, 300);

const linked_user_id = computed(() => String(props.linkedUserId) || "");

const {
  data: organizations,
  getMore,
  pending,
} = useGetOrganizationsByUser(linked_user_id.value, filters);
const isFetching = computed(() => pending.value);

const emit = defineEmits<{
  (e: "update:selectedOptions", value: string[]): void;
}>();
const handleChange = (newValue: string[]) => {
  emit("update:selectedOptions", newValue);
};
</script>
