<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
const { eventId } = useRoute().params;
const { locale } = useI18n();

onMounted(() => {
  navigateTo(`/${locale.value}/events/${eventId}/about`, {
    replace: true,
  });
});
</script>
