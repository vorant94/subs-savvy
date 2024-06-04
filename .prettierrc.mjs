/**
 * @type {import("prettier").Config}
 */
export default {
  singleQuote: true,
  bracketSameLine: true,
  singleAttributePerLine: true,
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-css-order',
    'prettier-plugin-tailwindcss',
  ],
};
