// SPDX-License-Identifier: AGPL-3.0-or-later
const sidebar = useSidebar();

export function getSidebarContentDynamicClass(
  sidebarContentScrollable: boolean,
  sidebarHover: Ref<boolean>
) {
  return computed(() => ({
    "md:pl-16 xl:pl-56": !sidebar.collapsed || !sidebar.collapsedSwitch,
    "md:pl-16 xl:pl-16": sidebar.collapsed && sidebar.collapsedSwitch,
    "md:pl-20 xl:pl-60":
      (!sidebar.collapsed || !sidebar.collapsedSwitch) &&
      sidebarContentScrollable,
    "md:pl-20 xl:pl-20":
      sidebar.collapsed && sidebar.collapsedSwitch && sidebarContentScrollable,
    "blur-sm xl:blur-none":
      sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
  }));
}

export function getSidebarFooterDynamicClass(sidebarHover: Ref<boolean>) {
  return computed(() => ({
    "md:pl-24 xl:pl-64": !sidebar.collapsed || !sidebar.collapsedSwitch,
    "md:pl-24 xl:pl-24": sidebar.collapsed && sidebar.collapsedSwitch,
    "blur-sm xl:blur-none":
      sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
  }));
}
