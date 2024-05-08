/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
    require('tailwindcss/nesting')(require('postcss-nested')),
  ],
};
