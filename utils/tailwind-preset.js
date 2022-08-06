const plugin = require('tailwindcss/plugin');
const pluginTypography = require('@tailwindcss/typography');
const { COLOR_THEMES, FONT_THEMES } = require('../themes');

const THEME = process.env.BLOG_THEME || 'default';
const FONT_PRIMARY = process.env.BLOG_FONT_HEADINGS || 'sans-serif';
const FONT_SECONDARY = process.env.BLOG_FONT_BODY || 'sans-serif';

const hoveredSiblingPlugin = plugin(function ({ addVariant, e }) {
  addVariant('hovered-sibling', ({ container }) => {
    container.walkRules((rule) => {
      rule.selector = `:hover + .hovered-sibling\\:${rule.selector.slice(1)}`;
    });
  });
});

const themesConfig = plugin(function ({ addComponents }) {
  const cssVars = {};

  Object.keys(COLOR_THEMES[THEME].colors).forEach((key) => {
    if (typeof COLOR_THEMES[THEME].colors[key] === 'object') {
      cssVars[`--color-${key}`] = `${COLOR_THEMES[THEME].colors[key][500]}`;
      Object.keys(COLOR_THEMES[THEME].colors[key]).forEach((index) => {
        cssVars[`--color-${key}-${index}`] = `${COLOR_THEMES[THEME].colors[key][index]}`;
      });
    } else {
      cssVars[`--color-${key}`] = `${COLOR_THEMES[THEME].colors[key]}`;
    }
  });

  cssVars['--font-primary'] = FONT_THEMES[FONT_PRIMARY];
  cssVars['--font-secondary'] = FONT_THEMES[FONT_SECONDARY];

  const themeCompiled = {
    '.theme-compiled': cssVars,
  };

  addComponents(themeCompiled);
});

module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        'gradient-1': 'var(--color-gradient-1)',
        'gradient-2': 'var(--color-gradient-2)',
        'gradient-3': 'var(--color-gradient-3)',
        'gradient-4': 'var(--color-gradient-4)',
      },
      fonts: {
        primary: 'var(--font-primary)',
        secondary: 'var(--font-secondary)',
      },
      typography(theme) {
        return {
          dark: {
            css: {
              color: theme('colors.gray.300'),
              '[class~="lead"]': { color: theme('colors.gray.400') },
              a: { color: theme('colors.gray.100') },
              strong: { color: theme('colors.gray.100') },
              'ul > li::before': { backgroundColor: theme('colors.gray.700') },
              hr: { borderColor: theme('colors.gray.800') },
              blockquote: {
                color: theme('colors.gray.100'),
                borderLeftColor: theme('colors.gray.800'),
              },
              h1: { color: theme('colors.gray.100') },
              h2: { color: theme('colors.gray.100') },
              h3: { color: theme('colors.gray.100') },
              h4: { color: theme('colors.gray.100') },
              code: { color: theme('colors.gray.100') },
              'a code': { color: theme('colors.gray.100') },
              pre: {
                color: theme('colors.gray.200'),
                backgroundColor: theme('colors.gray.800'),
              },
              thead: {
                color: theme('colors.gray.100'),
                borderBottomColor: theme('colors.gray.700'),
              },
              'tbody tr': { borderBottomColor: theme('colors.gray.800') },
            },
          },
        };
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      borderWidth: ['last', 'hovered-sibling'],
      typography: ['dark'],
    },
  },
  plugins: [hoveredSiblingPlugin, pluginTypography, themesConfig],
};
