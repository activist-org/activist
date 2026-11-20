// SPDX-License-Identifier: AGPL-3.0-or-later
/* eslint-disable no-console */
/** Writes the report to stdout, and also to test-results/ with `--out`. */

import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

import { ROOT } from "../utils/paths.mjs";

export function emit(text, args) {
  const body = text.endsWith("\n") ? text : `${text}\n`;
  process.stdout.write(body);
  if (!args.out) return;

  const filename = args.json
    ? "e2e-coverage-latest.json"
    : "e2e-coverage-latest.md";
  const outPath = join(ROOT, "test-results", filename);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, body);
  // Keep stdout pure so `--json` stays pipeable.
  console.error(`Wrote ${outPath}`);
}
