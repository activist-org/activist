// SPDX-License-Identifier: AGPL-3.0-or-later
// Ran as a part of the dependency_update_check GitHub Action to derive potential frontend updates.

import newPkg from './../../frontend/package.json' with { type: 'json' };
// @ts-expect-error package.old.json is generated dynamically in CI.
import oldPkg from './../../frontend/package.old.json' with { type: 'json' };

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const allDeps = new Set<string>([
  ...Object.keys(oldPkg.dependencies || {}),
  ...Object.keys(oldPkg.devDependencies || {}),
  ...Object.keys(newPkg.dependencies || {}),
  ...Object.keys(newPkg.devDependencies || {})
]);

const getVersion = (pkg: PackageJson, name: string): string => {
  return pkg.dependencies?.[name]
    ?? pkg.devDependencies?.[name]
    ?? 'not present';
};

for (const dep of Array.from(allDeps).sort()) {
  const oldVersion = getVersion(oldPkg, dep);
  const newVersion = getVersion(newPkg, dep);

  if (oldVersion !== newVersion) {
    console.log(`- ${dep}: ${oldVersion} → ${newVersion}`);
  }
}
