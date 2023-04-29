module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'upper-case'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'test',
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'style',
        'revert',
        'perf',
        'ci',
      ],
    ],
  },
};
