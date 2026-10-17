// SPDX-License-Identifier: AGPL-3.0-or-later
// Note: Update FRONTEND_MAX_VERSIONS in dependency_update_check.yaml so update warnings are correct.
module.exports = {
  async constraints({ Yarn }) {
    for (const dep of Yarn.dependencies({ ident: "typescript" })) {
      dep.update(`6.0.3`);
    }
  },
};
