<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
import { onMounted } from "vue";

import { BreakpointMap } from "~/types/breakpoint-map";

const { orgId } = useRoute().params;
const { groupid } = useRoute().params;

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    if (
      currentRoute.path !==
        `/${locale.value}/organizations/${orgId}/groups/${groupid}/about` ||
      currentRoute.path === `/${locale.value}/organizations/${orgId}/`
    ) {
      navigateTo(
        `/${locale.value}/organizations/${orgId}/groups/${groupid}/about`
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
</script>
