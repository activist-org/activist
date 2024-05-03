<script setup lang="ts">
import { onMounted } from "vue";
import useRouteToName from "~/composables/useRouteToName";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const { id } = useRoute().params;

const handleResize = () => {
  window.removeEventListener("resize", handleResize);
  navigateTo(`${id}/about`);
};

onMounted(() => {
  // Add event listener to handle resizing.
  window.addEventListener("resize", handleResize);

  // Verify that the user is on a mobile device.
  handleResize();
});
</script>
