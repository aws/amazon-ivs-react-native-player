module.exports = {
  preset: 'ts-jest',
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.e2e.ts'],
  maxWorkers: 1,
  testTimeout: 2400000,
  verbose: true,
  reporters: ['detox/runners/jest/reporter'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
};
