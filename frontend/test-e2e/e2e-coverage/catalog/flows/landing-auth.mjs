// SPDX-License-Identifier: AGPL-3.0-or-later
/** Landing page, authentication, and the signed-in shell. */

import { c } from "../case.mjs";

export const LANDING_AUTH_FLOWS = [
  {
    id: "F01",
    name: "Landing",
    cases: [
      c(
        "L-DISP-01",
        "DISP",
        "Page title and hero visible",
        "landing-page/landing-page.spec"
      ),
      c("L-NAV-01", "NAV", "Navigate to Events", "landing-page"),
      c("L-NAV-02", "NAV", "Navigate to Organizations", "landing-page"),
      c(
        "L-NAV-03",
        "NAV",
        "Sign In / Sign Up CTAs",
        "landing-page-hero-navigation"
      ),
      c(
        "L-NAV-04",
        "NAV",
        "Learn More sections",
        "landing-page-hero-navigation"
      ),
      c("L-INT-01", "INT", "Footer links", "landing-page-features-cta"),
      c("L-INT-02", "INT", "Social link counts", "landing-page-features-cta"),
      c("L-INT-03", "INT", "Theme toggle", "landing-page-hero-navigation"),
      c("L-INT-04", "INT", "Language selector", "landing-page-hero-navigation"),
      c("L-A11Y-01", "A11Y", "Landing axe scan", "landing-page-accessibility"),
    ],
  },
  {
    id: "F02",
    name: "Sign in",
    cases: [
      c("A-VAL-01", "VAL", "Empty/invalid credentials", "sign-in-validation"),
      c(
        "A-HAPPY-01",
        "HAPPY",
        "Sign in to home + cookie",
        "sign-in-authentication"
      ),
      c(
        "A-ERR-01",
        "ERR",
        "401 / 429 / network failure",
        "sign-in-server-errors"
      ),
      c("A-UI-01", "UI", "Show/hide password", "sign-in", {
        title: "show and hide password",
      }),
      c("A-A11Y-01", "A11Y", "Sign-in axe", "sign-in", { title: "accessib" }),
    ],
  },
  {
    id: "F03",
    name: "Sign up",
    cases: [
      c(
        "A-VAL-02",
        "VAL",
        "Password strength / mismatch / captcha",
        "sign-up-validation"
      ),
      c(
        "A-HAPPY-02",
        "HAPPY",
        "Sign up, confirm email, sign in",
        "sign-up-authentication"
      ),
    ],
  },
  {
    id: "F04",
    name: "Password reset",
    cases: [
      c("A-VAL-05", "VAL", "Invalid email on reset request", "password-reset"),
      c(
        "A-HAPPY-03",
        "HAPPY",
        "Password reset end-to-end",
        "password-reset-authentication"
      ),
      c("A-DISP-04", "DISP", "/auth/reset-password form", "password-reset"),
      c("A-DISP-03", "DISP", "/auth/set-password form", "set-password"),
    ],
  },
  {
    id: "F05",
    name: "Email confirm",
    cases: [
      c(
        "A-DISP-02",
        "DISP",
        "/auth/confirm/email standalone UX",
        "confirm/email"
      ),
    ],
  },
  {
    id: "F07",
    name: "Sign out",
    cases: [c("A-HAPPY-04", "HAPPY", "Sign out", "sign-out-validation")],
  },
  {
    id: "F08",
    name: "Home & shell",
    cases: [
      c("H-DISP-01", "DISP", "Home loads for authed user", "home-page.spec"),
      c("H-INT-01", "INT", "Topics filter expand/collapse", "all/home-page"),
      c(
        "H-INT-02",
        "INT",
        "Search modal shortcut",
        ["desktop/home-page", "home-page"],
        {
          title: "search|CTRL|shortcut",
        }
      ),
      c("H-NAV-01", "NAV", "Nav to Events / Organizations", "home-page"),
      c("H-A11Y-01", "A11Y", "Home axe", "home-page", { title: "accessib" }),
      // Search results are owned by S-INT-01 and home topic URL persistence by
      // T-INT-03, so duplicate rows here were double counting the same work.
    ],
  },
];
