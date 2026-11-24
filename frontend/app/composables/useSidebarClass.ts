// SPDX-License-Identifier: AGPL-3.0-or-later
export const useSidebarClass = () => {
  const sidebar = useSidebar();

  function getSidebarContentDynamicClass(sidebarContentScrollable: boolean) {
    return computed(() => {
      const collapsed = sidebar.collapsed && sidebar.collapsedSwitch;
      const expanded = !sidebar.collapsed || !sidebar.collapsedSwitch;

      return {
        "md:ps-16": collapsed && !sidebarContentScrollable,
        "md:ps-20": collapsed && sidebarContentScrollable,
        "md:ps-56": expanded && !sidebarContentScrollable,
        "md:ps-60": expanded && sidebarContentScrollable,
      };
    });
  }

  function getSidebarFooterDynamicClass() {
    return computed(() => {
      const collapsed = sidebar.collapsed && sidebar.collapsedSwitch;
      const expanded = !sidebar.collapsed || !sidebar.collapsedSwitch;

      return {
        "md:ps-24": collapsed,
        "md:ps-64": expanded,
      };
    });
  }

  return {
    getSidebarContentDynamicClass,
    getSidebarFooterDynamicClass,
  };
};
