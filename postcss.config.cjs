/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
    require('tailwindcss/nesting')(require('postcss-nested')),
    require('postcss-preset-mantine'),
    require('postcss-simple-vars')({
      variables: {
        'mantine-breakpoint-xs': '640px',
        'mantine-breakpoint-sm': '768px',
        'mantine-breakpoint-md': '1024px',
        'mantine-breakpoint-lg': '1280px',
        'mantine-breakpoint-xl': '1536px',
      },
    }),
  ],
};
