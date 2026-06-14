const OFF = 'off';
const ERROR = 'error';
// const WARN = 'warn';

module.exports = {
  root          : true,
  parser        : '@typescript-eslint/parser',
  plugins       : [
    '@typescript-eslint',
  ],
  extends       : [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env           : {
    node : true,
    mocha: true,
    jest : true,
  },
  ignorePatterns: [
    'node_modules',
  ],
  rules         : {
    '@typescript-eslint/ban-ts-comment'    : [
      ERROR,
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore'      : 'allow-with-description',
        'ts-nocheck'     : 'allow-with-description',
        'ts-check'       : 'allow-with-description',
      }
    ],
    'no-shadow'                            : OFF,
    '@typescript-eslint/no-shadow'         : ERROR,
    '@typescript-eslint/no-empty-interface': OFF, // 允许空 interface 因为需要对类进行扩展描述
    '@typescript-eslint/no-explicit-any'   : ERROR, // 禁止使用 any
  }
};