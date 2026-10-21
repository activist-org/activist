<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
const { locale } = useI18n();
const currentRoute = useRoute();

const { orgId } = currentRoute.params;
const { groupId } = currentRoute.params;

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value >= BreakpointMap.SMALL) {
    if (
      currentRoute.path !==
      `/${locale.value}/organizations/${orgId}/groups/${groupId}/about`
    ) {
      navigateTo(
        `/${locale.value}/organizations/${orgId}/groups/${groupId}/about`
      );
    }
  }
};

onMounted(() => {
  // Add event listener to handle resizing.
  window.addEventListener("resize", handleResize);

  // Verify that the user is on a mobile device.
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
