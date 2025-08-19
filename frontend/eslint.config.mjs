// SPDX-License-Identifier: AGPL-3.0-or-later
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import withNuxt from "./.nuxt/eslint.config.mjs";

// Note: flat/strongly-recommended and flat/recommended are also options.
export default withNuxt(...vue.configs["flat/essential"], {
  files: ["**/*.js", "**/*.ts", "**/*.vue"],

  plugins: {
    vue,
    "vuejs-accessibility": vueA11y,
    perfectionist,
    prettier,
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
          "CONDITIONALS",
          "LIST_RENDERING",
          "RENDER_MODIFIERS",
          "TWO_WAY_BINDING",
          "OTHER_DIRECTIVES",
          "CONTENT",
          "EVENTS",
          "DEFINITION",
          ["UNIQUE", "SLOT"],
          "GLOBAL",
          "OTHER_ATTR",
        ],
        alphabetical: false,
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
  },
});
