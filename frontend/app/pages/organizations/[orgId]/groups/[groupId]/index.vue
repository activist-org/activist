<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
const { orgId, groupId } = useRoute().params;
const { locale } = useI18n();

onMounted(() => {
  navigateTo(
    `/${locale.value}/organizations/${orgId}/groups/${groupId}/about`,
    { replace: true }
  );
});
</script>
