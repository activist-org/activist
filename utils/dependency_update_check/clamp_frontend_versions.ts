// SPDX-License-Identifier: AGPL-3.0-or-later
// Ran as a part of the dependency_update_check GitHub Action to cap frontend
// dependencies at a maximum version before they're installed and tested.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const PACKAGE_JSON_PATH = fileURLToPath(
  new URL('./../../frontend/package.json', import.meta.url)
);

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function isGreater(a: string, b: string): boolean {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);

    if (diff !== 0) {
      return diff > 0;
    }
  }

  return false;
}

function main(): void {
  const maxVersions: Record<string, string> = JSON.parse(
    process.env.FRONTEND_MAX_VERSIONS ?? '{}'
  );

  if (Object.keys(maxVersions).length === 0) {
    return;
  }

  const pkg: PackageJson = JSON.parse(
    fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8')
  );

  let changed = false;

  for (const [name, maxVersion] of Object.entries(maxVersions)) {
    for (const section of ['dependencies', 'devDependencies'] as const) {
      const current = pkg[section]?.[name];

      if (current && isGreater(current, maxVersion)) {
        console.log(
          `Capping ${name} at ${maxVersion} (was ${current}) due to a maximum version restriction.`
        );
        pkg[section]![name] = maxVersion;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
  }
}

main();
