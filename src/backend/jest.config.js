module.exports = {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
    coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
};
