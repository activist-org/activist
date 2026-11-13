// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * File system helpers shared by the parsers.
 */

import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

/** Every file under `dir` ending in `ext`, recursively. Type declarations are skipped. */
export function walkFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkFiles(full, ext));
    } else if (entry.endsWith(ext) && !entry.endsWith(".d.ts")) {
      results.push(full);
    }
  }
  return results;
}

/** Relative path with forward slashes so report output matches on Windows. */
export function posixRel(from, file) {
  return relative(from, file).split("\\").join("/");
}
