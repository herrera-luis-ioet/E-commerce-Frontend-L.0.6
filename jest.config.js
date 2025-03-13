module.exports = {
  // Transform all files with Babel
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Don't ignore node_modules that use ES modules
  transformIgnorePatterns: [
    '/node_modules/(?!axios).+\\.js$'
  ],
  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  // Test environment
  testEnvironment: 'jsdom',
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
  // Module name mapper for non-JS modules
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js'
  }
};