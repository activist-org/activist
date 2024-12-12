<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { onMounted } from "vue";

const { id } = useRoute().params;
const { groupid } = useRoute().params;

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    if (
      currentRoute.path !==
        `/${locale.value}/organizations/${id}/groups/${groupid}/about` ||
      currentRoute.path === `/${locale.value}/organizations/${id}/`
    ) {
      navigateTo(
        `/${locale.value}/organizations/${id}/groups/${groupid}/about`
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
