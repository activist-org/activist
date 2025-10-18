// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".playwright-report/", ".nuxt/"])]);
