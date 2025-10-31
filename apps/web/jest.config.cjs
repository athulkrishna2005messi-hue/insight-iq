const nextJest = require('next/jest')({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};

module.exports = nextJest(customJestConfig);
