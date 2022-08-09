/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  modulePaths: ['<rootDir>/src/'],
  silent: false,
  verbose: true,
  detectOpenHandles: false,
  transform: {},
};
