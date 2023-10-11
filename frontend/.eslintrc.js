module.exports = {
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin: vue/base",
  ],
  rules: {
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/multi-word-component-names": "off",
    "vue/no-empty-component-block": "error",
  },
};
