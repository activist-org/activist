// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: This could be in a Pinia store.
import { i18nMap } from "~/types/i18n-map";

export const commandPaletteData = [
  {
    id: 7,
    category: "home",
    path: "home",
    iconName: "HOME",
    displayName: i18nMap._global.home,
    action: () => console.log("home"),
  },
  {
    id: 1,
    category: "discussions",
    path: "discussions",
    iconName: "DISCUSSION",
    displayName: i18nMap._global.discussions,
    action: () => console.log("discussions"),
  },
  {
    id: 2,
    category: "events",
    path: "events",
    iconName: "EVENT",
    displayName: i18nMap._global.events,
    action: () => console.log("events"),
  },
  {
    id: 3,
    category: "notifications",
    path: "notifications",
    iconName: "BELL",
    displayName: i18nMap._global.notifications,
    action: () => console.log("notifications"),
  },
  {
    id: 4,
    category: "organizations",
    path: "organizations",
    iconName: "ORGANIZATION",
    displayName: i18nMap._global.organization_name,
    action: () => console.log("organizations"),
  },
  // {
  //   id: 5,
  //   category: "resources",
  //   path: "resources",
  //   iconName: "RESOURCE",
  //   displayName: i18nMap._global.resources_lower,
  //   action: () => console.log('resources')
  // },
  {
    id: 6,
    category: "upcoming-events",
    path: "upcoming-events",
    iconName: "EVENT",
    displayName: i18nMap.types.command_palette.upcoming_events,
    action: () => console.log("upcoming-events"),
  },
];
