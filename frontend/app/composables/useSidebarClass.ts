// SPDX-License-Identifier: AGPL-3.0-or-later
export const useSidebarClass = () => {
  const sidebar = useSidebar();

  function getSidebarContentDynamicClass(
    sidebarContentScrollable: boolean,
    sidebarHover: Ref<boolean>
  ) {
    return computed(() => {
      const collapsed = sidebar.collapsed && sidebar.collapsedSwitch;
      const expanded = !sidebar.collapsed || !sidebar.collapsedSwitch;

      return {
        "md:pl-16": collapsed && !sidebarContentScrollable,
        "md:pl-20": collapsed && sidebarContentScrollable,
        "md:pl-56": expanded && !sidebarContentScrollable,
        "md:pl-60": expanded && sidebarContentScrollable,
        "blur-sm xl:blur-none":
          sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
      };
    });
  }

  function getSidebarFooterDynamicClass(sidebarHover: Ref<boolean>) {
    return computed(() => {
      const collapsed = sidebar.collapsed && sidebar.collapsedSwitch;
      const expanded = !sidebar.collapsed || !sidebar.collapsedSwitch;

      return {
        "md:pl-24": collapsed,
        "md:pl-64": expanded,
        "blur-sm xl:blur-none":
          sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
      };
    });
  }

  return {
    getSidebarContentDynamicClass,
    getSidebarFooterDynamicClass,
  };
};
