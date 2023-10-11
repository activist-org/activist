module.exports = {
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
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
