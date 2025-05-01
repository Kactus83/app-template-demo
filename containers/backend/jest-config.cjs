module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^@core/(.*)$': '<rootDir>/src/core/$1',
      '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    },
    setupFilesAfterEnv: ['./jest.setup.ts'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json', // Fichier de configuration de TypeScript spécifique pour les tests
      },
    },
  };
  