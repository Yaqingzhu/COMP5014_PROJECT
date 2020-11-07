module.exports = {
  automock: false,
  setupFiles: [
    './setupJest.js'
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
