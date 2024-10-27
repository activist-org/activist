import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.js", "**/*.ts", "**/*.vue"],

  plugins: {
    vue,
    "vuejs-accessibility": vueA11y,
  },

  rules: {
    ...vue.configs.recommended.rules,

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
    "vue/component-tags-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/html-self-closing": "off",
    "vue/multi-word-component-names": "off",
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
  },
});
