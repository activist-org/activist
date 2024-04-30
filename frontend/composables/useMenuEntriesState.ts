const createMenuEntry = (label: string, basePath: string, iconURL: string) => {
  const { locale } = useI18n();
  const router = useRouter();
  const id = Number(router.currentRoute.value.params.id);
  const routeURL = `/${locale.value}/${basePath}/${id}/${label
    .split(".")
    .pop()!
    .toLowerCase()}`;
  const selected = useRoute().path.endsWith(label.toLowerCase());

  return {
    label,
    routeURL,
    iconURL,
    selected,
    id,
  };
};

const useMenuEntriesState = () => {
  const router = useRouter();
  const currentPath = ref(router.currentRoute.value.fullPath);
  let removeGuard = () => {};

  const organizationEntries = ref([
    createMenuEntry("_global.about", "organizations", "bi:card-text"),
    createMenuEntry("_global.events", "organizations", "bi:calendar-check"),
    createMenuEntry("_global.groups", "organizations", "IconGroup"),
    createMenuEntry("_global.resources", "organizations", "IconResource"),
    createMenuEntry("_global.faq", "organizations", "IconFAQ"),
    // createMenuEntry("_global.team", "organizations", "bi:people"),
    createMenuEntry("_global.affiliates", "organizations", "IconSupport"),
    createMenuEntry("_global.tasks", "organizations", "bi:check-square"),
    createMenuEntry(
      "_global.discussions",
      "organizations",
      "octicon:comment-discussion-24"
    ),
    createMenuEntry("_global.settings", "organizations", "bi:gear"),
  ]);

  const eventEntries = ref([
    createMenuEntry("_global.about", "events", "bi:card-text"),
    createMenuEntry("_global.team", "events", "bi:people"),
    createMenuEntry("_global.resources", "events", "IconResource"),
    createMenuEntry("_global.tasks", "events", "bi:check-square"),
    createMenuEntry(
      "_global.discussion",
      "events",
      "octicon:comment-discussion-24"
    ),
    createMenuEntry("_global.settings", "events", "bi:gear"),
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
        if (button.label === "_global.groups") {
          button.selected = true;
        } else {
          button.selected = false;
        }
      } else {
        button.selected = currentPath.value.endsWith(
          button.routeURL.split("/").pop()!
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
