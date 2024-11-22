import { IconMap } from "~/types/icon-map";

const createMenuEntry = (label: string, basePath: string, iconUrl: string) => {
  const { locale } = useI18n();
  const router = useRouter();

  const { id } = router.currentRoute.value.params as { id: string };
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
  };
};

const useMenuEntriesState = () => {
  const router = useRouter();
  const currentPath = ref(router.currentRoute.value.fullPath);
  let removeGuard = () => {};

  const organizationEntries = ref([
    createMenuEntry("_global.about", "organizations", `${IconMap.ABOUT}`),
    createMenuEntry("_global.events", "organizations", `${IconMap.EVENT}`),
    createMenuEntry(
      "composables.use_menu_entries_state.groups",
      "organizations",
      `${IconMap.GROUP}`
    ),
    createMenuEntry(
      "_global.resources",
      "organizations",
      `${IconMap.RESOURCE}`
    ),
    createMenuEntry("_global.faq", "organizations", `${IconMap.FAQ}`),
    // createMenuEntry("_global.team", "organizations", `${IconMap.PEOPLE}`),
    createMenuEntry(
      "composables.use_menu_entries_state.affiliates",
      "organizations",
      `${IconMap.SUPPORT}`
    ),
    createMenuEntry("_global.tasks", "organizations", `${IconMap.TASK}`),
    createMenuEntry(
      "_global.discussions",
      "organizations",
      `${IconMap.DISCUSSION}`
    ),
    createMenuEntry("_global.settings", "organizations", `${IconMap.SETTINGS}`),
  ]);

  const eventEntries = ref([
    createMenuEntry("_global.about", "events", `${IconMap.ABOUT}`),
    createMenuEntry("_global.team", "events", `${IconMap.PEOPLE}`),
    createMenuEntry("_global.resources", "events", `${IconMap.RESOURCE}`),
    createMenuEntry("_global.tasks", "events", `${IconMap.TASK}`),
    createMenuEntry("_global.discussion", "events", `${IconMap.DISCUSSION}`),
    createMenuEntry("_global.settings", "events", `${IconMap.SETTINGS}`),
  ]);

  const updateCurrentPath = () => {
    currentPath.value = router.currentRoute.value.fullPath;

    const buttons = currentPath.value.includes("/organizations/")
      ? organizationEntries
      : eventEntries;

    for (const button of buttons.value) {
      button.selected = false;
    }

    for (const button of buttons.value) {
      if (currentPath.value.includes("/groups/")) {
        if (button.label === "composables.use_menu_entries_state.groups") {
          button.selected = true;
        } else {
          button.selected = false;
        }
      } else {
        button.selected = currentPath.value.endsWith(
          button.routeUrl.split("/").pop()!
        );
      }
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
