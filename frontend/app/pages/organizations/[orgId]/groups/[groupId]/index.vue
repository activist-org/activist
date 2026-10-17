<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
// Unlike organizations and events, groups have no mobile menu page of their own,
// so the base route always goes to the group's about page.
const { orgId, groupId } = useRoute().params;
const { locale } = useI18n();

onMounted(() => {
  navigateTo(
    `/${locale.value}/organizations/${orgId}/groups/${groupId}/about`,
    { replace: true }
  );
});
</script>
