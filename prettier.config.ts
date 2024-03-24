type Config = {
  trailingComma: string;
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  plugins: any[];
  tailwindConfig: string;
};

const config: Config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./frontend/tailwind.config.ts",
};

export default config;
