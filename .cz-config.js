module.exports = {
  types: [
    { value: 'feat', name: 'feat: A new feature' },
    { value: 'fix', name: 'fix: A bug fix' },
    { value: 'docs', name: 'docs: Documentation only changes' },
    {
      value: 'style',
      name: 'style: Markup, white-space, formatting, missing semi-colons...',
    },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    { value: 'perf', name: 'perf: A code change that improves performance' },
    { value: 'test', name: 'test: Adding missing tests' },
    {
      value: 'chore',
      name: 'chore: Changes to the build process or auxiliary tools\n and libraries such as documentation generation',
    },
    { value: 'revert', name: 'revert: Revert to a commit' },
    { value: 'ci', name: 'ci: CI related changes' },
  ],

  messages: {
    type: "Select the type of change that you're committing:",
    scope:
      '\nDenote the SCOPE of this change, Jira ticket ID (e.g. GAMING-1091): (required):',
    customScope:
      '\nDenote the scope of this change, enter JIRA ticket ID (e.g. GAMING-1091): (required):',
    subject:
      'Write a short, imperative tense description of the change: (required)\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (MAJOR version): (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf', 'chore'],
  skipQuestions: ['body', 'footer'],
  subjectLimit: 100,
  upperCaseSubject: true,
};
