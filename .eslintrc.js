const plugins = ['import'];
const extendsArray = [
  'eslint:recommended',
  'airbnb-base',
  'plugin:monorepo/recommended',
  'prettier',
];

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2024,
  },
  plugins,
  extends: extendsArray,
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: [
        '.bin/**/*',
        '**/*.spec.{js,ts}',
        '**/__mocks__/**',
        '**/__tests__/**',
        '**/__fixtures__/**',
        'config/**',
      ],
      plugins: [...plugins, 'jest', 'jest-extended'],
      extends: [
        ...extendsArray,
        'plugin:jest/recommended',
        'plugin:jest-extended/all',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
        'no-empty': ['error', { allowEmptyCatch: true }],
      },
    },
  ],
};
