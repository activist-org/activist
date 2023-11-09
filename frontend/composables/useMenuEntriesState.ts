import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const createMenuEntry = (label: string, basePath: string, iconURL: string, active: boolean) => {
  const router = useRouter();
  const id = Number(router.currentRoute.value.params.id);
  const routeURL = `/${basePath}/${id}/${label.toLowerCase()}`;
  const selected = useRoute().path.endsWith(label.toLowerCase());

  return {
    label: `components.sidebar-left-selector.label.${label.toLowerCase()}`,
    routeURL,
    iconURL,
    selected,
    active,
    id,
  };
};

const useMenuEntriesState = () => {
  const router = useRouter();
  const currentPath = ref(router.currentRoute.value.fullPath);
  let removeGuard = () => {};

  const organizationEntry = ref([
    createMenuEntry("About", "organizations", "bi:card-text", true),
    createMenuEntry("Events", "organizations", "bi:calendar-check", true),
    createMenuEntry("Groups", "organizations", "IconGroup", true),
    createMenuEntry("Resources", "organizations", "IconResource", true),
    createMenuEntry("FAQ", "organizations", "IconFAQ", true),
    createMenuEntry("Settings", "organizations", "bi:gear", true),
    createMenuEntry("Affiliates", "organizations", "IconSupport", true),
    createMenuEntry("Tasks", "organizations", "bi:check-square", true),
    createMenuEntry("Discussions", "organizations", "octicon:comment-discussion-24", true),
  ]);

  const eventEntry = ref([
    createMenuEntry("About", "events", "bi:card-text", true),
    createMenuEntry("Team", "events", "bi:people", true),
    createMenuEntry("Resources", "events", "IconResource", true),
    createMenuEntry("Settings", "events", "bi:gear", true),
    createMenuEntry("Tasks", "events", "bi:check-square", true),
    createMenuEntry("Discussions", "events", "octicon:comment-discussion-24", true),
  ]);

  const updateCurrentPath = () => {
    currentPath.value = router.currentRoute.value.fullPath;

    const buttons = currentPath.value.includes("/organizations/") ? organizationEntry : eventEntry;

    for (const button of buttons.value) {
      button.selected = false;
    }

    for (const button of buttons.value) {
      button.selected = currentPath.value.endsWith(button.routeURL.split("/").pop()!);
    }

  };

  onMounted(() => {
    updateCurrentPath();
    removeGuard = router.afterEach(updateCurrentPath);
  });

  onUnmounted(() => {
    removeGuard();
  });

  return {
    organizationEntry: organizationEntry,
    eventEntry: eventEntry,
  };
};

export default useMenuEntriesState;
