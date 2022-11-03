module.exports = {
  printWidth: 100,
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      options: {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        useTabs: false,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
}
