// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Branch and commit stamped onto the report header.
 */

import { execSync } from "child_process";

import { ROOT } from "./paths.mjs";

export function gitMeta() {
  try {
    const opts = { encoding: "utf8", cwd: ROOT };
    return {
      branch: execSync("git rev-parse --abbrev-ref HEAD", opts).trim(),
      sha: execSync("git rev-parse --short HEAD", opts).trim(),
    };
  } catch {
    return { branch: "unknown", sha: "unknown" };
  }
}
