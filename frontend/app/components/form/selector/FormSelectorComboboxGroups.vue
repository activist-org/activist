<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:selectedOptions="(val: unknown) => handleChange(val as Group[])"
    :canFetchMore="true"
    :fetchMore="getMore"
    :hasColOptions="hasColOptions"
    :infinite="true"
    :label="label"
    :options="options"
    :selectedOptions="selectedGroups || []"
    :showLoadingSlot="isFetching"
  />
</template>

<script setup lang="ts">
const options = computed(() =>
  (groups.value || []).map((group: Group) => ({
    label: group.name,
    id: group.id,
    value: group.id,
  }))
);

interface Props {
  id: string;
  selectedGroups: Group[];
  linkedOrganizations: string[];
  label: string;
  hasColOptions?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});
const filters = computed(() => ({
  linked_organizations: props.linkedOrganizations,
}));
const { data: groups, getMore, pending } = useGetGroups(filters);
const isFetching = computed(() => pending.value);

const emit = defineEmits<{
  (e: "update:selectedGroups", value: Group[]): void;
}>();
const handleChange = (newValue: Group[]) => {
  emit("update:selectedGroups", newValue);
};
</script>
