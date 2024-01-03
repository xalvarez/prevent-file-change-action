module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coveragePathIgnorePatterns: ['./src/index.ts'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  collectCoverage: false,
  collectCoverageFrom: ['./src/**'],
  verbose: true
}
