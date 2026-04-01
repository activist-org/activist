// SPDX-License-Identifier: AGPL-3.0-or-later
export const useSidebarClass = () => {
  const sidebar = useSidebar();

  /**
   * Computes the dynamic classes for the sidebar content based on the collapsed state of the sidebar, whether the sidebar is in a collapsed switch state, whether the sidebar content is scrollable, and whether the sidebar is being hovered over. The computed classes adjust the padding and blur effects on the sidebar content to create a responsive and interactive user interface that adapts to different screen sizes and user interactions with the sidebar.
   * @param sidebarContentScrollable A boolean indicating whether the sidebar content is scrollable, which affects the padding classes applied to the sidebar content.
   * @param sidebarHover A Ref<boolean> that indicates whether the sidebar is currently being hovered over, which affects the application of blur classes to the sidebar content when the sidebar is in a collapsed switch state and not fully collapsed.
   * @returns A computed object containing the dynamic classes to be applied to the sidebar content based on the current state of the sidebar and user interactions.
   */
  function getSidebarContentDynamicClass(
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
        sidebar.collapsed &&
        sidebar.collapsedSwitch &&
        sidebarContentScrollable,
      "blur-sm xl:blur-none":
        sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
    }));
  }

  /**
   * Computes the dynamic classes for the sidebar footer based on the collapsed state of the sidebar, whether the sidebar is in a collapsed switch state, and whether the sidebar is being hovered over. The computed classes adjust the padding and blur effects on the sidebar footer to create a responsive and interactive user interface that adapts to different screen sizes and user interactions with the sidebar, particularly when the sidebar is in a collapsed switch state and not fully collapsed, where hovering over the sidebar will apply a blur effect to the footer for visual feedback.
   * @param sidebarHover A Ref<boolean> that indicates whether the sidebar is currently being hovered over, which affects the application of blur classes to the sidebar footer when the sidebar is in a collapsed switch state and not fully collapsed.
   * @returns A computed object containing the dynamic classes to be applied to the sidebar footer based on the current state of the sidebar and user interactions.
   */
  function getSidebarFooterDynamicClass(sidebarHover: Ref<boolean>) {
    return computed(() => ({
      "md:pl-24 xl:pl-64": !sidebar.collapsed || !sidebar.collapsedSwitch,
      "md:pl-24 xl:pl-24": sidebar.collapsed && sidebar.collapsedSwitch,
      "blur-sm xl:blur-none":
        sidebar.collapsedSwitch && !sidebar.collapsed && sidebarHover.value,
    }));
  }

  return {
    getSidebarContentDynamicClass,
    getSidebarFooterDynamicClass,
  };
};
