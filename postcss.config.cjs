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
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    }),
  ],
};
