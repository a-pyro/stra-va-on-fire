const { resolve } = require('node:path')

const project = resolve(__dirname, 'tsconfig.json')

module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
  ],
  parserOptions: { project },
  settings: {
    'import/resolver': { typescript: { project } },
    // /**
    //  * enable MUI Joy components to be checked
    //  * @see {@link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y?tab=readme-ov-file#configurations}
    //  */
    // 'jsx-a11y': {
    //   polymorphicPropName: 'component',
    //   components: {
    //     Button: 'button',
    //     Icon: 'svg',
    //     IconButton: 'button',
    //     Image: 'img',
    //     Input: 'input',
    //     Link: 'a',
    //     List: 'ul',
    //     ListItem: 'li',
    //     ListItemButton: 'button',
    //     ListDivider: 'li',
    //     NextImage: 'img',
    //     NextLink: 'a',
    //     SvgIcon: 'svg',
    //     Textarea: 'textarea',
    //   },
    // },
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      { ignoreArrowShorthand: true },
    ],
    // '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],

    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    // sort named imports within an import statement
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
  },
  overrides: [
    // Next.js App Router file convention
    // Must use default export
    {
      files: [
        'app/**/page.tsx',
        'app/**/layout.tsx',
        'app/**/not-found.tsx',
        'app/**/*error.tsx',
        'app/**/loading.tsx',
        'app/sitemap.ts',
        'app/robots.ts',
        'app/manifest.ts',
        'app/opengraph-image.tsx',
        'app/twitter-image.tsx',
        'tailwind.config.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': ['error', { target: 'any' }],
      },
    },
    // module declarations
    {
      files: ['**/*.d.ts'],
      rules: { 'import/no-default-export': 'off' },
    },
  ],
}
