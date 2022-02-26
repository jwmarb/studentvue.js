/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src/'],
  silent: false,
  verbose: true,
  detectOpenHandles: false,
  transform: {},
};
