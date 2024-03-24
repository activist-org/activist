/** @type {import("prettier").Config} */


const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./frontend/tailwind.config.ts"
};

module.exports = config;
