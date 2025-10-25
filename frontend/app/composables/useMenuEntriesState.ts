// SPDX-License-Identifier: AGPL-3.0-or-later
import { IconMap } from "~/types/icon-map";

const createMenuEntry = (label: string, basePath: string, iconUrl: string) => {
  const { locale } = useI18n();
  const router = useRouter();

  const id = (router.currentRoute.value.params.groupId ||
    router.currentRoute.value.params.orgId ||
    router.currentRoute.value.params.eventId ||
    router.currentRoute.value.params.id) as string;
  const routeUrl = `/${locale.value}/${basePath}/${id}/${label
    .split(".")
    .pop()!
    .toLowerCase()}`;
  const selected = useRoute().path.endsWith(label.toLowerCase());

  return {
    label,
    routeUrl,
    iconUrl,
    selected,
    id,
    basePath, // add basePath so we can reconstruct the URL later
  };
};

const useMenuEntriesState = () => {
  const router = useRouter();
  const { locale } = useI18n(); // Move useI18n to top level
  const currentPath = ref(router.currentRoute.value.fullPath);
  let removeGuard: (() => void) | null = null;

  const organizationEntries = ref([
    createMenuEntry("i18n._global.about", "organizations", `${IconMap.ABOUT}`),
    createMenuEntry("i18n._global.events", "organizations", `${IconMap.EVENT}`),
    createMenuEntry(
      "i18n.composables.use_menu_entries_state.groups",
      "organizations",
      `${IconMap.GROUP}`
    ),
    createMenuEntry(
      "i18n._global.resources",
      "organizations",
      `${IconMap.RESOURCE}`
    ),
    createMenuEntry("i18n._global.faq", "organizations", `${IconMap.FAQ}`),
    // createMenuEntry("i18n.composables.use_menu_entries_state.team, "organizations", `${IconMap.PEOPLE}`),
    createMenuEntry(
      "i18n.composables.use_menu_entries_state.affiliates",
      "organizations",
      `${IconMap.SUPPORT}`
    ),
    createMenuEntry(
      "i18n.composables.use_menu_entries_state.tasks",
      "organizations",
      `${IconMap.TASK}`
    ),
    createMenuEntry(
      "i18n._global.discussions",
      "organizations",
      `${IconMap.DISCUSSION}`
    ),
    createMenuEntry(
      "i18n._global.settings",
      "organizations",
      `${IconMap.SETTINGS}`
    ),
  ]);

  const eventEntries = ref([
    createMenuEntry("i18n._global.about", "events", `${IconMap.ABOUT}`),
    createMenuEntry(
      "i18n.composables.use_menu_entries_state.team",
      "events",
      `${IconMap.PEOPLE}`
    ),
    createMenuEntry("i18n._global.resources", "events", `${IconMap.RESOURCE}`),
    createMenuEntry("i18n._global.faq", "events", `${IconMap.FAQ}`),
    createMenuEntry(
      "i18n.composables.use_menu_entries_state.tasks",
      "events",
      `${IconMap.TASK}`
    ),
    createMenuEntry(
      "i18n._global.discussion",
      "events",
      `${IconMap.DISCUSSION}`
    ),
    createMenuEntry("i18n._global.settings", "events", `${IconMap.SETTINGS}`),
  ]);

  const updateCurrentPath = () => {
    currentPath.value = router.currentRoute.value.fullPath;

    const buttons = currentPath.value.includes("/organizations/")
      ? organizationEntries
      : eventEntries;

    // Update the id and routeUrl for each button based on current route params.
    const currentId = (router.currentRoute.value.params.groupId ||
      router.currentRoute.value.params.orgId ||
      router.currentRoute.value.params.eventId ||
      router.currentRoute.value.params.id) as string;

    for (const button of buttons.value) {
      button.selected = false;
      // Update the id and routeUrl to reflect current route params.
      button.id = currentId;
      button.routeUrl = `/${locale.value}/${button.basePath}/${currentId}/${button.label
        .split(".")
        .pop()!
        .toLowerCase()}`;
    }

    for (const button of buttons.value) {
      if (currentPath.value.includes("/groups/")) {
        if (button.label === "i18n.composables.use_menu_entries_state.groups") {
          button.selected = true;
        } else {
          button.selected = false;
        }
      } else {
        // Extract the last segment from the current route path
        const currentRoutePath = router.currentRoute.value.path;
        const pathSegments = currentRoutePath.split("/").filter(seg => seg.length > 0);
        const currentPageName = pathSegments[pathSegments.length - 1];
        
        // Extract the page name from the button label
        const buttonPageName = button.label.split(".").pop()!.toLowerCase();
        
        // Match by comparing the page names
        button.selected = currentPageName === buttonPageName;
      }
    }
  };

  // Call updateCurrentPath immediately to set initial selected state.
  // This ensures selectedMenuItem is set before components try to access it.
  updateCurrentPath();

  // Watch for route changes to update menu selection
  watch(
    () => router.currentRoute.value.path,
    () => {
      updateCurrentPath();
    },
    { immediate: false }
  );

  onMounted(() => {
    removeGuard = router.afterEach(updateCurrentPath);
  });

  onUnmounted(() => {
    removeGuard?.();
  });

  return {
    organizationEntry: organizationEntries,
    eventEntry: eventEntries,
  };
};

export default useMenuEntriesState;
