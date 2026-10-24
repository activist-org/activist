// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Guard against new physical-direction Tailwind utilities (see #2462).
 *
 * Classes like `pl-4`, `left-0` or `text-left` don't flip when the page is
 * `dir="rtl"`, so Arabic layouts break. New code should use the logical
 * utilities instead (`ps-4`, `start-0`, `text-start`, …). Files that still
 * have physical classes are listed in `physicalDirectionAllowlist.ts`, and
 * that list should only shrink.
 */
import { readdirSync, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { PHYSICAL_DIRECTION_ALLOWLIST } from "./physicalDirectionAllowlist";

const __filename = fileURLToPath(import.meta.url);
const frontendDir = join(dirname(__filename), "..", "..");

const SCANNED_DIRS = ["app", "shared"];
const SCANNED_EXTENSIONS = /\.(vue|ts|css)$/;

// Tailwind values for spacing and inset utilities: 1/2, 4, 0.5, px, full, auto, [0.625rem].
const VALUE = String.raw`(?:\d+\/\d+|\d+(?:\.\d+)?|px|full|auto|\[[^\]\s]+\])`;

/**
 * Matches physical-direction utilities, with or without variants (`md:pl-16`)
 * and negative values (`-mr-2`). Logical utilities and `space-x-*` don't match.
 */
const PHYSICAL_DIRECTION_CLASS = new RegExp(
  String.raw`(?<![\w-])-?(?:` +
    String.raw`[mp][lr]-${VALUE}` +
    String.raw`|(?:left|right)-${VALUE}` +
    String.raw`|text-(?:left|right)` +
    String.raw`|float-(?:left|right)` +
    String.raw`|rounded-(?:[lr]|tl|tr|bl|br)(?:-(?:none|xs|sm|md|lg|xl|2xl|3xl|full|\[[^\]\s]+\]))?` +
    String.raw`|border-[lr](?:-(?:\d+|\[[^\]\s]+\]|[a-z]+(?:-\d+)?))?` +
    String.raw`)(?![\w-])`,
  "g"
);

const LOGICAL_HINT =
  "Use logical utilities instead: ml/mr → ms/me, pl/pr → ps/pe, left/right → start/end, " +
  "text-left/right → text-start/end, rounded-l/r → rounded-s/e, rounded-tl/tr/bl/br → rounded-ss/se/es/ee, " +
  "border-l/r → border-s/e, float-left/right → float-start/end.";

/**
 * Lists every scanned source file under the given directory.
 * @param dir Absolute path of the directory to walk.
 * @returns Absolute paths of the `.vue`, `.ts` and `.css` files in it.
 */
const listSourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(path);
    return SCANNED_EXTENSIONS.test(entry.name) ? [path] : [];
  });

/**
 * Finds the physical-direction classes in each scanned file.
 * @returns The matched classes per file path, relative to `frontend/`.
 */
const findPhysicalClasses = (): Record<string, string[]> => {
  const found: Record<string, string[]> = {};
  for (const dir of SCANNED_DIRS) {
    for (const file of listSourceFiles(join(frontendDir, dir))) {
      const matches = readFileSync(file, "utf8").match(
        PHYSICAL_DIRECTION_CLASS
      );
      if (matches) found[relative(frontendDir, file)] = matches;
    }
  }
  return found;
};

describe("RTL guard: physical-direction Tailwind classes", () => {
  // MARK: Pattern

  it("matches physical-direction utilities", () => {
    // Class string → the part the pattern reports (variants aren't included).
    const physical: [string, string][] = [
      ["pl-4", "pl-4"],
      ["pr-[0.625rem]", "pr-[0.625rem]"],
      ["md:pl-16", "pl-16"],
      ["-mr-2", "-mr-2"],
      ["ml-auto", "ml-auto"],
      ["left-0", "left-0"],
      ["right-1/2", "right-1/2"],
      ["hover:text-left", "text-left"],
      ["text-right", "text-right"],
      ["float-right", "float-right"],
      ["rounded-r-md", "rounded-r-md"],
      ["rounded-tl-lg", "rounded-tl-lg"],
      ["rounded-l", "rounded-l"],
      ["border-r", "border-r"],
      ["border-l-8", "border-l-8"],
      ["border-l-[#2176AE]", "border-l-[#2176AE]"],
    ];
    for (const [cls, expected] of physical) {
      expect(cls.match(PHYSICAL_DIRECTION_CLASS), cls).toEqual([expected]);
    }
  });

  it("does not match logical utilities or other words", () => {
    const allowed = [
      "ps-4",
      "pe-[0.625rem]",
      "md:ps-16",
      "-me-2",
      "ms-auto",
      "start-0",
      "end-1/2",
      "text-start",
      "text-end",
      "float-end",
      "rounded-e-md",
      "rounded-ss-lg",
      "border-e",
      "border-s-8",
      "space-x-2",
      "inset-x-0",
      "px-4",
      "pt-2",
      "mb-1",
      "right-to-left",
      "template-left-0",
    ];
    for (const cls of allowed) {
      expect(cls.match(PHYSICAL_DIRECTION_CLASS), cls).toBeNull();
    }
  });

  // MARK: Allowlist

  const found = findPhysicalClasses();

  it("only allowlisted files use physical-direction classes", () => {
    const unlisted = Object.entries(found)
      .filter(([file]) => !(file in PHYSICAL_DIRECTION_ALLOWLIST))
      .map(([file, classes]) => `${file}: ${classes.join(", ")}`);

    expect(
      unlisted,
      `New physical-direction classes found.\n${LOGICAL_HINT}`
    ).toEqual([]);
  });

  it("allowlisted files don't gain physical-direction classes", () => {
    const grown = Object.entries(found)
      .filter(
        ([file, classes]) =>
          classes.length > (PHYSICAL_DIRECTION_ALLOWLIST[file] ?? Infinity)
      )
      .map(
        ([file, classes]) =>
          `${file}: ${classes.length} (allowlist: ${PHYSICAL_DIRECTION_ALLOWLIST[file]}): ${classes.join(", ")}`
      );

    expect(
      grown,
      `New physical-direction classes found.\n${LOGICAL_HINT}`
    ).toEqual([]);
  });

  it("the allowlist shrinks when files are converted", () => {
    const stale = Object.entries(PHYSICAL_DIRECTION_ALLOWLIST)
      .filter(([file, count]) => (found[file]?.length ?? 0) < count)
      .map(
        ([file, count]) =>
          `${file}: ${found[file]?.length ?? 0} left (allowlist: ${count})`
      );

    expect(
      stale,
      "Lower these counts in physicalDirectionAllowlist.ts, or remove files that have none left."
    ).toEqual([]);
  });
});
