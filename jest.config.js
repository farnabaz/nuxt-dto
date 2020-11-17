module.exports = {
  preset: '@nuxt/test-utils',
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/plugins/http.ts'
  ],
  coverageDirectory: 'test/coverage',
  testMatch: [
    '**/tests/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)'
  ]
}
