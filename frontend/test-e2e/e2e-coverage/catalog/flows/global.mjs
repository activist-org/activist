// SPDX-License-Identifier: AGPL-3.0-or-later
/** Site-wide pages and behavior that is not tied to one entity. */

import { c } from "../case.mjs";

export const GLOBAL_FLOWS = [
  {
    id: "F26",
    name: "Global search",
    cases: [
      c("S-DISP-01", "DISP", "Search page loads", [
        "specs/all/search",
        "specs/desktop/search",
        "specs/mobile/search",
      ]),
      // Title filters keep a bare page-load spec from also claiming the
      // behavior rows on these pages.
      c("S-INT-01", "INT", "Query, results, navigate", "search.spec", {
        title: "result|query|navigat",
      }),
    ],
  },
  {
    id: "F27",
    name: "Global groups catalog",
    cases: [
      c("GG-DISP-01", "DISP", "/groups catalog loads", "specs/all/groups"),
    ],
  },
  {
    id: "F28",
    name: "Contact",
    cases: [
      c("C-DISP-01", "DISP", "Contact page loads", "contact"),
      c("C-VAL-01", "VAL", "Contact form validation", "contact", {
        title: "validation|invalid|required|error",
      }),
    ],
  },
  {
    id: "F29",
    name: "Route query / topics",
    cases: [
      c(
        "T-INT-01",
        "INT",
        "Topic(s) persist in events URL",
        "route-query-topics-stability"
      ),
      // /home mounts ComboboxTopics without a query handler, so topic
      // selection there never reaches the URL. Not testable until it is wired.
      c(
        "T-INT-03",
        "INT",
        "Home topics URL persistence",
        "route-query-topics-stability",
        {
          title: "home",
          required: false,
        }
      ),
    ],
  },
];
