module.exports = {
  automock: false,
  setupFiles: [
    './setupJest.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
