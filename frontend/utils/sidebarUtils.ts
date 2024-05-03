const sidebar = useSidebar();

export function getSidebarContentDynamicClass(
  sidebarContentScrollable: boolean,
  sidebarHover: boolean
) {
  return computed(() => ({
    "md:pl-16 xl:pl-56":
      sidebar.collapsed == false || sidebar.collapsedSwitch == false,
    "md:pl-16 xl:pl-16":
      sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    "md:pl-20 xl:pl-60":
      (sidebar.collapsed == false || sidebar.collapsedSwitch == false) &&
      sidebarContentScrollable,
    "md:pl-20 xl:pl-20":
      sidebar.collapsed == true &&
      sidebar.collapsedSwitch == true &&
      sidebarContentScrollable,
    "blur-sm xl:blur-none":
      sidebar.collapsedSwitch == true &&
      sidebar.collapsed == false &&
      sidebarHover == true,
  }));
}

export function getSidebarFooterDynamicClass(sidebarHover: boolean) {
  return computed(() => ({
    "md:pl-24 xl:pl-64":
      sidebar.collapsed == false || sidebar.collapsedSwitch == false,
    "md:pl-24 xl:pl-24":
      sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    "blur-sm xl:blur-none":
      sidebar.collapsedSwitch == true &&
      sidebar.collapsed == false &&
      sidebarHover == true,
  }));
}
