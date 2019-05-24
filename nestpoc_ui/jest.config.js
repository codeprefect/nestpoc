module.exports = {
  globals: {
    "ts-jest": {
      "allowSyntheticDefaultImports": true
    }
  },
  "preset": "jest-preset-angular",
  "setupFilesAfterEnv": [
    "<rootDir>/setup-jest.ts"
  ],
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "./",
  "transform": {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  "testMatch": [
    "<rootDir>/**/*.spec.ts"
  ],
  "moduleNameMapper": {
    "@nestpoc/(.*)": "<rootDir>/modules/$1"
  },
  "coverageDirectory": "./coverage",
  "collectCoverageFrom": [
    "<rootDir>/**/*.ts",
    "!<rootDir>/**/*.spec.ts",
    "!<rootDir>/**/index.ts",
    "!<rootDir>/*.ts",
    "!<rootDir>/**/*.d.ts",
    "!**/__mocks__/**/*.ts"
  ]
  // transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`],
};
