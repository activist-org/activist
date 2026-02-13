// SPDX-License-Identifier: AGPL-3.0-or-later
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import tailwind from "eslint-plugin-tailwindcss";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";

import withNuxt from "./.nuxt/eslint.config.mjs";

// Note: flat/strongly-recommended and flat/recommended are also options.
export default withNuxt(
  ...vue.configs["flat/essential"],
  ...tailwind.configs["flat/recommended"],
  { ignores: ["playwright-report/**", ".nuxt/**"] },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.vue"],

    plugins: {
      vue,
      "vuejs-accessibility": vueA11y,
      perfectionist,
      prettier,
    },

    settings: {
      tailwindcss: {
        // config: "tailwind.config.ts",
        // cssFiles: [
        //   "app/assets/css/tailwind.css",
        //   "!**/node_modules",
        // ],

        callees: ["classnames", "clsx", "ctl", "cva", "tv", "cn"],
      },
    },

    rules: {
      ...vue.configs.recommended.rules,

      "no-console": "error",
      "valid-v-for": "off",
      "vue/attribute-hyphenation": [
        "off",
        {
          ignore: [],
        },
      ],
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION",
            "GLOBAL",
            "CONDITIONALS",
            "LIST_RENDERING",
            "RENDER_MODIFIERS",
            ["UNIQUE", "SLOT"],
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "EVENTS",
            "CONTENT",
            "OTHER_ATTR",
          ],
          alphabetical: true,
        },
      ],
      "vue/block-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
      "vue/html-self-closing": "off",
      "vue/html-closing-bracket-newline": "error",
      "vue/multiline-html-element-content-newline": "error",
      "vue/singleline-html-element-content-newline": "error",
      "vue/multi-word-component-names": "off", // causes errors with page files
      "vue/no-empty-component-block": "error",
      "vue/no-multiple-template-root": "off",
      "vue/no-use-v-if-with-v-for": "off",
      "vue/require-default-prop": "off",
      "vue/require-v-for-key": "off",
      "vue/v-on-event-hyphenation": [
        "off",
        {
          autofix: false,
          ignore: [],
        },
      ],
      "vuejs-accessibility/label-has-for": [
        "error",
        {
          components: ["VLabel"],
          controlComponents: ["VInput"],
          required: {
            some: ["nesting", "id"],
          },
          allowChildren: false,
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],

      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-custom-classname": [
        "error",
        {
          whitelist: [
            "style-.*",
            "elem-.*",
            "responsive-.*",
            "card-.*",
            "focus-.*",
            "link-.*",
            "distinct-.*",
            "primary-.*",
            "warn-.*",
            "error-.*",
            "loading-pulse",
            "scrollbar.*",
            "light",
            "dark",
          ],
        },
      ],
    },
  }
);
