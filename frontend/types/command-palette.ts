// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: This could be in a Pinia store.

export const commandPaletteData = [
  {
    id: 7,
    category: "home",
    path: "home",
    iconName: "HOME",
    displayName: "_global.home",
    action: () => console.log("home"),
  },
  {
    id: 1,
    category: "discussions",
    path: "discussions",
    iconName: "DISCUSSION",
    displayName: "_global.discussions",
    action: () => console.log("discussions"),
  },
  {
    id: 2,
    category: "events",
    path: "events",
    iconName: "EVENT",
    displayName: "_global.events",
    action: () => console.log("events"),
  },
  {
    id: 3,
    category: "notifications",
    path: "notifications",
    iconName: "BELL",
    displayName: "_global.notifications",
    action: () => console.log("notifications"),
  },
  {
    id: 4,
    category: "organizations",
    path: "organizations",
    iconName: "ORGANIZATION",
    displayName: "_global.organization_name",
    action: () => console.log("organizations"),
  },
  // {
  //   id: 5,
  //   category: "resources",
  //   path: "resources",
  //   iconName: "RESOURCE",
  //   displayName: "_global.resources_lower",
  //   action: () => console.log('resources')
  // },
  {
    id: 6,
    category: "upcoming-events",
    path: "upcoming-events",
    iconName: "EVENT",
    displayName: "types.command_palette.upcoming_events",
    action: () => console.log("upcoming-events"),
  },
];
