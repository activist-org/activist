module.exports = {
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue/base",
    "@nuxt/eslint-config",
    "prettier",
  ],
  rules: {
    "vue/no-multiple-template-root": "off",
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/multi-word-component-names": "off",
    "vue/no-empty-component-block": "error",
    "vue/attribute-hyphenation": [
      "off",
      {
        ignore: [],
      },
    ],
    "vue/v-on-event-hyphenation": [
      "off",
      {
        autofix: false,
        ignore: [],
      },
    ],
    "vue/no-use-v-if-with-v-for": "off",
    "vue/require-default-prop": "off",
    "vue/require-v-for-key": "off",
    "valid-v-for": "off",
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
  },
};
