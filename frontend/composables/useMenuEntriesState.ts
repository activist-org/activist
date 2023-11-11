import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";


const createMenuEntry = (label: string, basePath: string, iconURL: string, active: boolean) => {
  const { locale, locales } = useI18n();
  const router = useRouter();
  const id = Number(router.currentRoute.value.params.id);
  const routeURL = `/${locale.value}/${basePath}/${id}/${label.split(".").pop()!.toLowerCase()}`;
  const selected = useRoute().path.endsWith(label.toLowerCase());

  return {
    label,
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

  const organizationEntries = ref([
    createMenuEntry("_global.about", "organizations", "bi:card-text", true),
    createMenuEntry("components.sidebar-left-selector.label.events", "organizations", "bi:calendar-check", true),
    createMenuEntry("components.sidebar-left-selector.label.groups", "organizations", "IconGroup", true),
    createMenuEntry("components._global.resources", "organizations", "IconResource", true),
    createMenuEntry("_global.faq", "organizations", "IconFAQ", true),
    createMenuEntry("components.sidebar-left-selector.label.settings", "organizations", "bi:gear", true),
    createMenuEntry("components.sidebar-left-selector.label.affiliates", "organizations", "IconSupport", true),
    createMenuEntry("components.sidebar-left-selector.label.tasks", "organizations", "bi:check-square", true),
    createMenuEntry("components.sidebar-left-selector.label.discussions", "organizations", "octicon:comment-discussion-24", true),
  ]);

  const eventEntries = ref([
    createMenuEntry("_global.about", "events", "bi:card-text", true),
    createMenuEntry("components.sidebar-left-selector.label.team", "events", "bi:people", true),
    createMenuEntry("components._global.resources", "events", "IconResource", true),
    createMenuEntry("components.sidebar-left-selector.label.settings", "events", "bi:gear", true),
    createMenuEntry("components.sidebar-left-selector.label.tasks", "events", "bi:check-square", true),
    createMenuEntry("components.sidebar-left-selector.label.discussions", "events", "octicon:comment-discussion-24", true),
  ]);

  const updateCurrentPath = () => {
    currentPath.value = router.currentRoute.value.fullPath;

    const buttons = currentPath.value.includes("/organizations/") ? organizationEntries : eventEntries;

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
    organizationEntry: organizationEntries,
    eventEntry: eventEntries,
  };
};

export default useMenuEntriesState;
